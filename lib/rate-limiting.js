const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});

const rateLimitMiddleware = (req, res, next) => {
    limiter(req, res, next);
};

module.exports.rateLimitMiddleware = rateLimitMiddleware;
