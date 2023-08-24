var util = require("util")
const {spawn} = require('child_process')
// import { promises as fs } from 'fs'


/// node_helper.js
var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.countDown = 10000000
  },
  socketNotificationReceived: function(notification, payload) {
    var helper = this
    switch(notification) {
      case "FACE_ID":
        console.log("face id")
        var rec = spawn('python3', ['./modules/MMM-Face-Recognition-SMAI/rec.py', 'rec'])
        rec.stdout.on('data', function(data) {
          console.log(data.toString())
          helper.sendSocketNotification("SAVED")
          console.log("helper send saved")
        })
        break
      case "ADD_PROFILE":
        console.log("add profile")
        var add = spawn('python3', ['./modules/MMM-Face-Recognition-SMAI/rec.py', 'add'])
        add.stdout.on('data', function(data) {
          console.log(data.toString())
          name = data.toString()
          helper.sendSocketNotification("NEWPROFILE", name)
        })
        break
      case "LOGOUT":
        console.log("log out")
        helper.sendSocketNotification("LOGGEDOUT")
        var fs = require('fs').promises
        async function logout() {
          json = await fs.readFile("./modules/MMM-Face-Recognition-SMAI/faceID.json")
                       .catch((err) => console.error('Fail to read file', err))
          data = JSON.parse(json)
          data.user = "Logout"
          updated = JSON.stringify(data, null, 2);
          await fs.writeFile("./modules/MMM-Face-Recognition-SMAI/faceID.json", updated, 'utf8')
                .catch((err) => console.error('Fail to write file', err))
          helper.sendSocketNotification("SAVED")
        }
        logout()
        break
      case "RENDER":
        console.log("render")
        var fs = require('fs').promises;
        async function readName() {
          json = await fs.readFile("./modules/MMM-Face-Recognition-SMAI/faceID.json")
                       .catch((err) => console.error('Fail to read file', err))
          data = JSON.parse(json)
          face_rec_name = data.user

          if(face_rec_name === "Guest") {
            console.log("helper send unknown")
              helper.sendSocketNotification("UNKNOWN")
          }
          else if(face_rec_name === "Logout") {
            console.log("helper send logout")
            helper.sendSocketNotification("LOGGEDOUT")
          }
          else {
            console.log("helper send known")
            helper.sendSocketNotification("KNOWN", face_rec_name)
          }
        }
        readName()
        break
    }
  },
})
