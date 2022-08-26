const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

// user data: 

const userData = {
    users: require('../model/users.json'),
    setUsersData : function(data) {this.users = data}
}

async function confirmationRoute(fastify,options,done){
    fastify.get('/confirm/:id',async(req,res) => {
        const HashedId = decodeURIComponent(req.params.id);
        let foundUser;
        for (let i = 0; i < userData.users.length; i++) {
            if (await bcrypt.compare(userData.users[i].email,HashedId)){
                foundUser = userData.users[i];
            }
        }
        
        if(foundUser){
            // change isverified to true
            foundUser.isVerified = true;
            // write the new user data to the file
            userData.setUsersData([...userData.users.filter(user => user.email !== foundUser.email),foundUser]);
            await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),
            JSON.stringify(userData.users)
            );
            res.send({"message":"Account Verified"})
        }
        else{
            res.send({"message":"Invalid Link"})
        }
    })
    done()
}

module.exports = confirmationRoute;