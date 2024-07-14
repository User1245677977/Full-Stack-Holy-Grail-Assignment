const express = require('express');
const redis = require('redis');
const app = express();
const port = 3000;

// Create a Redis client
const client = redis.createClient();

// Connect to Redis
client.on('connect', function() {
    console.log('Connected to Redis...');
});

// Initialize values
const initialValues = {
    header: 0,
    left: 0,
    article: 0,
    right: 0,
    footer: 0
};

Object.entries(initialValues).forEach(([key, value]) => {
    client.set(key, value);
});

// Data function to get values from Redis
const data = () => {
    return new Promise((resolve, reject) => {
        client.mget(['header', 'left', 'article', 'right', 'footer'], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    header: result[0],
                    left: result[1],
                    article: result[2],
                    right: result[3],
                    footer: result[4]
                });
            }
        });
    });
};

// Endpoint to get data
app.get('/data', async (req, res) => {
    try {
        const result = await data();
        res.json(result);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Endpoint to update key-value pair
app.get('/update/:key/:value', (req, res) => {
    const { key, value } = req.params;
    client.set(key, value, (err, reply) => {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send(`Updated ${key} to ${value}`);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.log('Redis error: ', err);
});

client.connect()
    .then(() => {
        console.log('Connected to Redis');
        // Now you can use the Redis client
        // Example:
        client.set('key', 'value', (err, reply) => {
            if (err) throw err;
            console.log(reply);
        });
    })
    .catch((err) => {
        console.error('Error connecting to Redis:', err);
    });

// Use client as needed

// Close the client when done
// client.quit();
async function main() {
    try {
        await client.connect();
        console.log('Connected to Redis');

        // Perform Redis operations
        await client.set('key', 'value');
        const value = await client.get('key');
        console.log('Value:', value);

        // Close the client when done
        await client.quit();
    } catch (err) {
        console.error('Redis error:', err);
    }
}

main();
