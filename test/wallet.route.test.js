process.env.NODE_ENV = 'test';

// let User = require('../src/models/user.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const db = require('../src/models');
let should = chai.should();
const expect = chai.expect;
const repo = require('../src/repository/base.repository')
const { createTokens } = require("../src/lib/generate-token");

chai.use(chaiHttp);

let userData;
let authToken;
let userId;
let walletId;
describe("ROUTE: /api/v1/wallet", async () => {

    before(async () => {
        const createUser = {
            "first_name": "auth user",
            "second_name": "",
            "last_name": "auth user lastname",
            "password": "Test-123",
            "password_retry": "Test-123",
            "email": "authWallet@gmail.com"
        }

        userData = await repo.create(repo.models.user, createUser)

        const refreshSecret = process.env.JWT_REFRESH_KEY + 'Aa123456!'; // 1

        const [token, refreshTokens] = createTokens(
            //2
            {
                id: userData.id,
                verified: true,
                status: true,
                role: []
            },
            refreshSecret
        );

        refreshToken = refreshTokens;
        authToken = token;
        userId = userData.id;

        const walletBody = {
            "name": "Test Wallet",
            "currency_id": "7b23f07e-1c06-47f0-90e3-2796d0750dcd",
            "created_by": userId
        }
        walletData = await repo.create(repo.models.wallet, walletBody)
        walletId = walletData.id
    })

    describe('PATH: /api/v1/wallet', async () => {

        describe('/POST', () => {
            const walletBody = {
                "name": "Test Cüzdan",
                "currency_id": "7b23f07e-1c06-47f0-90e3-2796d0750dcd"
            }

            it('STATUS 201: Create Wallet', (done) => {
                chai.request(server)
                    .post(`/api/v1/wallet`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send(walletBody)
                    .end((err, res) => {
                        expect(res.status).to.equal(201);
                        done();
                    });
            })

            it('STATUS 400: Wallet already exist', (done) => {
                chai.request(server)
                    .post(`/api/v1/wallet`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send(walletBody)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 400: Missing body parameter', (done) => {
                delete walletBody.name;
                chai.request(server)
                    .post(`/api/v1/wallet`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send(walletBody)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 400: Missing body parameter', (done) => {
                walletBody.name = "Test Cüzdan";
                delete walletBody.currency_id;
                chai.request(server)
                    .post(`/api/v1/wallet`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send(walletBody)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 401: Authorization Error', (done) => {
                chai.request(server)
                    .post(`/api/v1/wallet`)
                    .send()
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        //const destroyresp = repo.destroy(repo.models.user, { email: user["email"] })
                        done();
                    });
            })

        })
    })

    describe('PATH: /api/v1/wallet/balance', async () => {

        describe('/GET', () => {
            it('STATUS 200: Get account balance successfull', (done) => {
                chai.request(server)
                    .get(`/api/v1/wallet/balance?id=${walletId}`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            })
        })

        describe('/GET', () => {
            it('STATUS 401: Authorization error', (done) => {
                chai.request(server)
                    .get(`/api/v1/wallet/balance?id=${walletId}`)
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        done();
                    });
            })
        })

        describe('/GET', () => {
            it('STATUS 400: Wallet id is not provided', (done) => {
                chai.request(server)
                    .get(`/api/v1/wallet/balance`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })
        })
    })

    describe('PATH: /api/v1/wallet/:id/deposit', async () => {

        describe('/PUT', () => {

            it('STATUS 200: Deposit money in waller', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/deposit`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                        "amount": 1000
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            })

            it('STATUS 401: Authorization error', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/deposit`)
                    .send({
                        "amount": 500
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        done();
                    });
            })

            it('STATUS 400: Missing parameter', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/deposit`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 404: Wallet not found', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/sdsdsd/deposit`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                        "amount": 500
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(404);
                        done();
                    });
            })

        })
    })

    describe('PATH: /api/v1/wallet/:id/withdraw', async () => {

        describe('/PUT', () => {

            it('STATUS 200: Withdraw money in wallet', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/withdraw`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                        "amount": 100
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            })

            it('STATUS 400: Insufficient balance', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/withdraw`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                        "amount": 1000000
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 401: Authorization error', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/withdraw`)
                    .send({
                        "amount": 500
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        done();
                    });
            })

            it('STATUS 400: Missing parameter', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/${walletId}/withdraw`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 404: Wallet not found', (done) => {
                chai.request(server)
                    .put(`/api/v1/wallet/sdsdsd/withdraw`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send({
                        "amount": 500
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(404);
                        done();
                    });
            })
        })
    })

    describe('PATH: /api/v1/wallet/payment', async () => {

        describe('/POST', () => {

            it('STATUS 200: Withdraw money in wallet', (done) => {
                chai.request(server)
                    .post(`/api/v1/user/api-key-generate`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send()
                    .end((err, resApiKey) => {
                        chai.request(server)
                            .post(`/api/v1/wallet/payment`)
                            .set({ 'api_key': `${resApiKey.body.data.apiKey}` })
                            .send({
                                "wallet_id": walletId,
                                "amount": 100
                            })
                            .end((err, res) => {
                                expect(res.status).to.equal(200);
                                done();
                            });
                    });
            })

            it('STATUS 401: Not Authorized', (done) => {
                chai.request(server)
                    .post(`/api/v1/wallet/payment`)
                    .set({ 'api_key': `987324234` })
                    .send({
                        "wallet_id": walletId,
                        "amount": 100
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        done();
                    });
            })

            it('STATUS 400: Authorization error', (done) => {
                chai.request(server)
                    .post(`/api/v1/wallet/payment`)
                    .send({
                        "wallet_id": walletId,
                        "amount": 100
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 400: Insufficient balance', (done) => {
                chai.request(server)
                    .post(`/api/v1/user/api-key-generate`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send()
                    .end((err, resApiKey) => {
                        chai.request(server)
                            .post(`/api/v1/wallet/payment`)
                            .set({ 'api_key': `${resApiKey.body.data.apiKey}` })
                            .send({
                                "wallet_id": walletId,
                                "amount": 1000000
                            })
                            .end((err, res) => {
                                expect(res.status).to.equal(400);
                                done();
                            });
                    });
            })
        })
    })


    after(async () => {
        const user = {
            "email": "authWallet@gmail.com"
        }
        //your code to be executed after 1 second
        await repo.destroy(repo.models.walletTransaction, { wallet_id: walletId })
        await repo.destroy(repo.models.wallet, { created_by: userId })
        await repo.destroy(repo.models.userApiAuth, { user_id: userId })
        userData = await repo.destroy(repo.models.user, { email: user.email })
    })
})