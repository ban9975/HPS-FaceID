# HPS-Smart-Mirror-FaceID

A module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by adding (faceID) face recognition.

## How it works
This module allows you to access profiles using face recognition. This works on the back of OpenCV face recognition module. 

## Screenshots
| ![FaceID Logged Out](img/readme/noUser.png) | ![Face ID Detected](img/readme/knownUser.png) | ![Face ID Unknown User](img/readme/unknownUser.png) |
|---|---|---|
| A logo as default | User has been recognised | Unknown user has been recognised |


## Preconditions

* MagicMirror<sup>2</sup> instance
* Node.js version >= 7
* npm
* [OpenCV face-recognition](https://github.com/ageitgey/face_recognition)
* Raspberry Pi 3 Model B
* Raspbery Pi Camera Module 2


## Step 1 – Install the module
In your MagicMirror directory:

```bash cd modules
   git clone https://github.com/ban9975/HPS-FaceID.git
   cd MMM-Smart-Mirror-FaceID
   npm install
```

## Step 2 – Add files to the Config.js
Here is an example for an entry in `config.js`

```javascript
{
  module: "MMM-HPS-FaceID",
  position: "top_right",
  config: {
    //prompt: "Put in your own text"
  }
}
```

## Step 3 – Configuring the Face Recognition Python Script
**Pre-requisite:** Ageitgey Face_recognition Library is installed:
