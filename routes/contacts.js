const express = require('express')
const contactsRouter = express.Router()
const { createContact,
    updateContact, deleteContact, getAllContacts, getContact
} = require('../controllers/contacts');

// setting up the routes
contactsRouter.route('/').post(createContact).get(getAllContacts);
contactsRouter.route('/:id').get(getContact).patch(updateContact).delete(deleteContact);

module.exports = contactsRouter;