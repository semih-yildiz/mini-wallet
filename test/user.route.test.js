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
describe("ROUTE: /api/v1/user", async () => {

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

    describe('PATH: /api/v1/user', () => {

        describe('/POST', () => {
            const user = {
                "first_name": "test user",
                "second_name": "",
                "last_name": "test user lastname",
                "password": "Test-123",
                "password_retry": "Test-123",
                "email": "test@gmail.com"
            }

            it('STATUS 201: Create new user', (done) => {
                chai.request(server)
                    .post(`/api/v1/user`)
                    .send(user)
                    .end((err, res) => {
                        expect(res.status).to.equal(201);
                        //const destroyresp = repo.destroy(repo.models.user, { email: user["email"] })
                        done();
                    });
            })

            it('STATUS 400: User already exist', (done) => {
                chai.request(server)
                    .post(`/api/v1/user`)
                    .send(user)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        repo.destroy(repo.models.user, { email: user["email"] })
                        done();
                    });
            })

            it('STATUS 400: When missing parameter is sent', (done) => {
                delete user.email;
                chai.request(server)
                    .post(`/api/v1/user`)
                    .send(user)
                    .end((err, res) => {
                        expect(res.status).to.equal(400);
                        done();
                    });
            })
        })

    })

    describe('PATH: /api/v1/user/api-key-generate', async () => {

        describe('/POST', () => {

            it('STATUS 201: Api key generate', (done) => {
                chai.request(server)
                    .post(`/api/v1/user/api-key-generate`)
                    .set({ 'x-token': `${authToken}`, 'x-refresh-token': `${refreshToken}` })
                    .send()
                    .end((err, res) => {
                        expect(res.status).to.equal(201);
                        //const destroyresp = repo.destroy(repo.models.user, { email: user["email"] })
                        done();
                    });
            })

            it('STATUS 401: Authorization Error', (done) => {
                chai.request(server)
                    .post(`/api/v1/user/api-key-generate`)
                    .send()
                    .end((err, res) => {
                        expect(res.status).to.equal(401);
                        //const destroyresp = repo.destroy(repo.models.user, { email: user["email"] })
                        done();
                    });
            })

        })
    })

    after(async () => {
        const user = {
            "email": "auth@gmail.com"
        }
        await repo.destroy(repo.models.userApiAuth, { user_id: userId })
        userData = await repo.destroy(repo.models.user, { email: user.email })
    })
})