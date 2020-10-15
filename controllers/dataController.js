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
          b_stockA,b_stockB, b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,s_stockD, time_spent, round_played_at, 
          random_number, worker_id, question_1, question_2, question_3, question_4, question_5,
          question_6, question_7, question_8, question_9, question_10, question_11, question_12_i, question_12_ii, question_13, 
          question_14, question_15_gender, question_15_age, question_15_annual_income, question_15_net_worth, 
          question_15_education, question_15_homeowner, question_15_zipcode, bonus, assignment_id, is_quiz_passed,
          new_question_13_i, new_question_13_ii, new_question_14_i, new_question_14_ii, new_question_14_iii} = req.body;

   poolConnection.query("insert into sdg_data1 values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14" +
                        ", $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32" +
                        ", $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50)", [uid, experiment_number, round, 
                        price_of_stockA, price_of_stockB,price_of_stockC,price_of_stockD, choices, b_stockA,b_stockB, 
                        b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,s_stockD, time_spent, round_played_at, 
                        random_number, worker_id, question_1, question_2, question_3, question_4, question_5,
                        question_6, question_7, question_8, question_9, question_10, question_11, question_12_i, question_12_ii, question_13, 
                        question_14, question_15_gender, question_15_age, question_15_annual_income, question_15_net_worth, 
                        question_15_education, question_15_homeowner, question_15_zipcode, bonus, assignment_id, is_quiz_passed,
                        new_question_13_i, new_question_13_ii, new_question_14_i, new_question_14_ii, new_question_14_iii], (error)=>{
         if(error)
            throw error;
         res.status(200).json({"message":"successful"});
   });

};

exports.postSavedDataCh = function (req,res) {
    const {uid, experiment_number, round, price_of_stockA, price_of_stockB,price_of_stockC, price_of_stockD, choices,
           b_stockA,b_stockB, b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,s_stockD, time_spent, round_played_at, 
           random_number, worker_id, question_1, question_2, question_3, question_4, question_5,
           question_6, question_7, question_8, question_9, question_10, question_11, question_12_i, question_12_ii,  
           question_15_gender, question_15_age, question_15_tel, question_15_education, 
           question_15_major, bonus, assignment_id, is_quiz_passed,
           new_question_13_i, new_question_13_ii, new_question_14_i, new_question_14_ii, new_question_14_iii,
           new_question_5, new_question_6, new_question_7} = req.body;
 
    poolConnection.query("insert into sdg_data_ch values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14" +
                         ", $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32" +
                         ", $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49)", [uid, experiment_number, round, 
                         price_of_stockA, price_of_stockB,price_of_stockC,price_of_stockD, choices, b_stockA,b_stockB, 
                         b_stockC, b_stockD, s_stockA,s_stockB,s_stockC,s_stockD, time_spent, round_played_at, 
                         random_number, worker_id, question_1, question_2, question_3, question_4, question_5,
                         question_6, question_7, question_8, question_9, question_10, question_11, question_12_i, question_12_ii,  
                         question_15_gender, question_15_age, question_15_tel, question_15_education, 
                         question_15_major, bonus, assignment_id, is_quiz_passed,
                         new_question_13_i, new_question_13_ii, new_question_14_i, new_question_14_ii, new_question_14_iii,
                         new_question_5, new_question_6, new_question_7], (error)=>{
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