const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

describe('Functional Tests', () => {
    // Viewing one stock
    it('Should return new Thread', (done) => {
        chai.request(server)
            .post('/api/threads/:mochaboard')
            .send({
                text: "mocha/chai test text",
                delete_password: "mochachaipw"
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                // since it redirects at this point, 200 suffices as a test

                // Add more assertions as needed
                done();
            });
    });
    it('Should return 10 most recent threads with a maximum of 3 replies', (done) => {
        chai.request(server)
            .get('/api/threads/testboard')
            .send("hello")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                assert.ok(res.body.length < 11, "there should be a maximum of 10 messages");

                // Add more assertions as needed
                done();
            });
    });
    it('deleting thread Should return "incorrect password"', (done) => {
        chai.request(server)
            .delete('/api/threads/testboard')
            .send({
                thread_id: "987654321",
                delete_password: "wrongpw",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'incorrect password'); 
                // Add more assertions as needed
                done();
            });
    });
    it('deleting thread Should return "success"', (done) => {
        chai.request(server)
            .delete('/api/threads/testboard')
            .send({
                thread_id: "987654321",
                delete_password: "123",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'success'); 
                // Add more assertions as needed
                done();
            });
    });
    it('Should return "reported"', (done) => {
        chai.request(server)
            .put('/api/threads/testboard')
            .send({
                thread_id: "9876543210",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'reported'); 
                // Add more assertions as needed
                done();
            });
    });
    it('Should create a new reply', (done) => {
        chai.request(server)
            .post('/api/replies/testboard')
            .send({
                text: "a new mocha test reply",
                delete_password: "fancy delete password",
                thread_id: "111111"
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                // Add more assertions as needed
                done();
            });
    });
    it('should return thread with all replies, but without delete_password and reported', (done) => {
        chai.request(server)
            .get('/api/replies/testboard?thread_id=111111')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                // Add more assertions as needed
                assert.ok(res.body.created_on != res.body.bumped_on)
                assert.notProperty(res.body, "delete_password", "password should not be visible")
                for(let reply in res.body.replies) {
                    assert.notProperty(reply, "delete_password", "password should not be visible")
                    assert.notProperty(reply, "reported", "reported status should not be visible")
                }
                done();
            });
    });
    it('deleting reply Should return "incorrect password"', (done) => {
        chai.request(server)
            .delete('/api/replies/testboard')
            .send({
                thread_id: "111111",
                reply_id: "333",
                delete_password: "wrongpwwww",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'incorrect password'); 
                // Add more assertions as needed
                done();
            });
    });
    it('deleting reply Should return "success"', (done) => {
        chai.request(server)
            .delete('/api/replies/testboard')
            .send({
                thread_id: "111111",
                reply_id: "333",
                delete_password: "specialcase",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'success'); 
                // Add more assertions as needed
                done();
            });
    });
    it('Should return "reported" for reply', (done) => {
        chai.request(server)
            .put('/api/replies/testboard')
            .send({
                thread_id: "111111",
                reply_id: "333"
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.text, 'string');
                assert.strictEqual(res.text, 'reported'); 
                // Add more assertions as needed
                done();
            });
    });
})