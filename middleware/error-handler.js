const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ message: err.message })
    } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
};

module.exports = errorHandler;
