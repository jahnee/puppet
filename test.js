const puppeteer = require('puppeteer');
const http = require('http');

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

(async () => {
  try {
    let result = await getWebSocket();
    result = JSON.parse(result)
    webSocketDebuggerUrl = result.webSocketDebuggerUrl
    const browser = await puppeteer.connect({
      defaultViewport: {
        width: 1400,
        height: 800
      },
      browserWSEndpoint: webSocketDebuggerUrl ,
  });
  //const page = await browser.newPage();
  const pages = await browser.pages();
    const pageWithSpecificURL = pages.find(page => page.url() === "https://teams.microsoft.com/v2/");
    const pageURLs = await Promise.all(pages.map(async (page) => await page.url()));
    console.log(pageURLs);

    await pageWithSpecificURL.waitForSelector("div[data-tid='app-layout-area--nav']");
    
    // Select the parent div
    let parentDiv = await pageWithSpecificURL.$("div[data-tid='app-layout-area--nav']");
    
    // Find the element with the role 'navigation' within the parent div
    let navigationElement = await parentDiv.$("div[role='navigation']");
    
    // Now you can interact with the navigation element as needed
    let menuNameString = await navigationElement.$$eval("div div button span div span", (elements) => {
        return elements.map(element => element.innerText);
    });
    console.log(menuNameString);
    
    let pos = menuNameString.indexOf("Teams");
    let button = await navigationElement.$(`div:nth-child(${pos}) div button`);
    console.log("Debug-break");
    
    await button.click();
    console.log("Debug-break");
} catch (error) {
    console.error('Error:', error.message);
  }
})();

async function getTextInIframe(tablePosition, iframe, selector ) {
  return iframe.evaluate((position,select) => {
      document.querySelectorAll(select)[position].click();
  }, tablePosition,selector);
}

async function getSpecific( iframe, selector ) {
  return iframe.evaluate((select) => {
      document.querySelector(select).click();
  },selector);
}
