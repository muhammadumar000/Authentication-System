
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = function (fastify, options, next) {
    fastify.addHook('onRequest', async (request, reply) => {
        const authHeader = request.headers['authorization'];
        if(!authHeader){
            reply.status(401).send({message:'No Authorization Header'});
        }
        console.log(authHeader)
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err,decoded) => {
                if(err){
                    reply.status(401).send({message:'Invalid Token'});
                }
                else{
                    request.user = decoded.email;
                }
            }
        )
    })

    fastify.get('/myData', function(req, reply) {
        reply.send({message:"Hi, Your are Authorized"});
    })
    next()
}