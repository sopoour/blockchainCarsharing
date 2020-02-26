'use strict';

const mqtt = require("mqtt")
console.log("connecting to broker")
const client = mqtt.connect("mqtt://192.168.43.217")

client.on("connect", () =>{
    console.log("Subscribing")
    client.subscribe("rfidData")
})

client.on("message", (topic, message) =>{
    var rfidData = JSON.parse(message.toString())
    console.log(rfidData)
    return rfidData
})