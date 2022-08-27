require('dotenv').config()
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

// user data:

const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}

const loginUser = async (request,response) => {

    const {email,password} = request.body; // destructuring the body

    if(!email || !password){
        response.status(400).send({"message":"email and password are required!"})
    }

    const foundUser = userData.users.find(user => user.email === email);

    if(!foundUser){
        response.status(400).send({"message":"Wrong Email Entered"})
    }

    const isPasswordMatched = await bcrypt.compare(password,foundUser.password);
    console.log(isPasswordMatched)

    if(isPasswordMatched){

        if(foundUser.isVerified){

            const accessToken = jwt.sign(
                {email:foundUser.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10s'}
            )
                // refresh token for logout purpose
            const refreshToken = jwt.sign(
                {email:foundUser.email},
                process.env.REFRESH_TOKEN_SECRET
            )
    
            const otherUsers = userData.users.filter(user => user.email !== foundUser.email)
            const currentUser = {...foundUser,refreshToken}
    
            userData.setUsersData([...otherUsers,currentUser])
    
            await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),
            JSON.stringify(userData.users)
            );
            response.status(200).send({accessToken,refreshToken})
        } else{
            response.status(401).send({"message":"user not verified"})
        }
    }
    else{
        response.status(400).send({"message":"Wrong Password Entered"})
    }

}

module.exports = {loginUser};