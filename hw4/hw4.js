const http = require('http');
const url = require('url');

// Helper function to calculate Fibonacci numbers
function fibonacci(n) {
    let sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence.slice(0, n);
}

// Variable to track if a response has already been made for N between 10 and 20
let hasRespondedOnce = false;

// Server request handler function
const serverHandler = (req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const headers = req.headers;

    // Handle GET Requests for /fibonacci endpoint
    if (method === 'GET' && parsedUrl.pathname === '/fibonacci') {
        const n = parseInt(parsedUrl.query.n, 10);
        console.log(`Handling GET request with n=${n}`);

        if (!n || isNaN(n) || n < 1) {
            console.log('Invalid or missing query parameter "n"');
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('400 Not Implemented \nInvalid or missing query parameter "n"');
            return;
        }

        if (n < 10) {
            // Return Fibonacci sequence for valid N < 10
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(fibonacci(n)));
        } else if (n < 20) {
            // For N between 10 and 20, return sequence once, then 503 thereafter
            if (!hasRespondedOnce) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(fibonacci(n)));
                hasRespondedOnce = true; // Set flag to true after first response
            } else {
                res.writeHead(503, { 'Content-Type': 'text/plain' });
                res.end('503 Not Implemented \nService Unavailable: N should be 10 or less for repeated requests');
            }
        } else {
            // Respond with error if N >= 20
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('400 Not Implemented \nN must be less than 20.');
        }
        return;
    }

    // Handle POST Requests for /echo endpoint
    if (method === 'POST' && parsedUrl.pathname === '/echo') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            if (headers['content-type'] === 'application/json') {
                try {
                    const parsedBody = JSON.parse(body);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(parsedBody));
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('400 Not Implemented \nMalformed JSON');
                }
            } else {
                res.writeHead(415, { 'Content-Type': 'text/plain' });
                res.end('415 Not Implemented \nUnsupported Content-Type. Please use application/json.');
            }
        });
        return;
    }

    // Unsupported HTTP Methods
    console.log('Unsupported HTTP method');
    res.writeHead(501, { 'Content-Type': 'text/plain' });
    
    res.end('501 Not Implemented \nOperation not supported');
};

// Start the server (only if not in test mode)
if (require.main === module) {
    const server = http.createServer(serverHandler);
    server.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
}

// Export the handler for testing purposes
module.exports = serverHandler;
