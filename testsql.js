const { json } = require('express');
const mysql = require('mysql2/promise');
const klikbca = require('./klikbca');
//const klikbca = require('./klikbca');
const poolstr = 'mysql://root:root@localhost:3306/monitoring';
const sql2 = 'SELECT * FROM `klikbca`';
const queryKlikbca = "INSERT INTO `klikbca` (`Waktu_Test`,`Tanggal_Test`,";
const checklistklikbca = ['cek_saldo', 'cek_mutasi', 'cek_transfer'];
const data = [
  {
    cek_saldo: 'success',
    return_error: 'success',
    response: 'success'
  },
  {
    cek_saldo: 'tested',
    cek_mutasi: 'not_tested',
    cek_transfer: 'not_tested',
    response: 'not_tested',
    return_error: 'tested'
  }
]

const Query = {
sT : "2024-03-01T03:55:00",
jenisAplikasi: ["1", "0"],
eT: "2024-03-04T03:56:00" ,
}
async function Insert(){
  const pool = mysql.createPool(poolstr);
  const connection = await pool.getConnection();
  try {

  //const arr = JSON.stringify(data[0]);
  let [statement , values ] = prepareStatement(data,queryKlikbca)
    //values.unshift(JSON.stringify(data[0]))
    console.log(statement);
  let [result] = await connection.query(statement,values);
  //console.log(result);
  //console.log(fields);
  let [rows, fields] = await connection.query(sql2);
  for (let row in rows){
   let dateString = rows[row]["Tanggal_Test"];
    const tanggal = new Date(dateString);
    // Adding 2 hours to the date
    console.log(tanggal.toDateString());
  }
  console.log(fields);
  //console.log(rows);
  //console.log(fields);

} catch (err) {
  console.log(err);
}
finally{
  await connection.release();
  await pool.end();
}
}
//console.log(data[1])
//Insert()
async function query(query){
  const pool = mysql.createPool(poolstr);
  const connection = await pool.getConnection();
  delete query.jenisAplikasi
  console.log(Object.values(query));
  const sql = `select * from klikbca WHERE Waktu_TEST > '${query.sT}' AND Waktu_TEST <= '${query.eT}' `
  let [rows, fields] = await connection.query(sql);
  for (let row in rows){
     // Adding 2 hours to the date
     console.log(rows[row]);
   }
   await connection.release();
   await pool.end();
}
query(Query);
function prepareStatement(data,Insert){
  let Values = 'VALUES (CURRENT_TIME(), CURRENT_DATE(),';
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
//console.log(prepareStatement(data))


