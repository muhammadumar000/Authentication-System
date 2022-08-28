
const fsPromises  = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt')

// mongo db connection
const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);

async function forgerPassword(fastify,options,done){
    fastify.put('/forgetPassword',async(req,res) => {
        const {email,newPassword} = req.body;
        console.log(newPassword,email)
        if(newPassword && email){

            const foundUser =  await client.db("AuthenticationData").collection("usersData").findOne({email:email});
            if(!foundUser){
                res.status(400).send({"message":"user with  not found"})
            }
                const newHashedPassword = await bcrypt.hash(newPassword,10);
                await client.db("AuthenticationData").collection("usersData").updateOne({email:foundUser.email},{$set:{password:newHashedPassword}})
                res.status(200).send({"message":"Password Changed"})
        } else{
            res.status(400).send({"message":"email and password are required!"})
        }
    })
}

module.exports  = forgerPassword;