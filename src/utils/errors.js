/**
 * Creates a closure that throws given error
 * @param {String} message Error message
 * @param {new() => Error} ErrorClass A class that extends Error class
 */

exports.createErrorMethod = (message, ErrorClass = Error) => {
    throw new ErrorClass(message)
}
