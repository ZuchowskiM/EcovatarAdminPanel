var FireModule = require("./fire.js")
const jwt = require('jsonwebtoken')
const Firebase =  require('firebase');
require("firebase/firestore");

var db = FireModule.db

const router = require(`express`).Router()
const accountsData = []

const doc = db.collection("accounts")
		.get()
		.then(querySnapshot => {
			querySnapshot.forEach(doc => {
				const data = doc.data()
				accountsData.push(data)
			})
		}).catch(error => console.log(error))

//BUG at this stage always uniqueID=0//!!!
let uniqueId = accountsData.length
///////////////////////////////////////

console.log("uniqueID: " + uniqueId)

//Get all collection
router.get(`/accounts/`, (req, res) => 
{   

    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                res.send(accountsData);
            }
            else
            {
                res.json({errorMessage:`User is not an administrator`})
            }
        }
    })

    
    
})

//Get one item
router.get(`/accounts/:id`, (req, res) => 
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                console.log(req.params.id)
                const selectedAccounts = accountsData.filter(account => account.id === parseInt(req.params.id))
                //console.log(selectedAccounts) //DEBUG 
                res.send(selectedAccounts[0])
            }
            else
            {
                res.json({errorMessage:`User is not an administrator`})
            }
        }
        
    })
    
})

//Add one item
router.post(`/accounts/`, (req, res) => 
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                uniqueId = accountsData.length
                let newAccount = req.body
                newAccount.id = uniqueId + 1
                newAccount.lastLogin = Firebase.firestore.Timestamp.now();

                db.collection('accounts').doc(newAccount.id.toString()).set({
                    coinsCount: parseInt(newAccount.coinsCount),
                    id: newAccount.id,
                    isPremium: newAccount.isPremium,
                    lastLogin: newAccount.lastLogin,
                    password: "",
                    username: newAccount.username,
                }).then((arg) =>{
                    accountsData.push(newAccount);
                    uniqueId++;
                    res.send(accountsData);
                }).catch(error =>{ 
                    console.log(error);
                    res.json({errorMessage: error.toString()})
                });

              
            }
            else
            {
                res.json({errorMessage:`User is not an administrator`})
            }
        }
        
    })
    
})


// Update one item
router.put(`/accounts/:id`, (req, res) => 
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                const updatedAccount = req.body
                accountsData.map(acc => 
                {
                    if(acc.id === parseInt(req.params.id))
                    {
                        acc.username = updatedAccount.username
                        acc.coinsCount = updatedAccount.coinsCount
                        acc.isPremium = updatedAccount.isPremium
                    }
                })
                
                db.collection('accounts').doc(req.params.id).update({
                    username: updatedAccount.username,
                    coinsCount: parseInt(updatedAccount.coinsCount),
                    isPremium: updatedAccount.isPremium,
                }).catch(error =>{ 
                    console.log(error);
                    res.json({errorMessage: error.toString()})
                });

                res.send(accountsData)
            }
            else
            {
                res.json({errorMessage:`User is not an administrator`})
            }
        }
    })
    
       
})


// Delete one item
router.delete(`/accounts/:id`, (req, res) => 
{
    jwt.verify(req.headers.authorization, process.env.JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) => 
    {
        if (err) 
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else
        {
            if(decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
            {
                let selectedIndex
                accountsData.map((account, index) => 
                {
                    if(account.id === parseInt(req.params.id))
                    {
                        selectedIndex = index
                    }
                })
                
                db.collection('accounts').doc(req.params.id).delete()
                .catch(error =>{ 
                    console.log(error);
                    res.json({errorMessage: error.toString()})
                });

                accountsData.splice(selectedIndex, 1)
                
                res.send(accountsData)
            }
            else
            {
                res.json({errorMessage:`User is not an administrator`})
            }
        }
    })
          
})

module.exports = router