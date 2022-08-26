const registerController = require('../controller/registerController');

const registerUser = {
    schema:{
        response : {
            200 : {
                type : 'object',
                properties:{
                    message: {type : 'string'}
                }
            }
        },
        body:{
            type : 'object',
            properties : {
                name :{type:'string'},
                email :{type:'string'},
                password :{type:'string'}
            }
        }
    },
    handler : registerController.registerNewUser
}


async function registerNewRoute(fastify,options,done){
    fastify.post('/register',registerUser);
    
    done();
}

module.exports = registerNewRoute;