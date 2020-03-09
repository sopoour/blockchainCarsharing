/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const mqtt = require("mqtt");

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        //TRY: add rfidData as that is the returned object in the RFID_subscribe,js so e.g. rfidData.rfidData.carKey

        console.log("connecting to broker");
        const client = mqtt.connect("mqtt://192.168.43.217");
        var success = false;
        
        client.on("connect", () =>{
            console.log("Subscribing");
            client.subscribe("rfidData");
            console.log("Please hold your tag on the RFID reader. Wait...");
        });

        client.on("message", (topic, message) =>{
            var rfidPayload = JSON.parse(message.toString());
            var carKeyIn = rfidPayload.carKey;
            var renterIDIn = rfidPayload.renterID;
            var timestampIn = rfidPayload.timestamp;
            console.log(rfidPayload);

            contract.submitTransaction('openCar', carKeyIn, renterIDIn, timestampIn);
            success = true;
            console.log("Success? " + success);
            return success;
        });

        client.stream.on('error', (err) => {
            console.log('errorMessage', err);
            client.end()
        });       

        client.on("offline",() =>{
            console.log("offline");
        });

        client.on("reconnect", ()=>{
            console.log("reconnect");
        });

        // Disconnect from the gateway.
        if (success === true){
            client.end();
            gateway.disconnect();
        };
           
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
