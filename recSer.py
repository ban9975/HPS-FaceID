# if __name__ == '__main__':
#     if len(sys.argv) < 2:
#         print('no argument')
#     elif sys.argv[1] == 'encode':
#         encodeKnown()
#         exit()
        
#     camera = picamera.PiCamera()
#     camera.resolution = (480, 640)
#     output = np.empty((640, 480, 3), dtype=np.uint8)
    
#     face_locations = []
#     while True:
#         # print("capturing")
#         camera.capture(output, format="rgb")
#         face_locations = face_recognition.face_locations(output)
#         if len(face_locations) > 0:
#             # print("{} faces detected".format(len(face_locations)))
#             break
#     face_encodings = []
#     face_encodings = face_recognition.face_encodings(output, face_locations)

#     if sys.argv[1] == 'add':
#         saveFace(face_encodings, output)
#     elif sys.argv[1] == 'rec':
#         rec(face_encodings)
    
# server
import socket
import pickle
import sys
import face_recognition
import picamera
import numpy as np
import os
import time
from PIL import Image
import json

def encodeKnown():
    # encode known faces
    known_people = [] # names
    temp_image = [] # image object
    known_face_encodings = [] # encoded objects
    for file in os.listdir("./public/faces"):
        try:
            known_people.append(file.replace(".png",""))
            file = os.path.join("./public/faces/", file)
            temp_image = face_recognition.load_image_file(file)
            known_face_encodings.append(face_recognition.face_encodings(temp_image)[0].tolist())

        except Exception as e:
            pass

    encodedJson = {name: encodedImg for name, encodedImg in zip(known_people, known_face_encodings)}
    with open('./faces.json', 'w') as f:
        json.dump(encodedJson, f, indent=2)


def rec(face_encodings):
    # load known faces
    known_people = [] # names
    known_face_encodings = [] # encoded objects
    with open('./modules/MMM-Face-Recognition-SMAI/faces.json', 'r') as f:
        data = json.load(f)
        for iterator in data:
            known_people.append(iterator)
            known_face_encodings.append(data[iterator])

    face_id = "Guest"
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        print(matches)
        
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            face_id = known_people[best_match_index]
            break

    print("Person Detected: {}!".format(face_id))
    with open('./modules/MMM-Face-Recognition-SMAI/faceID.json', 'r') as f:
        data = json.load(f)
        data['user'] = face_id
    with open('./modules/MMM-Face-Recognition-SMAI/faceID.json', 'w') as f:
        json.dump(data, f, indent=2)
    return face_id

def saveFace(face_encodings, output):
    with open('./modules/MMM-Face-Recognition-SMAI/faceID.json', 'r') as f:
        data = json.load(f)
        newUser = 'User' + str(data['count'])
        data['count'] += 1
        data['user'] = newUser
    with open('./modules/MMM-Face-Recognition-SMAI/faceID.json', 'w') as f:
        json.dump(data, f, indent=2)

    img = Image.fromarray(output, mode="RGB")
    img.save('./modules/MMM-Face-Recognition-SMAI/public/faces/'+newUser+'.png')

    with open('./modules/MMM-Face-Recognition-SMAI/faces.json', 'r') as f:
        data = json.load(f)
        data[newUser] = face_encodings[0].tolist()
    with open('./modules/MMM-Face-Recognition-SMAI/faces.json', 'w') as f:
        json.dump(data, f, indent=2)
    return newUser

if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'encode':
            encodeKnown()
            exit()

    HOST = ''                 # Symbolic name meaning all available interfaces
    PORT = 50007              # Arbitrary non-privileged port
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((HOST, PORT))
    s.listen(1)
    print('listening...')
    while True:
        conn, addr = s.accept()
        print ('Connected by', addr)
        while True:
            chunk = conn.recv(32768)
            img = face_recognition.load_image_file('./modules/MMM-Face-Recognition-SMAI/tmp.png')
            face_locations = face_recognition.face_locations(img)
            if len(face_locations) > 0:
                print('{} faces detected'.format(len(face_locations)))
                imgEncodings = face_recognition.face_encodings(img)
                command = pickle.loads(chunk)
                print(command)
                if command == 'add':
                    newUser = saveFace(imgEncodings, img)
                    conn.sendall(bytes(newUser, encoding='utf-8'))
                elif command == 'rec':
                    knownUser = rec(imgEncodings)
                    conn.sendall(bytes(knownUser, encoding='utf-8'))
                break
            else:
                print('no faces detected')
                conn.sendall(bytes('retake', encoding='utf-8'))

        conn.close()
