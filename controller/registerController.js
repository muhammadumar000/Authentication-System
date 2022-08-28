const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// mongo db connection
const {MongoClient} = require("mongodb");
const uri = process.env.URI_MONGO_DB;
const client = new MongoClient(uri);


const nodemailer = require('nodemailer');


const registerNewUser = async (request,response) => {
    const {name,email,password} = request.body;
     // destructuring the request body
    if(!name || !email || !password){
        response.status(400).send({error:'name, email, and password are required'}); // bad request
    }

    // hashing the password using bcrypt package
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword); // for testing purpose we can see the hashed password

    const newUser = {
        name: name,
        email: email,
        password: hashedPassword,
        isVerified: false
    }

    // checking for duplicate user...

    const duplicateUser = await client.db("AuthenticationData").collection("usersData").findOne({email:email});

    if(duplicateUser){
        response.status(400).send({error:'user already exists'});
    }
    else{
        // creating transport to send email
            const transport = nodemailer.createTransport({
                service:'gmail',
                    host: 'smtp.example.tld',
                    port: 465,
                    secure: true,
                    auth:{
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
            })
        
        // hashing and encoding the email...
        const hashedEmail = await bcrypt.hash(email,10);
        const encodedMail = encodeURIComponent(hashedEmail);

        // defining mail options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Confirm your email',
            html : `
            <p style="text-align:center">Hi ${name},Thanks for Signing up</p>
            <p> Please click on this link to Verify your account </p>
            <p> https://authsystem-fastify.herokuapp.com/confirm/${encodedMail} </p>
            ` 
        }
        
        // sending mail 
        transport.sendMail(mailOptions, async function(error,info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                try{
                    await client.db("AuthenticationData").collection("usersData").insertOne(newUser);
                    await response.status(201).send({message:'user created successfully'});
                } catch{
                    response.status(500).send({error:'server error'});
                }
                
            }
        })
    }


}

module.exports = {registerNewUser};