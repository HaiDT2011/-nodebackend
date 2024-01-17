'use strict'

const StatusCode = {
  OK: 200,
  CREATE: 201
}

const ReasonStatusCode = {
  CREATE: 'Created!',
  OK: 'Success'
}

class SuccessResponse {
  constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
    this.message = !message ? ReasonStatusCode.OK : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata = {} }) {
    super({ message, metadata })
  }
}

class CREATE extends SuccessResponse {
  constructor({ message, statusCode = StatusCode.CREATE, reasonStatusCode = ReasonStatusCode.CREATE, metadata = {} }) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}

module.exports = {
  OK,
  CREATE,
  SuccessResponse
}
