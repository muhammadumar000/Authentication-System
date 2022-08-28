
const jwt = require('jsonwebtoken');

const fsPromises  = require('fs').promises;
const path = require('path');

// mongo db connection
const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);


async function logoutRoute(fastify,options,done){
    fastify.delete('/logout',async(req,res) => {
        // function to logout a user and delete the tokens in json file
       const {refreshToken} = req.body;
         if(refreshToken){
                const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
                let foundUser = await client.db("AuthenticationData").collection("usersData").findOne({email:decoded.email});
                if(foundUser){
                    foundUser = {
                        name : foundUser.name,  
                        email : foundUser.email,
                        password : foundUser.password,
                        isVerified : foundUser.isVerified,
                    }

                    await client.db("AuthenticationData").collection("usersData").updateOne({email:foundUser.email},{$unset:{refreshToken: ""}})
    
                    res.status(200).send({"message":"User logged out"})
                }
                else{
                    res.status(400).send({"message":"User not found"})
                }
         } else{
                res.status(400).send({"message":"refresh token is required"})
         }

    })
}

module.exports = logoutRoute;