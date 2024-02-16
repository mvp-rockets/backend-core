const Route = require('route');
const db = require('db/repository')
const R = require('ramda');
const bcrypt = require('bcryptjs');
const Result = require('folktale/result');

const { composeResult, uuid, token: TokenService, respond, ApiError } = require('lib');
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');


async function login(req) {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const response = await composeResult(
        (token) => Result.Ok({ token }),
        async ([user]) => composeResult(
            (isValid) => R.ifElse(
                () => isValid,
                () => TokenService.generate({ id: user.id, username }),
                () => Result.Error(new ApiError('api error', 'Invalid username or password', 400))
            )(),
            async () => Result.Ok(await bcrypt.compare(password, user.password))
        )(),
        () => db.execute(new CreateOrFindUserQuery({
            where: { username },
            defaults: { id: uuid.v4(), username, password: hashedPassword }
        })),
    )();

    return respond(response, "User logged in with username successfully", "failed to log in with username");

}

Route.withOutSecurity().noAuth().post('/login-with-username', login).bind();

module.exports = login;
