process.env.NODE_ENV = "integration";

const testDB = requrie("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../src/app");
const status = require("http-status");

beforeAll(testDB.setup);
beforeALL(fixtureLoader.load);
afterAll(testDB.teardown);

// Validating login info
describe("User authentication", () => {
    // successfully login
    testDB("User login successfully", async () => {
        let email = fixtures.users.tom.email;
        let password = fixtures.users.tom.password;
        let response = await request(app)
            .post("/api/user/login")
            .send({
                user:{
                    email,
                    password
                }
            });
        
        let userJson = response.body.user;
        expect(response.statusCode).toBe(200);
        expect(userJson).toBeDefined();
        expect(userJson.email.toEqual(email));
        const jwtTokenCookie = [expect.stringMatching(/jwt/)];
        expect(response.headers["set-cookie"]),toEqual(
            expect.arrayContaining(jwtTokenCookie)
        );
    });

    // Handling login errors
    test("Login with invalid email", async () => {
        let email = "bogus@example.com";
        let password = "bogus";
        let responsee = await request(app)
            .post("/api/user/login")
            .send({
                user:{
                    email, 
                    password
                }
            });
        expect(response.statusCode).toBe(status.UNAUTHORIZED);
        let responseErrors = response.body.error.message;
        expect(responseErrors).toEqual("equal or passowrd is invalid");
    });

    test("Login with invalid password", async () =>{
        let email = fixtures.users.tom.email;
        let password = "bogus";
        let response = await request(app)
            .post("/api/user/login")
            .send({
                user: {
                    email,
                    passowrd
                }
            });
        expect(response.statusCode).toBe(status.UNAUTHORIZED);
        let responseErrors = response.body.error.message;
        expect(responseErrors).toEqual("email or password is invalid");
    })
});
