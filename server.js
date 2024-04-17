const klikbca = require('./klikbca.js');
const mybcaMobile = require('./mybcamobile.js');
const express = require ('express')
const path = require('path');
const web = express()
const [port,host]= [8080,'127.0.0.1'];
const mysql = require('mysql2/promise');
const pool = mysql.createPool('mysql://root:root@localhost:3306/monitoring');
const application = [ 'klikbca' ,'mybcamobile'];
const InsertKlikbca = "INSERT INTO `klikbca` (`Waktu_Test`,";
const InsertmyBcaMobile = "INSERT INTO `mybcamobile` (`Waktu_Test`,"

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.bca.mybca.omni.android',
  'appium:appActivity': 'com.bca.mybca.omni.android.presentation.splashscreenrevamp.SplashScreenActivity',
  'appium:noReset': 'true',
};

const wdOpts = [{
  hostname:  '0.0.0.0',
  port:  4723,
  logLevel: 'silent',
  capabilities,
},{hostname:  '0.0.0.0',
port:  4724,
logLevel: 'silent',
capabilities,},{
hostname:  '0.0.0.0',
port:  4725,
logLevel: 'silent',
capabilities,}
]


web.use(express.json())
web.use(express.text())
web.use(express.static(path.join(__dirname,'htmls')));
web.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'htmls', 'index.html'));
})
function preventDirectAccess(req, res, next) {
  const referer = req.get('Referer');

  // Check if the request has a Referer header
  if (!referer) {
    // No Referer header, indicating potential direct access
    return res.status(403).send('Forbidden: Direct access not allowed');
  }


  next();
}
async function getklikbca(connection,jsonData){
  const sql = 'SELECT * FROM `klikbca`';
  //const values = ['Page', 45];

  const [rows, fields] = await connection.execute(sql);

  return rows;

}
async function getmybcamobile(connection,jsonData){
  const sql = 'SELECT * FROM `mybcamobile`';
  //const values = ['Page', 45];

  const [rows, fields] = await connection.execute(sql);

  return rows;

}

async function query(connection,query,table){
  delete query.jenisAplikasi
  let rows 
  let fields
  if(query.showError == true){
  const sql = `select * from ${table} WHERE (Waktu_TEST > '${query.sT}' AND Waktu_TEST <= '${query.eT}') AND response = 'error' `;
  [rows, fields] = await connection.query(sql);
  }
  else{
  const sql = `select * from ${table} WHERE Waktu_TEST > '${query.sT}' AND Waktu_TEST <= '${query.eT}' `;
  [rows, fields] = await connection.query(sql); 
}
  await connection.release();
  return rows;
   
}

// Apply the preventDirectAccess middleware to specific routes
//web.use('/klikbca', preventDirectAccess);
//web.use('/mybcamobile', preventDirectAccess);
web.use('/queryTimePeriodResults', preventDirectAccess);
web.use('/manquery',preventDirectAccess);
web.get('/klikbca', async (req, res) => {
  const connection = await pool.getConnection();

  //await getklikbca(connection)
  try{
  let params = req.query.testcase;
  let id = req.query.id
  console.log(params,id)
  let x = await klikbca.test(params.split(','));
  console.log('function returned value',x);
  if (x.response === "Waiting for another task to complete"){
    console.log(x.response);
    res.json({response: "Busy handling task, please choose another machine"})
    res.end();
  }
  else if (x.response === 'Test_case Invalid' ){
    console.log(x.response);
    throw new error(x)
  }else{
  //res.setHeader('Content-Type', 'application/json');
  let [statement , values ] = prepareInsStatement(x,InsertKlikbca);
  let newValue = values.map (value => (value === undefined ? 'Not_Tested' : value));
  //newValue.unshift(JSON.stringify(x[0]))
  let [result] = await connection.query(statement,newValue);
  console.log(result)
  if(typeof myVariable === 'object' && !Array.isArray(myVariable) && myVariable !== null){
    throw new error('failure uploading data to mysql')
  }
  res.json(x);
  connection.release();
  res.end();
}
}
  catch(error){
    res.json({function: 'error while running test, please consult console'})
    res.end();
  }
})
web.get('/mybcamobile', async (req, res) => {
  const connection = await pool.getConnection();

  //await getklikbca(connection)
  try{
  let params = req.query.testcase;
  console.log(params)
  let x = await mybcaMobile.runTest(params.split(','),wdOpts[0]);
  console.log('function returned value',x);
  if (x.response === "Waiting for another task to complete"){
    console.log(x.response);
    res.json({response: "Busy handling task, please choose another machine"})
    res.end();
  }
  //{response: "Waiting for another task to complete"}
  else if (x.response === 'Test_case Invalid'){
    console.log(x.response);
    throw new error( 'wrong test case')
  }else if (x.response === 'login error'){
    res.json({response: "error logging in , please send another request"})
    res.end();
  }
  //res.setHeader('Content-Type', 'application/json');
  let [statement , values ] = prepareInsStatement(x,InsertmyBcaMobile);
  let newValue = values.map (value => (value === undefined ? 'Not_Tested' : value));
  console.log(statement);
  console.log(newValue);
  //newValue.unshift(JSON.stringify(x[0]))
  let [result] = await connection.query(statement,newValue);
  console.log(result)
  if(typeof myVariable === 'object' && !Array.isArray(myVariable) && myVariable !== null){
    throw new error('failure uploading data to mysql')
  }
  res.json(x);
  connection.end();
  res.end();
}
  catch(error){
    console.log(error)
    res.json({function: 'error while running test, please consult console'})
    res.end();
  }
})
web.post('/queryTimePeriodResults',async (req,res)=>{
  let jsonData = Object.values(req.body);
  let result = [];
  const connection = await pool.getConnection();
  let x = req.body.jenisAplikasi
  console.log(x);
  const testArray = [await query(connection,req.body,'klikbca'),await query(connection,req.body,'mybcamobile')]
  for(let i= 0; i< x.length; i++){
    if (x[i] == 1){
      console.log('testing')
      result[i]=testArray[i]
    }
    else {
      result[i]={function: 'no Query done For this aplication'}
      console.log('not testing')
    }

  }
  res.json(result);
  connection.release();
  res.end();
})
web.post('/manquery',async (req,res)=>{
  let rows
  const connection = await pool.getConnection();
  try{
  [rows,fields] = await connection.query(req.body);
  console.log(rows); 
  await connection.release();
  res.send(JSON.stringify(rows));
  }
  catch(error){
    res.send(error);
  }
})

web.listen(port,host, () => {
  console.log(`Example app listening on port ${port} and at host ${host}`)
})

async function run() {
  let res = await a.test();
  console.log(JSON.stringify(res));
  return res;
}

function prepareInsStatement(data,Insert){
  let Values = 'VALUES (CURRENT_TIMESTAMP(),';
  let arr = [];
  let checkarr = data[1]
  let fullcheck = Object.keys(checkarr);
  let result;
    for(let i in fullcheck){
       Insert = Insert + '`' + fullcheck[i] + '`'+ ',' ;
       Values = Values + '?' + ',';
       arr.push(data[0][fullcheck[i]]);}
  Insert = Insert.substring(0, Insert.length - 1);
  Insert = Insert + ")"
  Values = Values.substring(0, Values.length - 1);
  Values = Values + ")"
result = Insert + Values 
return [result,arr]
}

//run();