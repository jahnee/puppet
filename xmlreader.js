const fs = require('fs');
const xml2js = require('xml2js');
let parsedResult = {}
let globRes = {}
function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function parseXMLAsync(data) {
    try {
        const result = await xml2js.parseStringPromise(data);
        return result;
    } catch (error) {
        throw new Error("Error parsing XML:", error);
    }
}

async function processFile(filePath,attributeKey,attributeValue) {
    try {
        const data = await readFileAsync(filePath);
        //console.log(data);
        parsedResult = await parseXMLAsync(data);
        //console.log(parsedResult);
        let res = parseXML(parsedResult,false,attributeKey,attributeValue,0);
        return res; // Return parsed result for further use
    } catch (error) {
        console.error(error);
    }
}
function parseXML(XMLJSON, isFound, keyName, keyValue, depth,xmlParent) {
    if (isFound) {
        return XMLParent;
    }
    
    for (const key in XMLJSON) {
        if (Array.isArray(XMLJSON[key])) {
            for (let i = 0; i < XMLJSON[key].length; i++) {
                const result = parseXML(XMLJSON[key][i], isFound, keyName, keyValue, depth + 1,XMLJSON);
                if (result) {
                    return result; 
                }
            }
        } else if (key === '$') {
            if (XMLJSON[key][keyName] === keyValue) {
                console.log(XMLJSON[key][keyName], "Found ");
                console.log("Depth is :", depth);
                isFound = true;
                return xmlParent;
            }
        } else {
            const result = parseXML(XMLJSON[key], isFound, keyName, keyValue, depth + 1,XMLJSON);
            if (result) {
                return result; // Propagate the result up the call stack if found
            }
        }
    }
    return null; // If nothing found, return null
}


// Example usage:
module.exports = {
	processFile: processFile
  };
// Call processFile function
//processFile('output0.xml');