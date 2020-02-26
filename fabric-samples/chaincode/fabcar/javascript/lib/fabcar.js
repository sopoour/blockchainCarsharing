/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api'), events = require("./events");

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            //carKey = CAR0
            {
                licenseID: '123',
                leaseeID: '456',
                renterID: '789',
                currentOwner: '456',
                startTime: '12:00',
                endTime: '13:00',
                status: 'requested',
            },
            //carKey = CAR1
            {
                licenseID: '123a',
                leaseeID: '456a',
                renterID: '789a',
                currentOwner: '456a',
                startTime: '12:00',
                endTime: '13:00',
                status: 'requested',
            },
            //carKey = CAR2
            {
                licenseID: '123b',
                leaseeID: '456b',
                renterID: '',
                currentOwner: '456b',
                startTime: '',
                endTime: '',
                status: 'ready',
            },
            //carKey = CAR3
            {
                licenseID: '123c',
                leaseeID: '456c',
                renterID: '',
                currentOwner: '456c',
                startTime: '',
                endTime: '',
                status: 'ready',
            },
            //carKey = CAR4
            {
                licenseID: '123d',
                leaseeID: '456',
                renterID: '',
                currentOwner: '456',
                startTime: '',
                endTime: '',
                status: 'ready',
            },
        ];
        //carKey
        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carKey) {
        const carAsBytes = await ctx.stub.getState(carKey); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carKey} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, leaseeID, renterID, currentOwner, startTime, endTime, status) {
        console.info('============= START : Create Car ===========');

        const car = {
            licenseID,
            docType: 'car',
            leaseeID,
            renterID,
            currentOwner,
            startTime,
            endTime,
            status
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    //carKey = similar to a booking number 
    //as soon as the leasee registers a car, a carKey is generated (e.g. CAR1) which the renter will get
    //renter types in this carKey in its app (in real life), in our case he writes it on the RFID tag
    async openCar (ctx, carKey, renterID, startTime) {
        console.info("openCar Process is starting");

        const carKeyAsBytes = await ctx.stub.getState(carKey); //get the car from chaincode state
        if (!carKeyAsBytes || carKeyAsBytes.length === 0) {
            throw new Error(`${carKey} does not exist`);
        }

        const car = JSON.parse(carKeyAsBytes.toString());
        
        if (car.renterID !== renterID) {
            throw new Error(`${renterID} does not match with any car request. Please request a car first!`);
        }

        if (car.status == "open") {
            throw new Error(`Car is already opened.`);
        }
            
        //change status of car from requested to open
        car.status = "open"
        car.startTime = startTime.toString()

    
        //create payload object which is sent to client application & back to RPi
        ctx.stub.setEvent(events.TransferRequested,Buffer.from(JSON.stringify({
            statusCar: car.status,
        })));
        

        //Change state of our car in ledger
        await ctx.stub.putState(carKey, Buffer.from(JSON.stringify(car)));

    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
