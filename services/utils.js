const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createJWT = (userId, name) => {
    return jwt.sign({ userId, name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    })
}

const validateEmail = (candidateEmail) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(candidateEmail);
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const comparePassword = async (candidatePassword, hash) => {
    const isMatch = await bcrypt.compare(candidatePassword, hash)
    return isMatch
}

const serializeContact = (contact, userId) => {
    return {
        ...contact,
        createdBy: userId
    }
}

const serializeUser = (user) => {
    // const salt = bcrypt.genSalt(10);
    // console.log(typeof user.password)
    // let hashedPassword = bcrypt.hashSync(user.password, salt);
    const hashedPassword = hashPassword(user.password);
    return {
        name: user.name,
        email: user.email,
        password: hashedPassword
    }
}

const deserializeContact = (id, contact) => {
    return {
        id,
        name: contact.contactName,
        phoneNumber: contact.phoneNumber,
        email: contact.contactEmail
    }
}

const deserializeUser = (id, user) => {
    return {
        userId: id,
        name: user.name,
        email: user.email
    }
}

module.exports = {
    createJWT,
    validateEmail,
    hashPassword,
    comparePassword,
    serializeContact,
    serializeUser,
    deserializeUser,
    deserializeContact,
}