const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Open Scrapingbee's website
  await page.goto('https://scrapingbee.com');

  // Get the first h1 element using page.$x
  let first_h1_element = await page.$x('//*[@id="content"]/div/section[1]/div/div/div[1]/div/div/span');

  // Get all p elements using page.$x
  let all_p_elements = await page.$x("//p");

  // Get the textContent of the h1 element
  let h1_value = await page.evaluate(el => el.textContent, first_h1_element[0]);
  // The total number of p elements on the page
  const listHandle = await page.evaluateHandle(() => document.body.children);
  const properties = await listHandle.getProperties();
  const children = [];
  for (const property of properties.values()) {
    const element = property.asElement();
    if (element) {
      children.push(element);
    }
  }
  children; // holds elementHandles to all children of document.body
  console.log(await children[1].isVisible);
  console.log(h1_value);

 //console.log(p_total);

  // Close browser.
  await browser.close();
})();