'use strict';

const mqtt = require("mqtt");
console.log("connecting to broker");
const client = mqtt.connect("mqtt://192.168.43.217");

client.on("connect", () =>{
    console.log("Subscribing");
    client.subscribe("rfidData");
    console.log("I've subscribed.")
})

client.on("message", (topic, message) =>{
    console.log("I got a message")
    async function checkIfLoaded () {
        var rfidPayload = JSON.parse(message.toString());
        console.log(rfidPayload);
        while (rfidPayload !== null) {
            console.log("Please place the tag on the reader!");
            return await module.exports.rfidPayload == rfidPayload;
        }
    }
    checkIfLoaded()
})

