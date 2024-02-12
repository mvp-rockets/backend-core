const Models = require('models');
const Result = require('folktale/result')


module.exports = class loginUserQuery{
    constructor(data){
        this.details = {
            username: data.username,
            password: data.password         
        }
    }

    async get() {
        const user = await Models.User.findOne({
            where: {
              username: this.details.username,
              password: this.details.password
            }
        });
        if(user){
            return user
        }
        else{
            return('password did not match');
        }
        
    }
    
}