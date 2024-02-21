const Result = require("folktale/result");
const axios = require("axios").default;
const config = require('config/config');

module.exports.generate = async ({ refreshToken }) => {
    try {
        const headersList = {
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        const bodyContent = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${config.awsCognito.clientId}`;
    
        const reqOptions = {
            url: `${config.awsCognito.domain}/oauth2/token`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        };
    
        let response = await axios.request(reqOptions);
        return Result.Ok(response.data);

    } catch (err) {
        return Result.Error(err);
    }
}