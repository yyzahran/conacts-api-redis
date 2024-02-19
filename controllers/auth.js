const { StatusCodes } = require('http-status-codes')
const { client } = require('../services/db/connect');
const shortid = require('shortid');
const { userKey, emailsUniqueKey, emailsToIdsKey } = require('../services/db/keys');
const { BadRequestError } = require('../errors');
const { createJWT, validateEmail, hashPassword, serializeUser, comparePassword } = require('../services/utils');

const register = async (req, res) => {
    const id = shortid.generate()
    const user = req.body

    // Check that all entries are provided
    if (!user.email || !user.password || !user.name) {
        throw new BadRequestError("Please provide valid name, email, and password.")
    }
    // Validate email format
    if (!validateEmail(user.email)) {
        throw new BadRequestError("Please provide a valid email.")
    }

    // Validate password length (light password check)
    if ((user.password).length < 6 || (user.password).length > 12) {
        throw new BadRequestError("Password must be between 6 and 12 characters")
    }

    let serializedUser = await serializeUser(user)
    const resolvedPassword = await serializedUser.password

    // Check if email is already registered
    const exists = await client.sIsMember(emailsUniqueKey(), serializedUser.email)
    if (exists) {
        throw new BadRequestError(
            `Email ${serializedUser.email} is already registered.Please login or register using a different email`
        )
    }

    serializedUser = { ...serializedUser, password: resolvedPassword }
    // add user data to a new hash
    await client.hSet(userKey(id), serializedUser)
    // adding email to emails:unique set
    await client.sAdd(emailsUniqueKey(), serializedUser.email)
    //add field: email and value: ID to emails:ids hash
    await client.hSet(emailsToIdsKey(), { [serializedUser.email]: id })
    const token = createJWT(id, serializedUser.name)
    res.status(StatusCodes.CREATED).json({ id: id, serializedUser, token })
}

// TODO: Get the user key using its email
const login = async (req, res) => {
    const { email, password } = req.body;

    // checking that email and password are provided
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    // Check that email is in emails:unique set
    const registered = await client.sIsMember(emailsUniqueKey(), email)
    if (!registered) {
        throw new BadRequestError("Email not registered. Please register a user.")
    }
    // Get email id from emails:ids
    const userId = await client.hGet(emailsToIdsKey(), email)
    // Get email hash
    const userInfo = await client.hGetAll(userKey(userId))
    console.log(userInfo);
    if (!comparePassword(password, userInfo.password)) {
        throw new BadRequestError("Wrong email or password, try again")
    }

    const token = createJWT(userId, userInfo.name)
    res.status(StatusCodes.OK).json({ id: userId, name: userInfo.name, token });
}



module.exports = { register, login };
