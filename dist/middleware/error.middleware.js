"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, req, res) {
    const status = error.status || 500; // Use the status from HttpException or default to 500
    const message = error.message || "Something went wrong"; // Use the message from HttpException or default to "Something went wrong"
    // Set the HTTP status and send a JSON response with status and message
    res.status(status).send({
        status,
        message,
    });
}
exports.default = errorMiddleware;
