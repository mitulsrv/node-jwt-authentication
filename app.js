const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');


const { signIn, welcome, refresh }  = require('./routes');


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', signIn);
app.get('/welcome', welcome);
app.get('/refresh', refresh);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})



//Run in localhost:3000
// POST    http://localhost:3000/signin

// {"username":"user1","password":"password1"}


//After
//GET http://localhost:3000/welcome


//After is you want to refresh
