/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        //
        const cars = [
            {
                carID: '123',
                leaseeID: '456',
                renterID: '789',
                currentOwner: '456',
                startTime: '12:00',
                endTime: '13:00',
                status: 'requested',
            },
            {
                carID: '123a',
                leaseeID: '456a',
                renterID: '789a',
                currentOwner: '456a',
                startTime: '12:00',
                endTime: '13:00',
                status: 'requested',
            },
            {
                carID: '123b',
                leaseeID: '456b',
                renterID: '',
                currentOwner: '456b',
                startTime: '',
                endTime: '',
                status: 'added',
            },
            {
                carID: '123c',
                leaseeID: '456c',
                renterID: '',
                currentOwner: '456c',
                startTime: '',
                endTime: '',
                status: 'added',
            },
            {
                carID: '123d',
                leaseeID: '456',
                renterID: '',
                currentOwner: '456',
                startTime: '',
                endTime: '',
                status: 'close',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, leaseeID, renterID, currentOwner, startTime, endTime, status) {
        console.info('============= START : Create Car ===========');

        const car = {
            carID,
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
