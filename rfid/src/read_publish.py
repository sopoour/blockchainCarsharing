#!/usr/bin/env python

import RPi.GPIO as GPIO
import time
import json
import sys
from mfrc522 import SimpleMFRC522
import paho.mqtt.client as mqtt

reader = SimpleMFRC522()

client = mqtt.Client("RFID2020")

try:
        print("Please place your key against the reader")

        def get_time():
                #Returns a string with the time and date
                return time.strftime("%d %b %Y %H:%M:%S", time.gmtime())
        #carKey = e.g. CAR1 --> be written on the tag
        id, carKey = reader.read()
        carKey = carKey.strip()
        rfidData = json.dumps({"carKey": carKey, "renterID": str(id), "timestamp": get_time()})
        print("Connecting to Broker")
        client.connect("192.168.43.217")
        print("Publishing RFID Data" + rfidData)
        client.publish("rfidData", rfidData)
#except:
 #       print ("Couldn't open reader!")
  #      sys.exit()
finally:
        GPIO.cleanup()



