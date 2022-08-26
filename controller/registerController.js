const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');



const nodemailer = require('nodemailer');



// user data: 

const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}

const registerNewUser = async (request,response) => {
    const {name,email,password} = request.body;
    console.log(email)
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
       
                
        /*
            sending confirmation email to the user using nodemailer package
            1) npm install nodemailer : //*DONE
            2) npm install : //*DONE
            3) setting up nodemailer : 
            4) prepare mail body which contains the link to the confirmation page with the hashed email
            5) send the mail
            6) if the hash matches then the user is registered
        */ 

            const transport = nodemailer.createTransport({
                service:'gmail',
                    host: 'smtp.example.tld',
                    port: 465,
                    secure: true,
                    auth:{
                        user:'mu247609@gmail.com',
                        pass:'nkgjkhefhacgwgjj'
                    }
            })
        const hashedEmail = await bcrypt.hash(email,10);
        console.log(await bcrypt.compare(email,hashedEmail))
        const mailOptions = {
            from: 'mu247609@gmail.com',
            to: email,
            subject: 'Confirm your email',
            text : `Thanks for registering! Please click on the link to confirm your email: http://localhost:3500/confirm/${hashedEmail}`
        }
        
        transport.sendMail(mailOptions, async function(error,info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                await userData.setUsersData([...userData.users,newUser]);
                await fsPromises.writeFile(path.join(__dirname, '..','model','users.json'),JSON.stringify(userData.users))
                
            }
        })
        // response.status(200).send({"message":'user registered successfully'})
                // adding new user into users array..
                
        
        
    }


}

module.exports = {registerNewUser};