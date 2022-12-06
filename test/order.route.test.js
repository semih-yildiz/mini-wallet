process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Order = require('../src/models/order.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('PATH: /api/v1/order', () => {

    describe('/GET', () => {

        it('STATUS 200: With all orders successfully fetched', (done) => {
            chai.request(server)
                .get('/api/v1/order')
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .get('/api/v1/order')
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });
});

describe('PATH: /api/v1/order/:id/detail', () => {
    let order;

    beforeEach((done) => {
        order = new Order({
            "basket": [
                {
                    "id": "62ab602de876ae746be3e622",
                    "piece": "15"
                }
            ],
            "payment_method": "ONLINE"
        });
        order.save((err, book) => {
            done()
        });
    });

    describe('/GET', () => {

        it('STATUS 200: Get order detail', (done) => {
            chai.request(server)
                .get(`/api/v1/order/${order.id}/detail`)
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    done();
                });
        })

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .get(`/api/v1/order/${order.id}/detail`)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });

    });
});

describe('PATH: /api/v1/order/create', () => {

    describe('/POST', () => {
        const order = {
            "basket": [
                {
                    "id": "62ab602de876ae746be3e622",
                    "piece": "15"
                }
            ],
            "payment_method": "ONLINE"
        }

        it('STATUS 201: Create new order', (done) => {
            chai.request(server)
                .post(`/api/v1/order/create`)
                .send(order)
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    done();
                });
        })

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .post(`/api/v1/order/create`)
                .send(order)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        })
    })

})

describe('PATH: /api/v1/order/create-repeat', () => {

    let order;

    beforeEach((done) => {
        order = new Order({
            "basket": [
                {
                    "id": "62ab602de876ae746be3e622",
                    "piece": "15"
                }
            ],
            "payment_method": "ONLINE"
        });
        order.save((err, book) => {
            done()
        });
    });

    describe('/POST', () => {

        it('STATUS 201: Create new order', (done) => {
            chai.request(server)
                .post(`/api/v1/order/create-repeat`)
                .send({
                    "id": order.id
                })
                .auth('admin', 'password')
                .end((err, res) => {
                    expect(res.status).to.equal(500);
                    done();
                });
        })

        it('STATUS 401: When basic auth is not set', (done) => {
            chai.request(server)
                .post(`/api/v1/order/create-repeat`)
                .send({
                    "id": order.id
                })
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        })
    })

})

describe('PATH: /api/v1/order/change-status/:id', () => {

    describe('/PUT', () => {

        it('STATUS 201: Create new order', (done) => {
            const order = new Order({
                "basket": [
                    {
                        "id": "62ab602de876ae746be3e622",
                        "piece": "2"
                    }
                ],
                "payment_method": "ONLINE"
            });
            order.save((err, book) => {
                chai.request(server)
                    .put(`/api/v1/order/change-status/${order.id}`)
                    .auth('admin', 'password')
                    .send({ "status": "POSTPONEMENT" })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            })
        })

        it('STATUS 201: Create new order', (done) => {
            chai.request(server)
                .put(`/api/v1/order/change-status/62ab602de876ae746be3e622`)
                .send({ "status": "POSTPONEMENT" })
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        })
    })
})