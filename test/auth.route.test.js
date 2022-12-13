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
let refreshToken;
let authToken;
let userId;
describe("ROUTE: /api/v1/auth", async () => {

    before(async () => {
        const createUser = {
            "first_name": "auth user",
            "second_name": "",
            "last_name": "auth user lastname",
            "password": "Test-123",
            "password_retry": "Test-123",
            "email": "auth@gmail.com"
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
    })

    describe('PATH: /api/v1/auth/refresh-token', () => {

        describe('/POST', () => {

            it('STATUS 20O: Refresh token successfull', (done) => {
                chai.request(server)
                    .post(`/api/v1/auth/refresh-token`)
                    .send({ "refreshToken": refreshToken })
                    .end((err, res) => {
                        expect(res.status).to.equal(403);
                        done();
                    });
            })

            it('STATUS 400: Refresh token is not provided', (done) => {
                chai.request(server)
                    .post(`/api/v1/auth/refresh-token`)
                    .send({})
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })

            it('STATUS 401: Invalid refresh token', (done) => {
                chai.request(server)
                    .post(`/api/v1/auth/refresh-token`)
                    .send({ "refreshToken": "test" })
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        done();
                    });
            })

        })
    })

    describe('PATH: /api/v1/auth/login', () => {

        describe('/POST', () => {
            const user = {
                "email": "auth@gmail.com",
                "password": "Test-123"
            }

            it('STATUS 20O: Login successfull', (done) => {
                chai.request(server)
                    .post(`/api/v1/auth/login`)
                    .send(user)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        done();
                    });
            })

            it('STATUS 400: Invalid credential', (done) => {
                user.email = "err@gmail.com"
                chai.request(server)
                    .post(`/api/v1/auth/login`)
                    .send(user)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })
        })
    })

    after(async () => {
        const user = {
            "email": "auth@gmail.com"
        }
        userData = await repo.destroy(repo.models.user, { email: user.email })
    })
})