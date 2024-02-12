const Route = require('route');
const { respond, logInfo } = require('lib');
const CreateUserQuery = require('resources/users/queries/create-user-query');
const db = require('db/repository.js');
const uuid = require('uuid');
const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const withArgs = require('@mvp-rockets/namma-lib/src/lib/utilities/with-args');
const CreateUserValidations= require('resources/users/validators/create-user-validations')
async function post(req) {
    let data = {
        id:uuid.v4(),
        username: req.body.username,
        password: req.body.password
    };
   
    logInfo('Request to create users api ', { data: data});

    const response = await composeResult(
        withArgs(db.execute, new CreateUserQuery(data)),
        CreateUserValidations.validate
    )(data);
   
    return respond(response, 'Successfully create users!', 'Failed to create users!');
}

Route.withOutSecurity().noAuth().post('/users', post).bind();

module.exports.post = post;
