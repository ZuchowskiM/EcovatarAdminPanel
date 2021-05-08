var FireModule = require("./fire.js")
const jwt = require('jsonwebtoken')

var auth = FireModule.auth

const router2 = require(`express`).Router()

router2.put('/login/:emai', (req, res) => 
{
    const loginObject = req.body;
    console.log("starting authentication");
   
    auth.signInWithEmailAndPassword(loginObject.email.toString(), loginObject.password.toString())
    .then((user) => {
        console.log("success");

        const token = jwt.sign({email: loginObject.email.toString(), accessLevel: 1},
        process.env.JWT_PRIVATE_KEY, {algorithm:'HS256', expiresIn:process.env.JWT_EXPIRY});
          
        res.json({message: "success",name: loginObject.email.toString(), accessLevel: 1, token:token})

        
    })
    .catch(error =>
    {
        console.log(error)
        res.json({message: "failed login"})
                        
    });
 
})

router2.post('/logout', (req,res) => 
{       
    res.json({})
})



module.exports = router2