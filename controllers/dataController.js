const pool = require('pg').Pool;
const fastcsv= require('fast-csv');
const fs = require('fs');
const ws = fs.createWriteStream("data.csv");
const json2csv = require("json2csv").parse;
const poolConnection = new pool({
   user: 'rmumliffajwwsb',
   host: 'ec2-3-230-106-126.compute-1.amazonaws.com',
   database: 'db6027fg6q8c6q',
   password: '7c7806681650c4154a69b4a4dabfead78dacfddfb0098e4f444b9996c1676910',
   port: 5432,
   connectionString: process.env.DATABASE_URL,
   ssl: true
});
// const poolConnection = new pool({
//     user: 'sdg',
//     host: 'localhost',
//     database: 'sdg',
//     password: '123456',
//     port: 5432,
// });
poolConnection.connect();
var serverUIDcount = 0;
exports.getserverUIDcount = function(req,res){
    //res.setHeader('Access-Control-Allow-Origin', '*');
    poolConnection.query("Select * from serveridcount",(error,results)=>{
        if(error)
            throw error;
        res.status(200).json({"serverCount": results.rows[0].serveruidcount});

    });
    serverUIDcount++;
    poolConnection.query("Update serveridcount set serveruidcount = $1", [serverUIDcount], (error,results)=>{
       if(error)
           throw error;
    });


};
exports.postSavedData = function (req,res) {
   const {uid, experiment_number, round, price_of_stockA, price_of_stockB,price_of_stockC, price_of_stockD, choices,
          b_stockA,b_stockB, b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,s_stockD, time_spent, round_played_at} = req.body;
   poolConnection.query("insert into sdg_data1 values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14" +
                        ", $15, $16, $17, $18)", [uid, experiment_number, round, price_of_stockA, price_of_stockB,price_of_stockC,
                        price_of_stockD, choices, b_stockA,b_stockB, b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,
                        s_stockD, time_spent, round_played_at], (error)=>{
         if(error)
            throw error;
         res.status(200).json({"message":"successful"});
   });
};

exports.getExcelSheet = function (req,res){
  poolConnection.query("select * from sdg_data1", (error, results) =>{
        const json = JSON.parse(JSON.stringify(results.rows));
        //console.log(json.rows);
        // fastcsv
        //     .write(json.rows,{headers:true})
        //     .on("finish", function(){
        //         res.send("Downloading file....");
        //     }).pipe(ws);
      if(Object.keys(json).length!==0) {
          var csv = json2csv(json);
          var path = Date.now() + '.csv';
          fs.writeFile(path, csv, function (err, data) {
              if (err) {
                  throw err;
              } else {
                  res.setHeader('Content-disposition', 'attachment; filename=' + path);
                  res.set('Content-Type', 'text/csv');
                  res.download(path);
              }
          });
      }
      else{
          res.render('index', { title: 'No Data found' });
      }

  });

};
exports.login = function (req,res) {
  let email = "notarealemail@usf.edu";
  let password = "123456";
  if(req.body.email === email && req.body.password === password){
      res.json({"message":"Success"});
  }
  else{
      res.json({"message":"invalid credentials"});
  }
};