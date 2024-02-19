require('dotenv/config');
const { client } = require('../services/db/connect');

const run = async () => {
    // await client.isReady;
    await client.hSet('car', {
        color: 'red',
        year: 1950,
        engine: JSON.stringify({ cylinders: 8 }), // Make sure to stringify complex objects
        owner: null || '',
        service: undefined || '',
    });

    // Now perform other operations on the client
    const car = await client.hGetAll('car');


    if (Object.keys(car).length === 0) {
        console.log("No car object, 404");
        return;
    }

    console.log(car); // { color: 'red', year: '1950' }
};

run();