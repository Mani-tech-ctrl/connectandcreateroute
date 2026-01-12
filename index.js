const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
//to parse form data
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'new_app',
    password: 'Myrl_Greenholt11'
});

//random data useerfunction
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

//inserting new data
let q = "INSERT INTO user (id, username, email, password) VALUES ?";


//create route , SHOWING NO. OF USERS
app.get("/", (req, res) => {
    let q = `select count(*) from user`;
    try{
      connection.query(q, (err, result) => {
       if(err) throw err;
       //console.log(result[0]["count(*)"]); 
       let count = result[0]["count(*)"];
       res.render("home.ejs", {count});
     });
    } catch (err) {
       console.log(err);
       res.send("some error in DB"); //res = response
    }
    
});

//create route , SHOWING USER DATA (USERID, USRNAME, EMAIL) OF ALL USER

app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    // res.send("success");

    try{
        connection.query(q, (err, users) => {
            if (err) throw err;
            console.log(users);
            //res.send(result);
            res.render("showusers.ejs", {users});
        });
    } catch(err){
        console.log(err);
        res.send("some error occured");
    }
});


//Edit route
app.get("/user/:id/edit", (req, res)=> {
    let {id} = req.params;
    //find user info
    let q = `SELECT * FROM user WHERE id ='${id}'`;
    
    try{
        connection.query(q, (err, result)=> {
            if(err) throw err;
            let user = result[0];
            console.log(result);
            res.render("edit.ejs", {user});
        });
    } catch(err) {
        console.log(err);
        res.send("some error in DB");
    }
});



//ROUTE = EDIT/UPDATE routes actuall update in DB
app.patch("/user/:id", (req, res)=>{
    let {id} = req.params;
    // FORM PASSWOR
    let {password: formPassword, username: newUsername} = req.body;
    let q = `SELECT * FROM user Where id ='${id}'`;
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            //search form != user password
            if(formPassword != user.password) {
                res.send("WRONG PASSWORD");
            } else { // update new username in db
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
           
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }

});


app.listen("8080", ()=>{
    console.log("server is listening to port 8080");
});


// try{
//     connection.query(q, [data], (err, result) => {
//     if(err) throw err;
//     console.log(result); 
//   });
// } catch (err) {
//     console.log(err);
// }

// connection.end();