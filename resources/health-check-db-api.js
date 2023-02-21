const { logInfo } = require('lib');

const { sequelize } = require('models');

module.exports = async function (req, res) {
    logInfo('Request to get health-check db api', {});

    const x = await sequelize.authenticate();
   
    sequelize
        .authenticate()
        .then((r) => {
            console.log("skskd", r)
            res.json({
                isAlive: true
            })
        })
        .catch(err => {
            res.json({
                isAlive: false
            })
        });
}