# SMAI client
import socket
import sys
import pickle
import picamera
from PIL import Image
import numpy as np


if __name__ == '__main__':
    HOST = ''    # The remote host
    PORT = 50007              # The same port as used by the server
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))

    if len(sys.argv) == 0:
        print('no argument')
        exit()
    else:
        command = pickle.dumps(sys.argv[1])

    camera = picamera.PiCamera()
    camera.resolution = (256, 320)
    output = np.empty((320, 256, 3), dtype=np.uint8)
    while True:
        camera.capture(output, format="rgb")
        img = Image.fromarray(output, mode="RGB")
        img.save('./modules/MMM-Face-Recognition-SMAI/tmp.png')
        s.sendall(command)
        res = s.recv(1024).decode('utf-8')
        if res != "retake":
            break
    print(res, end='')
    s.close()
