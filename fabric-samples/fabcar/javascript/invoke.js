/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network')
const path = require('path');
const mqtt = require("async-mqtt");

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

        async function run(){
             //Connect to Broker
            console.log("connecting to broker");
        
            const client = await mqtt.connectAsync("mqtt://192.168.0.25");
            var success = false;
            console.log("Starting with MQTT");
            try{
                console.log("Subscribing");
                await client.subscribe("rfidData");
                console.log("Please hold your tag on the RFID reader. Wait...");
                
                await client.on("message", (topic, message) =>{
                    var rfidPayload = JSON.parse(message.toString());
                    console.log(rfidPayload);
                    var carKeyIn = rfidPayload.carKey;
                    var renterIDIn = rfidPayload.renterID;
                    var timestampIn = rfidPayload.timestamp;
                    console.log(rfidPayload);
        
                    contract.submitTransaction('openCar', carKeyIn, renterIDIn, timestampIn);
                    success = true;
                    console.log("Transaction successful? " + success);
                    // Publish new topic back to RPi
                    if (success == true){
                        client.publish("RpiActuator", "Verified")
                        console.log("Published Topic")
                    }
                });

                await client.stream.on('error', (err) => {
                    console.log('errorMessage', err);
                    client.end()
                });       
        
                await client.on("offline",() =>{
                    console.log("offline");
                });
        
                await client.on("reconnect", ()=>{
                    console.log("reconnect");
                });
        
                // This line doesn't run until the server responds to the publish
                await client.end();
                console.log("DONE")
            }
            catch(error){
                console.error(`Failed Submission: ${error}`);
                process.exit(1);
            }
        }

        run()

        //Subscribe to topic
        /*await client.on("connect", () =>{
            console.log("Subscribing");
            client.subscribe("rfidData");
            console.log("Please hold your tag on the RFID reader. Wait...");
        });
        
        
        //listen to a message and submit respective transaction
        await client.on("message", (topic, message) =>{
            var rfidPayload = JSON.parse(message.toString());
            var carKeyIn = rfidPayload.carKey;
            var renterIDIn = rfidPayload.renterID;
            var timestampIn = rfidPayload.timestamp;
            console.log(rfidPayload);

            contract.submitTransaction('openCar', carKeyIn, renterIDIn, timestampIn);            
            success = true;
            console.log("Success? " + success);
            //client.end()
            // Publish new topic back to RPi
            if (success == true){
                client.publish("RpiActuator", "Verified")
                console.log("Published Topic")
            }
            return success, client.end();
        });
        */

        
        // Disconnect from the gateway.
        await gateway.disconnect();

           
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
