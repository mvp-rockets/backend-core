const Route = require('route');
const db = require('db/repository')
const loginUserQuery = require('resources/users/queries/login-user-query');
const Result = require('folktale/result');
const { respond } = require('@mvp-rockets/namma-lib/utilities');


async function login(req) {
    let data = {
        username: req.body.username,
        password: req.body.password
    };
     
    const response = await db.findOne(new loginUserQuery(data))
    return respond(response,"User Looged-In successfully","failed to authenticate user");

}

Route.withOutSecurity().noAuth().post('/login',login).bind();

module.exports = login;

