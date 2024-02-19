const userKey = (id) => `user#${id}`;
const contactKey = (id) => `contact#${id}`;
const emailsUniqueKey = () => 'emails:unique';
const userContactEmailsKey = (userId) => `users:contactEmails#${userId}`;
const userContactIdsKey = (userId) => `users:contactIds#${userId}`;
const emailsToIdsKey = () => 'emails:ids';

module.exports = {
    userKey,
    contactKey,
    emailsUniqueKey,
    userContactEmailsKey,
    userContactIdsKey,
    emailsToIdsKey,
}