#!/usr/bin/env python

import RPi.GPIO as GPIO
import time
import json
import sys
from mfrc522 import SimpleMFRC522
import paho.mqtt.client as mqtt

client = mqtt.Client("RFID2020")
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to broker")
        global Connected                #Use global variable
        Connected = True                #Signal connection 
    else:
        print("Connection failed")

def on_message(client, userdata, message):
    print ("Message received: "  + message.payload)


try:
        client.connect("192.168.43.217")
        client.subscribe("RFIDActuator")
        client.on_connect= on_connect
        client.on_message = on_message

        if on_message == True:
                print("The car has been successfully opened.")
#except:
 #       print ("Couldn't open reader!")
  #      sys.exit()
finally:
        GPIO.cleanup()