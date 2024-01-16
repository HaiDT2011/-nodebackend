'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const Message = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = Message.CONFLICT , status=StatusCode.CONFLICT) {
        super(message, status)
        this.status = status  
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = Message.FORBIDDEN , status=StatusCode.FORBIDDEN) {
        super(message, status)
        this.status = status  
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}

