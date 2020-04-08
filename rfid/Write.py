#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
        carKey = input('Please type in the carKey you received when request this car: ')
        print("Now place your key to write")
        reader.write(carKey)
        print("Written: " + carKey)
finally:
        GPIO.cleanup()