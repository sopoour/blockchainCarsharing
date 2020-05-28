# Prototype for a Blockchain-based Car sharing Platform
This repo represents a prototype built for our Master Thesis. The prototype represents one transaction "unlock a car" wthin the use case "keyless vehicle access control". In this way, it simulates the unlocking of a car by having a Raspberry Pi representing the server of the car, an RFID sensor as the car lock, and the RFID tag as the keyless option to open the door. Overall, our focus in this prototype has been to explore the interaction between an IoT device (RFID with RPi) and the blockchain network (Hyperledger Fabric).
</br></br>The basic setup is as followed:

### Hardware:
* Raspberry Pi 3 Model B+
* RFID reader/sensor (RC522) and RFID tag (Milfare1 S50 non-standard)
* Messaging Protocol MQTT used to send the data in a JSON payload to the blockchain network
* Libraries: Paho MQTT, SimpleMRFC522 and Mosquitto
* Written in Python

### Software:
* Using VMWare (Ubuntu) that represents one blockchain node locally
* Blockchain network based on _First Network_ sample by Hyperledger Fabric
* Blockchain application based on _Fabcar_ sample by Hyperledger Fabric
* Written in Node.js

### Result:
* "User" data is sent from the Raspberry Pi to the VM blockchain node when opening the car (holding the RFID tag against the reader)
* Transaction is submitted and verified in the blockchain checking whether the user ID matches with the one stored in the ledger
* End-result: having a submitted transaction and a newly created block

