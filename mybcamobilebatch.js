const { remote } = require('webdriverio');
const fs = require('fs');
const { resolve } = require('path');
const pin = []; //Change into used user Transaction pin 
const fullcheck = ['transferSesama','transferBeda', 'response'] // Tambahkan ketika tambah flow, jangan lupa reset db 
//const xml2js = require('xml2js');
const InsertmyBcaMobile = "INSERT INTO `mybcamobile` (`Waktu_Test`,"
const mysql = require('mysql2/promise');
const xmlreader = require("./xmlreader.js")
const opsiTransfer = ['BI FAST', 'Realtime Online', 'LLG','RTGS']
const tujuanTransfer = ['Investment', 'Transfer of Wealth','Purchase','Others (for various purposes)']

// Change the below text 
const LoginPass = '' // change into your BCAID password
const noRekSesama = '0051003976' 
const namaRekSesama = 'sonia bawono' 
const namaRekBeda = 'ignatius'
const noRekBeda = '008192368121' 
const capabilities1 = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.bca.mybca.omni.android',
  'appium:appActivity': 'com.bca.mybca.omni.android.presentation.splashscreenrevamp.SplashScreenActivity',
  'appium:noReset': 'true',
  'appium:udid':'192.168.136.244:5555',
};
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.bca.mybca.omni.android',
  'appium:appActivity': 'com.bca.mybca.omni.android.presentation.splashscreenrevamp.SplashScreenActivity',
  'appium:noReset': 'true',
};

const wdmaster = [{
  hostname:  '127.0.0.1', port:  4723, logLevel: 'silent', capabilities, },
  {hostname:  '127.0.0.1',port:  4724, logLevel: 'silent', capabilities, },
  { hostname:  '127.0.0.1', port:  4725, logLevel: 'silent', capabilities,}
]
let wdOpts_1 = wdmaster[0]; 
async function writefile(driver,outputfile){
  const xmlData = await driver.getPageSource();
    fs.writeFile(outputfile , xmlData, (writeErr) => {
      if (writeErr) {
        console.error('Error writing to file:', writeErr);
      } else {
        console.log('XML written to output.xml');
      }
    });
}

async function init() {
  return new Promise((resolve,reject) =>{
    const { exec } = require('child_process');
  
    // Replace 'your-command-here' with the command you want to run
    const commandToRun = 'adb devices';
    
    exec(commandToRun, (error, stdout, stderr) => {
      if (error) {
        reject(new Error (`Error executing command: ${error.message}`))
      }
    
    let output = stdout.split('').slice(28,stdout.split('').length)
    if (output.length < 1){
      reject(new Error('No devices connected')); 
    } 
    else{
      console.log('devices connected');
      resolve('devices connected');
    } 
      //console.log(`Command output:\n${stdout}`);
    });
  })
}
function getSum(total, num) {
	return total + num;
}
async function runTest(test_case,wdOpts) {
  let n = 1
  let result = {}; 
  let array_of_functions= [test_transferSesama,test_transferBeda];
  
  if ( !Array.isArray(test_case) || test_case.reduce(getSum,0)  == 0 || test_case.length != array_of_functions.length){
		result.response = 'Test_case Invalid';
    console.log('Invalid Test');
		return result;
	//	throw new Error('Test_case Invalid')
	}
  try {
    let x = await init();
    const driver = await remote (wdOpts);
    await driver.setTimeout({'implicit': 10000})
    await driver.pause(6000);
    //let result = {}
    //outputfile = "output" + n + ".xml"
    //await writefile(driver,outputfile);
    //((n++));
    // Use an explicit wait to wait for the 'Pasword' element to be present
    let Passwordinput = await driver.$('.//*[@password="true"]');
    await Passwordinput.waitForExist({ timeout: 5000 });
    console.log(Passwordinput.elementId); 
    await driver.elementSendKeys(Passwordinput.elementId,LoginPass);
    //Passwordinput.click();// Adjust the timeout as needed
    await driver.pause(3000);
     let btn = await driver.$('.//*[@text="Log In"]');
    await btn.waitForExist({ timeout: 5000 }); // Adjust the timeout as needed
    await btn.click();
    await driver.pause(4000);
    try{
      for (let i = 0; i <array_of_functions.length; i++ ){
        console.log(result)
          if (test_case[i] == 1){
              await array_of_functions[i](driver,result);
          }
      }
      
  }catch(error){
      console.log("one function error");
  }
  await driver.pause(1000);
  await driver.terminateApp('com.bca.mybca.omni.android')
  await driver.deleteSession();
  }
catch (error) {
  console.error('Error during test:', error);
  result.response="error";
  return result;

} 
let allKeysSuccess = true;

    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        if (result[key] !== 'success') {
          allKeysSuccess = false;
          break;
        }
      }
    }
    let x = {}
    
    if (allKeysSuccess) {
        result.response = "success";
    }
    else {
        result.response = "failure";
    }

    for(let i in fullcheck){
      if (result.hasOwnProperty(fullcheck[i])){
      x[fullcheck[i]] = 'tested' }
      else {
      x[fullcheck[i]] = 'not_tested'
      }
      }
    
return [result,x];
}
async function test_transferSesama(driver,result){
  try{
  let n = 0;
  await writefile(driver,`outputS${n}.xml`)
  let elem = await driver.$('.//*[@text="Transfer"]');
  let attributes = await elem.getAttribute("resource-id")
  let Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
  let res = await xmlreader.processFile(`outputS${n}.xml`,"text","Transfer")
  let ElemsText = [];
  async function getText(arrout,arrin) {
    for (const [index, element] of arrin.entries()) {
      const text = await element.getText();
      console.log(`Element at index ${index}: ${text}`);
      arrout.push(text)
    }
    }
  await getText(ElemsText,Elems)
  n++
  let buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`)  
  await buttonGroup[ElemsText.indexOf('Transfer')].click();
  await driver.pause(3000);
  await writefile(driver,`outputS${n}.xml`)
  elem = await driver.$('.//*[@text="Transfer to BCA Account"]');
  attributes = await elem.getAttribute("resource-id")
  Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
  res = await xmlreader.processFile(`outputS${n}.xml`,"text","Transfer to BCA Account")
  ElemsText = [];
  await getText(ElemsText,Elems)
  n++
  buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`) 
  await buttonGroup[ElemsText.indexOf("Transfer to BCA Account")].click();
  await driver.pause(3000);
  await writefile(driver,`outputS${n}.xml`)
  await driver.pause(3000);
let searchbox = await driver.$(`.//*[@text="Search Transfer Beneficiary"]`)
await driver.elementSendKeys(searchbox.elementId,namaRekSesama);
n++
await writefile(driver,`outputS${n}.xml`)
elem = await driver.$(`.//*[@text="${noRekSesama}"]`);
  attributes = await elem.getAttribute("resource-id")
  Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
  res = await xmlreader.processFile(`outputS${n}.xml`,"text",noRekSesama)
  ElemsText = [];
  await getText(ElemsText,Elems)
  buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`) 
  await buttonGroup[ElemsText.indexOf(noRekSesama)].click();
  await driver.pause(3000);
//cari 0051003976
n++
await writefile(driver,`outputS${n}.xml`)
await driver.pause(3000);
let amountTransfer = await driver.$('.//*[@hint="Amount"]');
await driver.$('.//*[@hint="Amount"]').click()
await driver.elementSendKeys(amountTransfer.elementId,'10000');
await driver.pressKeyCode(4);
//text="Continue"
await driver.$('.//*[@text="Continue"]').click();

await driver.$('.//*[@text="Continue"]').click();
n++
await writefile(driver,`output${n}.xml`);
  //MASUKIN PIN 
for (let i = 0; i < pin.length ; i++ )
{
let searchstring = './/*[@text="' ; 
searchstring = searchstring.concat(pin[i]);
searchstring = searchstring.concat('"]');
console.log(searchstring);
btn = await driver.$(searchstring);
  await btn.click();
await driver.pause(500);
};
await driver.pause(10000);
  const test = await driver.$('.//*[@text="Transfer Successful"]');
  let tescontent = test.elementId;

if (tescontent !== null && tescontent !== undefined) {
try {
  const d = new Date();
  const timestamp = d.toLocaleString();
  const hasil_test = `Transfer function successful ${timestamp}\r\n`;

  // Using 'fs.promises' for async file operations
  await fs.promises.appendFile('mybcamobile.txt', hasil_test);

  console.log('Transfer function successful:', timestamp);
  result.transferSesama="success";
} catch (error) {
  console.error('Error appending to logfile:', error);
}
} else {
console.log('Element with text "Transfer Successful" not found.');
}

  btn = await driver.$('.//*[@text="Done"]');
  await btn.click();
 await driver.pause(1000);
 // Dia balik main menu, bisa langsung test flow selanjutnya
} catch (error) {
    console.log("tranfer to another bank failed");
    const d = new Date();
    let text = d.toString();
    hasil_test = "Transfer function failed at " + text;
    await fs.promises.appendFile("mybcamobile.txt", hasil_test );
    await fs.promises.appendFile("mybcamobile.txt", '\r\n');
    result.transferSesama="error";
    }
  
//exiting transfer function 
  }

  async function test_transferBeda(driver,result){
    try{
    let n = 0;
    await writefile(driver,`output${n}.xml`)
    let elem = await driver.$('.//*[@text="Transfer"]');
    let attributes = await elem.getAttribute("resource-id")
    let Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
    let res = await xmlreader.processFile(`output${n}.xml`,"text","Transfer")
    let ElemsText = [];
    async function getText(arrout,arrin) {
      for (const [index, element] of arrin.entries()) {
        const text = await element.getText();
        console.log(`Element at index ${index}: ${text}`);
        arrout.push(text)
      }
      }
    await getText(ElemsText,Elems)
    n++
    let buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`)  
    await buttonGroup[ElemsText.indexOf('Transfer')].click();
    await driver.pause(3000);
    await writefile(driver,`output${n}.xml`)
    elem = await driver.$('.//*[@text="Transfer to Other Banks"]');
    attributes = await elem.getAttribute("resource-id")
    Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
    res = await xmlreader.processFile(`output${n}.xml`,"text","Transfer to Other Banks")
    ElemsText = [];
    await getText(ElemsText,Elems)
    n++
    buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`) 
    await buttonGroup[ElemsText.indexOf("Transfer to Other Banks")].click();
    await driver.pause(3000);
    await writefile(driver,`output${n}.xml`)
    await driver.pause(3000);
  let searchbox = await driver.$(`.//*[@text="Search Transfer Beneficiary"]`)
  await driver.elementSendKeys(searchbox.elementId,namaRekBeda);
  elem = await driver.$(`.//*[@text="${noRekBeda}"]`);
    attributes = await elem.getAttribute("resource-id")
    Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
    res = await xmlreader.processFile(`output${n}.xml`,"text",noRekBeda)
    ElemsText = [];
    await getText(ElemsText,Elems)
    n++
    buttonGroup = await driver.$$(`.//*[@resource-id="${res['$']['resource-id']}"]`) 
    await buttonGroup[ElemsText.indexOf(noRekBeda)].click();
    await driver.pause(3000);
  await writefile(driver,`output${n}.xml`)
  await driver.pause(3000);
  let amountTransfer = await driver.$('.//*[@hint="Amount"]');
  await driver.$('.//*[@hint="Amount"]').click()
  await driver.elementSendKeys(amountTransfer.elementId,'10000');
  await driver.pressKeyCode(4);
  n++
  await driver.$('.//*[@text="Transfer Method"]').click();
  await driver.pause(3000);
  await writefile(driver,`output${n}.xml`);
  //text="BI FAST"
  elem = await driver.$(`.//*[@text="${opsiTransfer[0]}"]`);
    attributes = await elem.getAttribute("resource-id")
    Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
    await driver.pause(3000);
    res = await xmlreader.processFile(`output${n}.xml`,"text",opsiTransfer[0])
    ElemsText = [];
    buttonGroup = await driver.$(`.//*[@bounds="${res['$']['bounds']}"]`) 
    await buttonGroup.click();
    await driver.pause(3000);
    n++
    await writefile(driver,`output${n}.xml`);
    n++
  await driver.$('.//*[@text="Transaction Purpose"]').click();
  await driver.pause(3000);
  await writefile(driver,`output${n}.xml`);
  //clicking purchase parent element
  elem = await driver.$(`.//*[@text="${tujuanTransfer[2]}"]`);
    attributes = await elem.getAttribute("resource-id")
    Elems = await driver.$$(`.//*[@resource-id="${attributes}"]`);
    res = await xmlreader.processFile(`output${n}.xml`,"text",tujuanTransfer[2]);
    ElemsText = [];
    await getText(ElemsText,Elems)
    buttonGroup = await driver.$(`.//*[@index="${res['$']['index']}" and @clickable="true"]`) 
    await buttonGroup.click();
    await driver.pause(3000);
  n++
  await driver.$('.//*[@text="Continue"]').click();

await driver.$('.//*[@text="Continue"]').click();
  await writefile(driver,`output${n}.xml`);
    //MASUKIN PIN 
  for (let i = 0; i < pin.length ; i++ )
  {
  let searchstring = './/*[@text="' ; 
  searchstring = searchstring.concat(pin[i]);
  searchstring = searchstring.concat('"]');
  console.log(searchstring);
  btn = await driver.$(searchstring);
    await btn.click();
  await driver.pause(500);
  };
  await driver.pause(10000);
    const test = await driver.$('.//*[@text="Transfer Successful"]');
    let tescontent = test.elementId;
  
  if (tescontent !== null && tescontent !== undefined) {
  try {
    const d = new Date();
    const timestamp = d.toLocaleString();
    const hasil_test = `Transfer function successful ${timestamp}\r\n`;
  
    // Using 'fs.promises' for async file operations
    await fs.promises.appendFile('mybcamobile.txt', hasil_test);
  
    console.log('Transfer function successful:', timestamp);
    result.transferBeda="success";
  } catch (error) {
    console.error('Error appending to logfile:', error);
  }
  } else {
  console.log('Element with text "Transfer Successful" not found.');
  }
  
    btn = await driver.$('.//*[@text="Done"]');
    await btn.click();
   await driver.pause(1000);
   // Dia balik main menu, bisa langsung test flow selanjutnya
  } catch (error) {
      console.log("tranfer to another bank failed");
      const d = new Date();
      let text = d.toString();
      hasil_test = "Transfer function failed at " + text;
      await fs.promises.appendFile("mybcamobile.txt", hasil_test );
      await fs.promises.appendFile("mybcamobile.txt", '\r\n');
      result.transferBeda="error";
      }
    
  //exiting transfer function 
    }
// Execute the runTest function
  async function testing(){
    const pool = mysql.createPool('mysql://root:root@localhost:3306/monitoring');
    const connection = await pool.getConnection();
  let x = await runTest([0,1],wdOpts_1);
  console.log(x);
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
await pool.end()
  }

testing();


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