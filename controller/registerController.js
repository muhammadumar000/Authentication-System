const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const nodemailer = require('nodemailer');

// user data: 

const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}

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

    const duplicateUser = userData.users.find(user => user.email === email);
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
            text : `Thanks for registering! Please click on the link to confirm your email: https://loginsignup-fastify.herokuapp.com//confirm/${encodedMail}`
        }
        
        // sending mail 
        transport.sendMail(mailOptions, async function(error,info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                await userData.setUsersData([...userData.users,newUser]);
                await fsPromises.writeFile(path.join(__dirname, '..','model','users.json'),JSON.stringify(userData.users))
                
            }
        })
    }


}

module.exports = {registerNewUser};