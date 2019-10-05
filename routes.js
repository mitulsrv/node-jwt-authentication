const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');

const jwtKey = 'AlexDenial'

const jwtExpirtySeconds = 300

const users = {
    user1: "Mitul",
    user2: "Alex"
}

const signIn = (req, res) =>{
    //Get Cred. from json body
    // const {username, password} = req.body
    const username = req.body.username
    const password = req.body.password
    console.log(req.body);
    console.log(username +" " + password)

    if(!username || !password){ // || users[username] !== password){
        //return 401 error for user is not exist or invalid cred.
        return res.status(401).end()
    }
    console.log('try')
    //create token with username in payload and which expire after 3000 second after issue
    const token = jwt.sign({ username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirtySeconds
    })
    console.log('end try')
    console.log('Token is :-' + token)
    //set cookie as string with similar age of token 
    res.cookie('token', token, {maxAge: jwtExpirtySeconds * 1000})
    res.end();
}


const welcome = (req, res) => {
    //obtaining session token from request cookies
    const token  = req.cookies.token
    console.log("in Welcome token is " + token)
    //if token is not set then unauthorized error
    if(!token){
        return res.status(401).end()
    }

    var payload 
    try{
        //parse JWT string and store result in payload
        //passing a key 
        //This method will throw an error if token is invalid (if it has expired according to the expiry time we set on sign in)
        //or if it does not match

        payload = jwt.verify(token, jwtKey)
        console.log('Payload for welcome :- ' + payload)

    }catch(e){
        if(e instanceof jwt.JsonWebTokenError){
            //if jwt based errror is thrown then unauthorized access with status code of 401
            console.log(e)
            return res.status(401).end()
        }
        //otherwise server error
        return res.status(400).end()
    }
    res.send(`Welcome ${payload.username}`)
}

const refresh = (req, res) => {
    //The code uptil this point is the same as the first part of the `welcome` route
    const token = req.cookies.token
    console.log( "In refresh token is " + token)

    if(!token){
        return res.status(401).end()
    }

    var payload 
    try{
        payload = jwt.verify(token, jwtKey)
        console.log('In refresh payload :- ' + payload);
    }catch(e){
        if(e instanceof jwt.JsonWebTokenError){
            return res.status(401).end()
            console.log(e)
        }
        return res.status(400).end()
    }

    //Create a token for the current user, with renewed expirtation time

    const newToken = jwt.sign({username: payload.username}, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirtySeconds
    })
    console.log('New Token is ' + newToken)
    //SET the new token as the user 'token' cookie
    res.cookie('token', newToken, {maxAge: jwtExpirtySeconds * 1000})

    res.end()
}

module.exports = {
    signIn,
    welcome,
    refresh
}

