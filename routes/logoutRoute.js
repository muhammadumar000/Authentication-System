
const jwt = require('jsonwebtoken');

const fsPromises  = require('fs').promises;
const path = require('path');

const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}


async function logoutRoute(fastify,options,done){
    fastify.delete('/logout',async(req,res) => {
        // function to logout a user and delete the tokens in json file
       const {refreshToken} = req.body;
         if(refreshToken){
                const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
                let foundUser = userData.users.find(user => user.email === decoded.email);
                if(foundUser){
                    foundUser = {
                        name : foundUser.name,  
                        email : foundUser.email,
                        password : foundUser.password,
                        isVerified : foundUser.isVerified,
                    }
                    userData.setUsersData([...userData.users.filter(user => user.email !== foundUser.email),foundUser]);
                    await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),
                    JSON.stringify(userData.users)
                    );
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