const { createClient } = require('redis');

// setting redis
const client = createClient({
    password: process.env.REDIS_PW || "",
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});
client.connect()

module.exports = { client };
