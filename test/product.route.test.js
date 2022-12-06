process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Order = require('../src/models/order.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('PATH: /api/v1/product', () => {

    describe('/GET', () => {

        it('STATUS 200: With all products successfully fetched', (done) => {
            chai.request(server)
                .get('/api/v1/product')
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .get('/api/v1/product')
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });
});

describe('PATH: /api/v1/product', () => {

    describe('/POST', () => {
        const order = {
            "name": "Buzdağı 18lt",
            "description": "Buzdağı 18lt damacana",
            "stock": 3,
            "price": 27
        }

        it('STATUS 201: Create new product', (done) => {
            chai.request(server)
                .post(`/api/v1/product`)
                .send(order)
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    done();
                });
        })

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .post(`/api/v1/product`)
                .send(order)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        })
    })

})