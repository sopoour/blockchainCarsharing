# Prototype for a Blockchain-based Car sharing Platform
This repo represents a prototype built for our Master Thesis. The prototype represents one transaction "unlock a car" wthin the use case "keyless vehicle access control". In this way, it simulates the unlocking of a car by having a Raspberry Pi representing the server of the car, an RFID sensor as the car lock, and the RFID tag as the keyless option to open the door. The transaction is verified in the blockchain network of Hyperledger Fabric. Overall, our focus in this prototype has been to explore the interaction between an IoT device (RFID with RPi) and the blockchain network (Hyperledger Fabric).
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

### Directory Structure & Explanation for deployment:

See an entire deployment demo in this video [here](https://drive.google.com/file/d/1wk_z-Ti5fUyFVi7dkvbGx0Vwpg0IA3VX/view) as well as more about the whole development enviorment and step-by-step guide to deploy in our [Master Thesis](https://drive.google.com/file/d/1mdVALF9bJ8md4Grnq4ViH3_eP_C05UzR/view?usp=sharing)
</br></br>
For a first getting started and overview of the relevant programs in the directories:
1. Run in VM the shell script <code>./startFabric.sh javascript</code> stored in <code>fabcar</code> folder in order to start the first-network creating two organizations and a channel as well as to deploy the smart contract <code>fabcar</code> stored in <code>chaincode </code> > <code>fabcar</code> > <code> lib </code>. 
1. Run the node.js <code>node enrollAdmin.js</code> and <code>node registerUser.js</code> in the folder <code>fabcar</code> > <code>javascript</code> in order to register the two users admin and user1
1. Run the node.js <code>node invoke.js</code> in the same folder as before
1. Run on RPi the Python file <code>read_publis.py</code> in the <code>rfid</code> folder in order to publish a topic to the network </br></br>

Here the directory structure:
```bash
├───fabric-samples
│   ├───balance-transfer
│   │   ├─── ...
│   ├───basic-network
│   │   ├─── ...
│   ├───bin
│   ├───chaincode
│   │   ├─── ...
│   │   ├───fabcar
│   │   │   ├─── ...
│   │   │   ├───javascript
│   │   │   │   └───lib
│   │   │   ├─── ...
│   │   ├─── ...
│   ├───chaincode-docker-devmode
│   │   └─── ...
│   ├───ci
│   ├───commercial-paper
│   │   ├─── ...
│   ├───docs
│   ├───fabcar
│   │   ├─── ...
│   │   ├───javascript
│   │   │   └───Fetched_Blocks
│   │   ├─── ...
│   ├───first-network
│   │   ├───base
│   │   ├───channel-artifacts
│   │   ├───org3-artifacts
│   │   └───scripts
│   ├───high-throughput
│   │   ├─── ...
│   ├───interest_rate_swaps
│   │   ├─── ...
│   ├───off_chain_data
│   └───scripts
│       ├───ci_scripts
│       └───Jenkins_Scripts
└───rfid
    ├───Example
    ├───SPI-Py
    ├───src
'''
