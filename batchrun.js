const NumAccount = 2
const http = require('http');
const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const searchItems2 = ['Transfer Dana','Transfer ke Rek. BCA'];
const searchItems = ['Informasi Rekening','Informasi Saldo','Mutasi Rekening'];
const searchItems3 = ['Informasi Rekening','Mutasi Rekening'];
const returning = 'Kembali\nke Menu Utama' ;
const logout = '[ LOGOUT]';
const fullcheck = ['cek_saldo', 'cek_mutasi', 'cek_transfer', 'response','return_error']
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('node:fs/promises');
const mysql = require('mysql2/promise');
const telegram = require('./telegram.js');
const InsertKlikbca = "INSERT INTO `klikbca` (`Waktu_Test`,";

const { exec } = require('child_process');


async function example(content) {
  try {
    const d = new Date();
    let text = d.toString();
    await fs.appendFile('logfile.txt', content);
    await fs.appendFile('logfile.txt', text);
    await fs.appendFile('logfile.txt', '\r\n');
  } catch (err) {
    console.log(err);
  }
}

async function getSpecific( iframe, selector ) {
    return iframe.evaluate((select) => {
        document.querySelector(select).click();
    },selector);
}

async function getTextInIframe(tablePosition, iframe, selector ) {
    return iframe.evaluate((position,select) => {
        document.querySelectorAll(select)[position].click();
    }, tablePosition,selector);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function getSum(total, num) {
	return total + num;
  }
async function test(test_case,run) {
	let result = {};
	const accounts = [,"rezahadi0620"] // ganti pake user klikbca anda
	const passwords = [,"123456"] // ganti pake pass anda 
	let array_of_functions = [
        cek_saldo,
        cek_mutasi,
        cek_transfer
    ];
	if ( !Array.isArray(test_case) || test_case.reduce(getSum,0)  <= 0 || test_case.length != array_of_functions.length){
		result.response = 'Test_case Invalid';
		return result;
	//	throw new Error('Test_case Invalid')
	}
	/*exec(`chrome --profile-directory="Default"  --remote-debugging-port=9222`, (error, stdout, stderr) => {
		if (error) {
		  console.error(`Error executing the command: ${error}`);
		  return;
		}
		// Log the output of the command
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	  });*/

	let sock = await getWebSocket();
    sock = JSON.parse(sock)
    webSocketDebuggerUrl = sock.webSocketDebuggerUrl
    const browser = await puppeteer.connect({
      defaultViewport: {
        width: 1400,
        height: 800
      },
      browserWSEndpoint: webSocketDebuggerUrl ,
  });
  /*const browser = await puppeteer.launch({
	headless: false,
	defaultViewport: {
		width: 1100,
		height: 600
	}
});*/
	const page = await browser.newPage();
	await page.goto('https://ibank.klikbca.com/');
	const cookiesString = JSON.stringify(await page.cookies());
  	const cookies = await page.cookies();
	console.log("Debug breaks")
	// try login
	try{
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		  });
		const id = await page.$('#txt_user_id');
		await id.type(accounts[run],{delay: 100})
		const pw = await page.$('#txt_pswd',);
		await pw.type(passwords[run],{delay: 100});
		await page.keyboard.press('Enter');
		// relogin and form validation error logging 
		page.on('dialog', async dialog => {
			//get alert message
			console.log(dialog.message());
			example(dialog.message());
			//accept alert
			await dialog.accept();
		});
		await page.waitForNavigation({delay: 3000});
		await page.waitForSelector("frame[name='menu']",{timeout: 8000});
	}catch (error){
		console.log("cant Login");
		try{
			const d = new Date();
			let text = d.toString();
			await fs.appendFile('logfile.txt', 'cant Login error');
			await fs.appendFile('logfile.txt', text);
			await fs.appendFile('logfile.txt', '\r\n');
			result.response = "login error";
		}catch(err){
			console.log('cant log error');
		}
		console.error(error);
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		  });
		  await clearCookies(page,cookies.map(item => item.name));
		  //await clearCookies(page);
		  await page.close();
		  //await browser.close();
		return result;
	}
    try{
        for (let i = 0; i <array_of_functions.length; i++ ){
            if (test_case[i] == 1){
                await array_of_functions[i](page,result);
            }
        }
    }catch(error){
        console.log("one function error"); 
		return [result,x];
    }
    finally{
        await exit(browser,page,cookies.map(item => item.name)); 
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

    if (allKeysSuccess) {
        result.response = "success";
		result.return_error ="success"
    }
    else {
        result.response = "error";
    }
	let x = {}
    for(let i in fullcheck){
		if (result.hasOwnProperty(fullcheck[i])){
		x[fullcheck[i]] = 'tested' }
		else {
		x[fullcheck[i]] = 'not_tested'
		}
	  }
    console.log(result);
          return [result,x];
          // for relogging, directly hit https://ibank.klikbca.com/authentication.do
};

let iframe2selector;
async function cek_saldo(page,result){
	console.log("try checking saldo");
	// try check saldo 
	try{ 
		let iframe2cntn;
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let iframe2 = frames.find(f => f.name() === 'atm');
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);
		});
		let table_position = innerTextArray.indexOf(searchItems[0]);;
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await sleep(2000);
		await iframe.waitForSelector("tr td font a");
		let innerTextArray2 = await iframe.$$eval("tr td font a", elements => elements.map(element => element.innerText));
		table_position = innerTextArray2.indexOf(searchItems[1]);
		await getTextInIframe(table_position, iframe, 'tr td font a');
		await iframe2.waitForSelector('tr:nth-child(0n+2) td div font');
		iframe2cntn = await iframe2.$eval('tr:nth-child(0n+2) td div font',element  => element.innerText);
		example(iframe2cntn);
		//await page.screenshot({ path: 'example.png' });
		if ( iframe2cntn && iframe2cntn.length ) { result.cek_saldo = "success"; }
	}catch(error){
		console.log("Cek saldo failed");
		try{
			const d = new Date();
			let text = d.toString();
			await fs.appendFile('logfile.txt', 'Cek saldo failed');
			await fs.appendFile('logfile.txt', text);
			await fs.appendFile('logfile.txt', '\r\n');
			result.cek_saldo = "error"
		}catch(err){console.log('cant log error');}
			console.error(error);
	};
	console.log("try returning to main function");
		//returning to home
	await sleep(2000);
	try{
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);});
		let table_position = innerTextArray.indexOf(returning);
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await iframe.waitForNavigation({ waitUntil: ['load'] });
		await sleep(2000);
	}
	catch(error){
		console.log("Returning to Home failed");
			try{
				const d = new Date();
				let text = d.toString();
				await fs.appendFile('logfile.txt', 'Returning to home Failed');
				await fs.appendFile('logfile.txt', text);
				await fs.appendFile('logfile.txt', '\r\n');
				result.return_error='occured';	
			}catch(err){console.log('cant log error');}
		console.error(error);
	};
}

async function cek_mutasi(page,result){
console.log("try Checking mutasi");
// try check mutasi 
	try{
		let iframe2cntn;
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let iframe2 = frames.find(f => f.name() === 'atm');
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);
		});
		let table_position = innerTextArray.indexOf(searchItems[0]);;
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await sleep(2000);
		await iframe.waitForSelector("tr td font a");
		frames = await page.frames();
		iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		iframe2 = frames.find(f => f.name() === 'atm');
		await iframe.waitForSelector("tr td font a");
		let innerTextArray2 = await iframe.$$eval("tr td font a", elements => elements.map(element => element.innerText));
		table_position = innerTextArray2.indexOf(searchItems[2]);
		await getTextInIframe(table_position, iframe, 'tr td font a');
		await iframe2.waitForSelector('tr:nth-child(0n+2) td input[type="radio"]');
		await getSpecific(iframe2, 'tr:nth-child(0n+2) td input[type="radio"]')
		await getSpecific(iframe2,'tr:nth-child(0n+2) td input[type="submit"]:nth-child(0n+1)');
		//await page.waitForNavigation({delay: 3000});
		await iframe2.waitForSelector('table tbody tr:nth-child(5) td:nth-child(3) font');
		iframe2cntn = await iframe2.$$eval('table tbody tr:nth-child(5) td:nth-child(3) font',elements => elements.map(element => element.innerText));
		example(iframe2cntn[iframe2cntn.length -1]);
		if ( iframe2cntn && iframe2cntn.length ) { result.cek_mutasi = "success"; }
		//await page.screenshot({ path: 'example2.png' });
	}catch (error){
			console.log("Cek mutasi failed");
			try{
				const d = new Date();
				let text = d.toString();
				await fs.appendFile('logfile.txt', 'Cek mutasi failed');
				await fs.appendFile('logfile.txt', text);
				await fs.appendFile('logfile.txt', '\r\n');
				result.cek_mutasi = "error"
			}catch(err){console.log('cant log error');}
			console.error(error);
		};
	
	console.log("try returning to main function");
		//returning to home
	await sleep(2000);
	try{
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);});
		let table_position = innerTextArray.indexOf(returning);
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await iframe.waitForNavigation({ waitUntil: ['load'] });
		await sleep(2000);
	}
	catch(error){
		console.log("Returning to Home failed");
			try{
				const d = new Date();
				let text = d.toString();
				await fs.appendFile('logfile.txt', 'Returning to home Failed');
				await fs.appendFile('logfile.txt', text);
				await fs.appendFile('logfile.txt', '\r\n');	
				result.return_error='occured';
			}catch(err){console.log('cant log error');
		
		}
		console.error(error);
	};
}
async function cek_transfer(page,result){
	// check transfer dana
	console.log("checking transfer dana");
	try{
		let iframe2cntn;
		await sleep(2000);
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let iframe2 = frames.find(f => f.name() === 'atm');
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);});
	  	let table_position = innerTextArray.indexOf(searchItems2[0]);
	  	await getTextInIframe(table_position, iframe, 'tr td a font b');
	
	  	await iframe.waitForSelector("tr td font a");
	  	let innerTextArray2 = await iframe.$$eval("tr td font a", elements => elements.map(element => element.innerText));
	  	table_position = innerTextArray2.indexOf(searchItems2[1]);
	  	await getTextInIframe(table_position, iframe, 'tr td font a');
	  	await sleep(2000);
	  	await iframe2.waitForSelector('tr:nth-child(0n+1) td div font input');
	  	iframe2cntn = await iframe2.$$eval('tr:nth-child(8) td div font ',elements => elements.map(element => element.innerText));
	 	 example(iframe2cntn[iframe2cntn.length -1]);
	  	//await page.screenshot({ path: 'example3.png' });
		  if ( iframe2cntn && iframe2cntn.length ) { result.cek_transfer = "success"; }
	}catch (error){
		console.log("Transfer page wont load");
		try{
			const d = new Date();
			let text = d.toString();
			await fs.appendFile('logfile.txt', 'Transfer page wont load');
			await fs.appendFile('logfile.txt', text);
			await fs.appendFile('logfile.txt', '\r\n');
			result.cek_transfer = "error";
		} catch(err){
	console.log('cant log error');
		}
		console.error(error);
		};

	  //return to main function
	  console.log("returning to main function");
	  try{
	  frames = await page.frames();
	  iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
	  innerTextArray = await iframe.$$eval('tr td a font b', elements => {
		  return elements.map(element => element.innerText);
		});
	  table_position = innerTextArray.indexOf(returning);
	  await getTextInIframe(table_position, iframe, 'tr td a font b'); 
      await iframe.waitForNavigation({ waitUntil: ['load'] });
	  await sleep(4000);}
	  catch(error){
		console.log("Returning to Home failed");
			try{
				const d = new Date();
				let text = d.toString();
				await fs.appendFile('logfile.txt', 'Returning to home Failed');
				await fs.appendFile('logfile.txt', text);
				await fs.appendFile('logfile.txt', '\r\n');	
				result.return_error='occured';
			}catch(err){console.log('cant log error');
		
		}
		console.error(error);
	};
}
async function exit(browser,page,cookies){
	  // logging out 
	  let frames = await page.frames();
	  iframe = frames.find(f => f.name() === 'menu'); 
	  innerTextArray = await iframe.$$eval('tr td a font b', elements => {
		return elements.map(element => element.innerText);
	  });
	  table_position = innerTextArray.indexOf(logout);
	  await getTextInIframe(table_position, iframe, 'tr td a font b');
	  await page.waitForNavigation({delay: 5000});
	  await sleep(10000);
	  await page.evaluate(() => {
		localStorage.clear();
		sessionStorage.clear();
	  });
	  await clearCookies(page,cookies);
	  //await clearCookies(page);
	  await page.close();
	  //await browser.disconnect();
	  //await browser.close();
	  
 
	  // for relogging, directly hit https://ibank.klikbca.com/authentication.do
};

async function run() {
    const pool = mysql.createPool('mysql://root:root@localhost:3306/monitoring');
    const connection = await pool.getConnection();
        let numtries = 1;
        while (numtries <= 3) {
            console.log(numtries);
            let counter = await fs.readFile('E:/puppet/lastSuccAccountNum.txt', 'utf8');
            let x = await test([1, 1, 0], counter % NumAccount);
            if (x.response === 'Test_case Invalid') {
                console.log(x.response);
                break;
            } else if (x.response === "login error") {
                console.log(x.response);
                console.log(`current counter : ${counter}`);
                await fs.writeFile("E:/puppet/lastSuccAccountNum.txt", `${(parseInt(counter) + 1) % NumAccount}`);
                console.log("counter_changed");
                if (numtries === 3) {
                    await connection.query(InsertKlikbca + `response) VALUES (CURRENT_TIMESTAMP(), 'login error')`);
                    await telegram.sendAlert();
					//console.log("error sent");
					break;
                } else {
                    numtries++;
                    continue;
                }
            } else if (x[0].response === 'error') {
                if (numtries === 3) {
					
                    await telegram.sendAlert();
                    numtries++;
					//console.log("error sent");
					break;
                }
                console.log(x.response);
                numtries++;
                continue;
            } else {
                let [statement, values] = prepareInsStatement(x, InsertKlikbca);
                let newValue = values.map(value => (value === undefined ? 'Not_Tested' : value));
                let [result] = await connection.query(statement, newValue);
                console.log(result);
                if (typeof myVariable === 'object' && !Array.isArray(myVariable) && myVariable !== null) {
                    throw new Error('failure uploading data to mysql'); // Corrected 'error' to 'Error'
                }
            }
			numtries++;
            break;
        
		}
		connection.release();
		pool.end();
		console.log("ending function");
		setTimeout(() => {
			console.log('Process timed out. Exiting...');
			process.exit(0); 
		}, 5000);
}


run();

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

  function getWebSocket() {
	const [hostname, url, port] = ["127.0.0.1", "/json/version", 9222]; // Changed port to number
	const options = {
	  host: hostname,
	  port: port,
	  path: url,
	  method: 'GET',
	};

	return new Promise((resolve, reject) => {
	  const req = http.request(options, (res) => {
		let data = '';
  
		res.on('data', (d) => {
		  data += d;
		});
  
		res.on('end', () => {
		  if (res.statusCode === 200) {
			resolve(data);
		  } else {
			reject(new Error(`Request failed with status code ${res.statusCode}`));
		  }
		});
	  });
  
	  req.on('error', (e) => {
		console.error('Request error:', e);
		reject(e);
	  });
  
	  req.end();
	});
  }

  async function clearCookies(page, cookieNames = []) {
	console.log("debug.breaks")
	try {
	  if (cookieNames.length === 0) {
		// Clearing all cookies
		await page.evaluate(() => {
		  document.cookie.split(';').forEach((cookie) => {
			const name = cookie.split('=')[0].trim();
			document.cookie = `${name}=; expires=Thu, 02 Jan 2024 00:00:00 UTC; path=/;`;
		  });
		});
	  } else {
		// Clearing specific cookies
		await page.deleteCookie();
	  }
  
	  // Cookies have been cleared successfully
	  return true;
	} catch (error) {
	  // An error occurred while clearing cookies
	  console.error('Error clearing cookies:', error);
	  return false;
	}
  }

