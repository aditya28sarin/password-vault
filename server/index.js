require('dotenv').config();
const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT;
const {encrypt, decrypt} = require('./encryptionHandler');

app.use(cors());

app.use(express.json());

// Connection with Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DB
});

// POST route to add password to database
app.post('/addpassword', (req, res)=>{
    const {password, title} = req.body;

    const encryptedPassword = encrypt(password);

    db.query("INSERT INTO passwords (password, title, iv) VALUE (?,?,?)", [encryptedPassword.password,title, encryptedPassword.iv], (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("success");
        }
    });
});


// GET route to fetch all passwords from the database
app.get('/showpasswords', (req, res)=>{

    db.query("SELECT * FROM passwords", (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
});


// POST route to decrypt the encrypted passwords
app.post("/decryptpassword", (req, res) => {
    res.send(decrypt(req.body));
  });
  

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
}); 
