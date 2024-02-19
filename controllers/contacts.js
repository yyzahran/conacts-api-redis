const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes')
const { client } = require('../services/db/connect');
const shortid = require('shortid');
const { userContactEmailsKey, userContactIdsKey, contactKey } = require('../services/db/keys');
const { serializeContact, validateEmail, deserializeContact } = require('../services/utils');

const createContact = async (req, res) => {
    const contactId = shortid.generate()
    const { userId, name: userName } = req.user;
    const { name: contactName, phoneNumber, email: contactEmail } = req.body;

    // Check all inputs are provided
    if (!contactName || !phoneNumber || !contactEmail) {
        throw new BadRequestError("Please provide contact's name, email, and phone number.")
    }

    // Validate email format
    if (!validateEmail(contactEmail)) {
        throw new BadRequestError("Please provide a valid email.")
    }

    // Check if contact email is already added in userContactEmailsKey
    const contactExists = await client.sIsMember(userContactEmailsKey(userId), contactEmail)
    if (contactExists) {
        throw new BadRequestError(`Contact with email ${contactEmail} already exists`)
    }
    const serializedContact = serializeContact({
        contactName, phoneNumber, contactEmail
    }, userId)
    await client.hSet(contactKey(contactId), serializedContact)
    // Add contactId to userContactIdsKey (user:contacts#userId) set
    await client.sAdd(userContactIdsKey(userId), contactId)
    // Add contactEmail to userContactEmailsKey (user:contacts#userId) set
    await client.sAdd(userContactEmailsKey(userId), contactEmail)

    res.status(StatusCodes.CREATED).json({ contactId })
}

const getContact = async (req, res) => {
    const { user: { userId, name }, params: { id: contactId } } = req;

    // get info for contact using its id
    const contactInfo = await client.hGetAll(contactKey(contactId))
    // Make sure there's a contact in the db with that id
    if (!Object.keys(contactInfo).length) {
        throw new NotFoundError(`No contact with id ${contactId}`)
    }
    res.status(StatusCodes.OK).json(contactInfo)
}

const updateContact = async (req, res) => {
    const { user: { userId, name },
        body: { name: contactName, phoneNumber, email: contactEmail },
        params: { id: contactId } } = req;

    // User has to supply all 3 variables. In the UI, they'll be prefilled.
    // so user will only update what he wants and the rest will be sent anyway
    if (!contactName || !phoneNumber, !contactEmail) {
        throw new BadRequestError("Please provide the contact's name, phone number, and email.")
    }

    // Check if new contact email is already added in userContactEmailsKey
    const contactExists = await client.sIsMember(userContactEmailsKey(userId), contactEmail)
    if (contactExists) {
        throw new BadRequestError(`Contact with email ${contactEmail} already exists`)
    }

    // get the contact's hash
    const contactInfo = await client.hGetAll(contactKey(contactId))
    if (!Object.keys(contactInfo).length) {
        throw new NotFoundError(`No contact with id ${contactId}`)
    }
    // update the info in the contact's hash and in the userContactEmailsKey
    // I won't serialize the contact again cuz it's been already serialized when created
    // Might change that later if need be
    const newContactInfo = { contactName, phoneNumber, contactEmail }
    await client.hSet(contactKey(contactId), newContactInfo)
    // Add contactEmail to userContactEmailsKey (user:contacts#userId) set
    await client.sAdd(userContactEmailsKey(userId), newContactInfo.contactEmail)
    // Remove old email from userContactEmailsKey (user:contacts#userId) set
    await client.sRem(userContactEmailsKey(userId), contactInfo.contactEmail)

    res.status(StatusCodes.OK).json(newContactInfo)
}

const deleteContact = async (req, res) => {
    const { user: { userId, name }, params: { id: contactId } } = req;

    // make sure there's a contact with that info first in the db. If not, return an error
    const contactInfo = await client.hGetAll(contactKey(contactId))
    if (!Object.keys(contactInfo).length) {
        throw new NotFoundError(`No contact with id ${contactId}`)
    }
    // remove contact email from userContactEmailsKey
    const removeFromUserContactEmailsKey = await client.sRem(userContactEmailsKey(userId), contactInfo.contactEmail)
    // remove contact Id from userContactIdsKey
    const removeFromUserContactIdsKey = await client.sRem(userContactIdsKey(userId), contactId)
    // remove contact hash
    const removeContactHash = await client.del(contactKey(contactId))

    if (removeFromUserContactEmailsKey + removeFromUserContactIdsKey + removeContactHash != 3) {
        throw new BadRequestError("Something went wrong, try again later!")
    }
    res.status(StatusCodes.NO_CONTENT).send();
}

const getAllContacts = async (req, res) => {
    const { userId } = req.user;
    console.log(userId);

    // get all contactIds for userId 
    const contactIds = await client.sMembers(userContactIdsKey(userId))

    const contacts = await getContacts(contactIds)
    res.status(StatusCodes.OK).json({ contacts, count: contacts.length });
}

const getContacts = async (contactIds) => {
    const commands = contactIds.map((id) => {
        return client.hGetAll(contactKey(id))
    });
    const results = await Promise.all(commands);

    return results.map((result, i) => {
        if (!Object.keys(result).length) {
            return null;
        }
        return deserializeContact(contactIds[i], result)
    })
}

module.exports = {
    createContact,
    updateContact, deleteContact, getAllContacts, getContact
};
