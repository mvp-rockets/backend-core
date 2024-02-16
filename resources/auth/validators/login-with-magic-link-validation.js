const {
  validate,
  isEmail,
  isValidUrl,
} = require("validation");

const rule = {
  to: [
    [isEmail, "to should be an email"],
  ],
  url: [
    [isValidUrl, "url should be a valid url"],
  ],
  theme: [
    [(data) => typeof data == 'object' && Boolean(data), "theme should be an object"],
  ]
};

module.exports.validate = async data => validate(rule, data)