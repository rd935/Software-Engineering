const http = require('http');
const request = require('supertest');
const server = require('../../hw4'); // Adjust path as needed

let app;
let port;
let agent;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Ensure timeout allows server response


describe("Node.js Server Test Suite", () => {
  beforeAll(async () => {
    app = http.createServer(server);
    await new Promise((resolve) => {
      app.listen(0, () => {
        port = app.address().port;
        console.log(`Test server running on port ${port}`);
        agent = request.agent(`http://localhost:${port}`); // Use agent with dynamic port
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => app.close(resolve));
  });

  it("should respond with a simple message", async () => {
    const res = await agent
    .post(`/echo`)
    .send({ message: "Hello, world!" }) // Ensure you’re sending a valid JSON body
    .set('Content-Type', 'application/json'); // Set correct Content-Type header
  
  expect(res.status).toBe(200); // Expect OK status
  expect(res.body).toEqual({ message: "Hello, world!" }); // Expect echoed response
  });

  it("should return Fibonacci sequence for valid n in GET request", async () => {
    const res = await agent.get(`/fibonacci?n=5`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([0, 1, 1, 2, 3]);
  });

  it("should return Fibonacci sequence for first request with n = 15", async () => {
    // First request with N = 15
    const firstRes = await agent.get(`/fibonacci?n=15`);
    expect(firstRes.status).toBe(200);
    expect(firstRes.body).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]);
  });

  it("should return 503 Service Unavailable for subsequent request with n = 15", async () => {
      // Second request with N = 15
      const secondRes = await agent.get(`/fibonacci?n=15`);
      expect(secondRes.status).toBe(503);
      expect(secondRes.text).toContain("503 Not Implemented \nService Unavailable: N should be 10 or less for repeated requests");
  });

  it("should return 400 for n > 20 in GET request", async () => {
    const res = await agent.get(`/fibonacci?n=21`); // Ensure to use lowercase 'n'
    expect(res.status).toBe(400);
    expect(res.text).toContain("400 Not Implemented \nN must be less than 20");
  });

  it("should echo JSON body back in POST request", async () => {
    const res = await agent
      .post(`/echo`)
      .send({ key: "value" })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ key: "value" });
  });

  it("should return 400 for malformed JSON in POST request", async () => {
    const res = await agent
      .post(`/echo`)
      .send("{ key: value }") // Malformed JSON
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.text).toContain("400 Not Implemented \nMalformed JSON"); // Make sure this matches your server's response
  });

  it("should return 501 for unsupported HTTP method", async () => {
    const res = await agent.put(`/fibonacci?n=5`); // Ensure to use lowercase 'n'
    expect(res.status).toBe(501);
    expect(res.text).toContain("501 Not Implemented \nOperation not supported");
  });

  it("should return 415 for unsupported Content-Type", async () => {
    const res = await agent
      .post(`/echo`)
      .set('Content-Type', 'text/plain')
      .send("plain text");
    expect(res.status).toBe(415);
    expect(res.text).toContain("415 Not Implemented \nUnsupported Content-Type"); // Ensure this matches your server's response
  });

});
