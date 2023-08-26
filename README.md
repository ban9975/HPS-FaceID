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
   git clone https://github.com/ban9975/HPS-Smart-Mirror-FaceID.git
   cd HPS-Smart-Mirror-FaceID
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

## Appendix - Instruction for precoditions
1. Magic Mirror
   ``` bash
   cd ~
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   git clone https://github.com/MichMich/MagicMirror
   cd MagicMirror/
   npm run install-mm
   cp config/config.js.sample config/config.js
   ```
2. Install dependencies for face recognition
   ``` bash
   sudo apt-get -y update
   sudo apt-get -y upgrade
   sudo apt-get install -y --fix-missing \
       build-essential \
       cmake \
       gfortran \
       wget \
       curl \
       graphicsmagick \
       libgraphicsmagick1-dev \
       libatlas-base-dev \
       libavcodec-dev \
       libavformat-dev \
       libboost-all-dev \
       libgtk2.0-dev \
       libjpeg-dev \
       liblapack-dev \
       libswscale-dev \
       pkg-config \
       python3-dev \
       python3-numpy \
       python3-pip \
       software-properties-common \
       zip \
       python3-picamera
       && sudo apt-get clean && sydo rm -rf /tmp/* /var/tmp/*
   sudo pip3 install --upgrade picamera[array]
   ```
3. Install dlib
   ``` bash
   sudo nano /etc/dphys-swapfile
   ```
   Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=1024 and save / exit nano
   ``` bash
   sudo /etc/init.d/dphys-swapfile restart
   git clone https://github.com/davisking/dlib.git
   cd dlib
   mkdir build; cd build; cmake ..; cmake --build .
   cd ..
   python3 setup.py install
   ```
   It takes some time to install dlib.
4. Install face recognition
   ``` bash
   sudo pip3 install face_recognition
   ```
5. Install dependancies for this module
   ``` bash
   pip install Pillow
   ```
