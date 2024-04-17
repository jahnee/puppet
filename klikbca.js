const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const searchItems2 = ['Transfer Dana','Transfer ke Rek. BCA'];
const searchItems = ['Informasi Rekening','Informasi Saldo','Mutasi Rekening'];
const searchItems3 = ['Informasi Rekening','Mutasi Rekening'];
const returning = 'Kembali\nke Menu Utama' ;
const logout = '[ LOGOUT]';
const Username = '' // masukin id klikbca
const password = '' //masukin password klikbca
const fullcheck = ['cek_saldo', 'cek_mutasi', 'cek_transfer', 'response','return_error']
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('node:fs/promises');
const queue = require('fastq').promise( testm, 1)
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
async function test(testCase){
	let result,x
	console.log(queue.length())
	if (!queue.idle()){
		let x = {response: "Waiting for another task to complete"}
		return x;
	}
	//queue.push(testCase)
	await new Promise(resolve => setTimeout(() => {
        result = queue.push(testCase);
        resolve();
    }, Math.floor(Math.random() * 4000)));
	//result = queue.push(testCase)
	//console.log(queue.length())
	//console.log(result)
	return result
}

async function testm(test_case) {
	let result = {};
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
	const browser = await puppeteer.launch({
		headless: false,
		//product: 'firefox',
		defaultViewport: {
			width: 1100,
			height: 600
		}
	});

	const page = await browser.newPage();
	
	// try login
	try{
		await page.goto('https://ibank.klikbca.com/');
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		  });
		const id = await page.$('#txt_user_id');
		await id.type(Username,{delay: 1000})
		const pw = await page.$('#txt_pswd',);
		await pw.type(password,{delay: 1000});
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
		await setTimeout(()=>{console.log("Exiting Program")},5000)
		await browser.close();
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
		return result;
    }
    finally{
        await exit(browser,page); 
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
		sleep(2000);
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
	sleep(2000);
	try{
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);});
		let table_position = innerTextArray.indexOf(returning);
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await iframe.waitForNavigation({ waitUntil: ['load'] });
		sleep(2000);
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
		sleep(2000);
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
	sleep(2000);
	try{
		let frames = await page.frames();
		let iframe = frames.find(f => f.name() === 'menu'); // name or id for the frame
		let innerTextArray = await iframe.$$eval('tr td a font b', elements => {
			return elements.map(element => element.innerText);});
		let table_position = innerTextArray.indexOf(returning);
		await getTextInIframe(table_position, iframe, 'tr td a font b');
		await iframe.waitForNavigation({ waitUntil: ['load'] });
		sleep(2000);
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
		sleep(2000);
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
	  	sleep(2000);
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
	  sleep(4000);}
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
async function exit(browser,page){
	  // logging out 
	  let frames = await page.frames();
	  iframe = frames.find(f => f.name() === 'menu'); 
	  innerTextArray = await iframe.$$eval('tr td a font b', elements => {
		return elements.map(element => element.innerText);
	  });
	  table_position = innerTextArray.indexOf(logout);
	  await getTextInIframe(table_position, iframe, 'tr td a font b');
	  await page.waitForNavigation({delay: 10000});
	  await setTimeout(()=>{console.log("Exiting Program")},5000)
	  await browser.close();
	  
 
	  // for relogging, directly hit https://ibank.klikbca.com/authentication.do
};

module.exports = {
	test: test
  };

//test([1,1,1])