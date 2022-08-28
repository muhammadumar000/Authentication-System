require('dotenv').config()
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

// mongo db connection
const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);

const loginUser = async (request,response) => {

    const {email,password} = request.body; // destructuring the body

    if(!email || !password){
        response.status(400).send({"message":"email and password are required!"})
    }

    const foundUser = await client.db("AuthenticationData").collection("usersData").findOne({email:email});

    // const foundUser = userData.users.find(user => user.email === email);// 


    if(!foundUser){
        response.status(401).send({"message":"Wrong  or Password Entered"})
    }

    const isPasswordMatched = await bcrypt.compare(password,foundUser.password);
    console.log(isPasswordMatched)

    if(isPasswordMatched){

        if(foundUser.isVerified){

            const accessToken = jwt.sign(
                {email:foundUser.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'7d'}
            )
                // refresh token for logout purpose
            const refreshToken = jwt.sign(
                {email:foundUser.email},
                process.env.REFRESH_TOKEN_SECRET
            )

            await client .db("AuthenticationData").collection("usersData").updateOne({email:foundUser.email},{$set:{refreshToken:refreshToken}})
            response.status(200).send({accessToken,refreshToken})
        } else{
            response.status(401).send({"message":"user not verified"})
        }
    }
    else{
        response.status(400).send({"message":"Wrong Email or Password Password Entered"})
    }

}

module.exports = {loginUser};