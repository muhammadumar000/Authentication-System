const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

// mongo db connection
const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);



async function confirmationRoute(fastify,options,done){
    fastify.get('/confirm/:id',async(req,res) => {
        const HashedId = decodeURIComponent(req.params.id);
        const allUsers = await client.db("AuthenticationData").collection("usersData").find().toArray();
        let foundUser;
        for (let i = 0; i < allUsers.length; i++) {
            if (await bcrypt.compare(allUsers[i].email,HashedId)){
                foundUser = allUsers[i];
            }
        }
        
        if(foundUser){
            await client.db("AuthenticationData").collection("usersData").updateOne({email:foundUser.email},{$set:{isVerified:true}})
            res.send({"message":"Account Verified"})
        }
        else{
            res.send({"message":"Invalid Link"})
        }
    })
    done()
}

module.exports = confirmationRoute;