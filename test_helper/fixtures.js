const loadFixture = require("mongoose-fixture-loader");
const User = require("../src/model/user");

const fixtures = {};

// get new users data
const getNewUser = (username, email, password) => {
    const user = new User({
        username,
        email
    });
    user.setPassword(password);

    return user;
};

// create new users
const createNewUser = async (userName) => {
    const password = "mypassword";
    const user = await loadFixture(
        User,
        getNewUser(userName, `${userName}@example.com`, password)
    );
    user.password = password;
    return user;
};

// details of create users
const loadFixtures = async () => {
    fixtures.users = {};
    const userNames = ["tom", "jacky"];
    for (let userName of userNames){
        let user =  await createNewUser(userName);
        fixtures.users[userName] = user;
    }
};

module.exports = {
    fixtures,
    load: loadFixtures  // load function is called to create two users
};