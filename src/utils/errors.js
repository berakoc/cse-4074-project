exports.createErrorMethod = (message, ErrorClass = Error) => {
    throw new ErrorClass(message)
}
