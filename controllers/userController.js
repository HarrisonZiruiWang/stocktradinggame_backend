var express = require('express');
var app = express();
var passport = require('passport');
var request = require('request')
let flash = require("connect-flash");
const { Pool, Client } = require('pg');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const LocalStrategy = require('passport-local').Strategy;
var message = "";
const pool = new Pool({
    user: 'sdg',
    host: 'localhost',
    database: 'sdg',
    password: '123',
    port: 5432,
});

exports.postUserData = async function (req,res) {
  try{
      const client = await pool.connect();
      await client.query('BEGIN');
      let password = await bcrypt.hash(req.body.password,5);
      await JSON.stringify(client.query('SELECT id from users where email = $1', [req.body.email], function (err,result) {
          if(result.rows[0]){
              res.json({"message":"user exists"});
          }
          else{
              client.query("INSERT into users (id, email,password) values ($1,$2,$3)", [uuidv4(),req.body.email,password],
                  function(err,result){
                    if(err)
                        throw err;
                    else{
                        console.log(password);

                        res.send({"message": "successful"});
                        client.query('COMMIT');
                    }
                  });
          }
      }));
      client.release();
  }
  catch(e){throw(e)}
};

let authenticateUser = function (req,res) {
    if(req.isAuthenticated()){
        res.json({"message":"logged in"});
    }
    else{
        res.json(message);
    }
};
let login = function(req,res){


};
exports.logInUser = passport.authenticate('local', {
    successRedirect: login,
    failureRedirect: authenticateUser,
    failureFlash: true
}), function(req, res) {

};

passport.use('local', new LocalStrategy({passReqCallBack: true},(req,email,password,done) =>{
    login();
    async function login(){
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            let data = await JSON.stringify(client.query('SELECT id, email, password from users where email = $1', [email],
                function (err,result) {
                    if(err)
                        return done(err);
                    if(result.rows[0]===null){
                            message = {"message":"incorrect login details"};
                            return done(null,false);
                    }
                    else{
                        bcrypt.compare(password, result.rows[0].password, function(err, check){
                           if(err){
                               message = {"message":"error while authenticating"};
                               return done();
                           }
                           else if(check){
                               message = {"message": "successful"};
                               return done(null,[{id: result.rows.id, email: result.rows.id}]);
                           }
                           else{
                               message = {"message": "incorrect login details"};
                               return done(null,false);
                           }
                        });
                    }
                }))
        }
        catch (e) {
            throw (e);
        }
    }
}));

passport.serializeUser(function (user,done) {
   done(null,user);
});

passport.deserializeUser(function (user,done) {
   done(null,user);
});