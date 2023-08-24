var util = require("util")
var spawn = require('child_process')


/// node_helper.js
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.countDown = 10000000
  },
  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
      case "FACE_ID":
        var rec = spawn('python3', ['./modules/MMM-Face-Recognition-SMAI/rec.py rec'])
        break
      case "ADD_PROFILE":
        var add = spawn('python3', ['./modules/MMM-Face-Recognition-SMAI/rec.py add'])
        break
      case "LOGOUT":
        var fs = require('fs');
        fs.readFile("./modules/MMM-Face-Recognition-SMAI/faceID.json", (err,json) => {
            if(err)
                console.log(err)
            else
                let data = JSON.parse(json)
                data.user = "Logout"
                let updated = JSON.stringify(data, null, 2);
                fs.writeFile("./modules/MMM-Face-Recognition-SMAI/faceID.json", updated, 'utf8', (err) => {})
            // console.log(20, face_rec_name);
        })
        break
      case "RENDER":
        var fs = require('fs');
        fs.readFile("./modules/MMM-Face-Recognition-SMAI/faceID.json", (err,json) => {
            if(err)
                console.log(err)
            else
                let data = JSON.parse(json)
                face_rec_name = data.user
            // console.log(20, face_rec_name);
        })
        if(face_rec_name === "Guest") {
            this.sendSocketNotification("UNKNOWN")
        }
        else if(face_rec_name === "Logout") {
          this.sendSocketNotification("LOGOUT")
        }
        else {
            this.sendSocketNotification("KNOWN", face_rec_name)
        }
        break
    }
  },
})
