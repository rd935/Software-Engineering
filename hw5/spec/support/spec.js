const request = require('supertest');
const app = 'http://localhost:3000'; // Use the direct server URL

describe('API Tests', () => {
  
  // Increase the timeout to allow for longer responses
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // Set timeout to 10 seconds
  
  //Retrieving all users
  it('should retrieve all users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0); 
        done();
      });
  });

  //Adding a new user
  it('should add a new user', (done) => {
    const newUser = {
        name: 'John Doe',
        email: `john@example.com`, 
        age: 30
    };
    request(app)
        .post('/users')
        .send(newUser)
        .expect(201) 
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.id).toBeDefined();
            done();
        });
  });

  //Retrieving a single user that exists
  it('should retrieve a single user by ID', (done) => {
    const userId = 3; // Replace with a userId you know exists in database
    request(app)
      .get(`/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.id).toBe(3); // Expect ID to be 3
        expect(res.body.name).toBe('John Doe'); // Expect name to be 'John Doe'
        expect(res.body.email).toBe('john@example.com'); // Expect email to match
        expect(res.body.age).toBe(30); // Expect age to match
        done();
      });
  });

  //Updating an existing user
  it('should update a user', (done) => {
    const userId = 2; // Use user ID 2 (Bob)
    const updatedUser = {
      name: 'Updated Bob',
      email: 'updatedbob@example.com',
      age: 26
    };
    request(app)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('User updated successfully'); 
        done();
      });
  });

  //Retrieving a user that doesn't exist (error case)
  it('should return error when retrieving a non-existing user', async () => {
    const nonExistingUserId = 999; 

    const response = await request(app)
      .get(`/users/${nonExistingUserId}`);

    expect(response.status).toBe(404);  // Expecting not found error
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('User not found');
  });


  //Adding a new user with a duplicate email (error case)
  it('should return error for duplicate email when adding a new user', async () => {
    const duplicateUser = {
      name: 'Jane Doe',
      email: 'john@example.com', // Same email as existing user
      age: 28
    };

    const response = await request(app)
      .post('/users')
      .send(duplicateUser);

    expect(response.status).toBe(400);  // Expecting bad request error for duplicate email
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('already exists'); 
  });


  //Deleting a user
  it('should delete a user', (done) => {
    // Ensure the user exists before trying to delete
    const userId = 3; // Use an existing user ID

    request(app)
        .delete(`/users/${userId}`)
        .expect(200) 
        .expect('Content-Type', /json/)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).toBe('User deleted successfully');
            done();
        });
  });

  //Updating a user that doesn't exist (error case)
  it('should return error when updating a non-existing user', async () => {
    const nonExistingUserId = 999; 
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      age: 35
    };

    const response = await request(app)
      .put(`/users/${nonExistingUserId}`)
      .send(updatedData);

    expect(response.status).toBe(404);  // Expecting not found error
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('User not found');
  });

  //Deleting a user that doesn't exist (error case)
  it('should return error when deleting a non-existing user', async () => {
    const nonExistingUserId = 999; 

    const response = await request(app)
      .delete(`/users/${nonExistingUserId}`);

    expect(response.status).toBe(404);  // Expecting not found error
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('User not found');
  });

});
