
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
let loginUserEmail;

const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);


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
                    loginUserEmail = decoded.email;
                }
            }
        )
    })

    fastify.get('/myData', async function(req, reply) {
        const LoginnedUser= await client.db("AuthenticationData").collection("usersData").findOne({email:loginUserEmail})
        reply.status(200).send({name:LoginnedUser.name,email:LoginnedUser.email})});
    next()
}