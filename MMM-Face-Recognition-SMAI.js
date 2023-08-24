Module.register("MMM-Face-Recognition-SMAI", {


defaults: {
  prompt: "Use FaceID to access profiles",
  fileUrl: "modules/MMM-Face-Recognition-SMAI/public/",
  width: "200px",
  position: "left",
  refreshInterval: 2
},

start: function () {
  this.loggedIn = false
  this.count = 0
},

getStyles: function () {
        return [
            this.file('css/mmm-style.css')
        ];
    },


getDom: function() {
  console.log("getDom")
  var element = document.createElement("div")
  element.className = "face-image"
  // element.innerHTML = this.config.prompt

  var greeting = document.createElement("p")
  greeting.id = "GREET"
  greeting.classList.add(this.config.position)
  greeting.style.width = this.config.width
  element.appendChild(greeting)

  var img = document.createElement("img");
  img.id = "IMG"
  img.setAttribute('src', this.config.fileUrl + "logo.png");
  element.appendChild(img);

  var wrapperCtrl = document.createElement("div")
  wrapperCtrl.calassName = "wrapper"

  var faceID = document.createElement("button")
  faceID.className = "btn"
  faceID.id = "FaceID"
  faceID.textContent = "FaceID"
  faceID.addEventListener('click', () => {
    if(this.loggedIn === true) {
      this.loggedIn === false
      sendSocketNotification("LOGOUT")
    }
    else {
      this.loggedIn === true
      this.sendSocketNotification("FACE_ID")
    }
  })
  wrapperCtrl.appendChild(faceID)

  var addProfile = document.createElement("button")
  addProfile.className = "btn"
  addProfile.id = "ADD"
  addProfile.textContent = "Add Profile"
  addProfile.addEventListener('click', () => {
    this.sendSocketNotification("ADD_PROFILE")
  })
  wrapperCtrl.appendChild(addProfile)

  element.appendChild(wrapperCtrl)

  return element
},

Create Socket Connnection with nodehelper.js
notificationReceived: function(notification, payload, sender) {
  switch(notification) {
    case "DOM_OBJECTS_CREATED":
      var timer = setInterval(()=>{
        this.sendSocketNotification("RENDER", this.count)
        this.count++
      }, 1000)
      break
  }
},

//Recieve notification from socket of Python Variables via nodehelper.js
socketNotificationReceived: function(notification, payload) {
  var button = document.getElementById("FaceID")
  var elem = document.getElementById("GREET")
  var img = document.getElementById("IMG")
    switch(notification) {
      case "KNOWN":
        //Store Image Here
        button.textContent = "Log Out"
        elem.innerHTML = "Welcome back, " + payload
        img.setAttribute('src', this.config.fileUrl + "faces/" + payload + "-id.png")
        return elem
        break

      case "UNKNOWN":
        button.textContent = "Log Out"
        elem.innerHTML = "Hello, unknown user"
        img.setAttribute('src', this.config.fileUrl + "guest.gif")
        return elem
        break

      case "LOGOUT":
        button.textContent = "FaceID"
        elem.innerHTML = this.config.prompt
        img.setAttribute('src', this.config.fileUrl + "logo.png")
        return elem
        break
  }
},

})
