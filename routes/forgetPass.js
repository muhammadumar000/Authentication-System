
const fsPromises  = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt')
const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}

async function forgerPassword(fastify,options,done){
    fastify.put('/forgetPassword',async(req,res) => {
        const {newPassword,email} = req.body;
        console.log(newPassword,email)
        if(newPassword && email){

            const foundUser =  userData.users.find(user => user.email === email);
            if(!foundUser){
                res.status(400).send({"message":"user with  not found"})
            }
                foundUser.password = await bcrypt.hash(newPassword,10);
                userData.setUsersData([...userData.users.filter(user => user.email !== foundUser.email),foundUser]);
                await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),
                JSON.stringify(userData.users)
                );
                res.status(200).send({"message":"Password Changed"})
        } else{
            res.status(400).send({"message":"email and password are required!"})
        }
    })
}

module.exports  = forgerPassword;