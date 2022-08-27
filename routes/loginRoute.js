const loginController = require('../controller/loginController');

const loginUser = {
    schema:{
        response : {
            200 : {
                type : 'object',
                properties:{
                    accessToken: {type : 'string'},
                    refreshToken: {type : 'string'}
                }
            }
        },
        body:{
            type : 'object',
            properties : {
                email :{type:'string'},
                password :{type:'string'}
            }
        }
    },
    handler : loginController.loginUser
}

async function loginNewRoute(fastify,options,done){
    fastify.post('/login',loginUser)
    done();
}

module.exports = loginNewRoute;