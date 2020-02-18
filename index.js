const fs = require("fs"); // 'fs' -> stands for file system
const http = require("http");
const url = require("url");

const slugigy = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

//////////////////*************** FILES ***************************///////////////////////////////

/* Synchronous Or Blocking way of file writing and reading  */

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // The first argument is the path of the file that we read in and the second argument is a form of the information
// console.log(textIn);

// const textOut = `This is what we know about the avocado:${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut); //The first argument is the path and file we write in and the second one is the info we write in
// console.log(textOut);

/* Asynchronous Or Non-Blocking way of file writing and reading  */
//An example of callbacks(calbackHell) but can be done in better way with Promises and asyn /await

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   //arguments: 1) path of the file we write or read 2)format 3)function to execute asynchronously
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });
// console.log("Asynchronous way!");

//////////////////*************** SERVER ***************************///////////////////////////////

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // const pathName = req.url;
  const {query, pathname} = url.parse(req.url, true);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {"Content-type": "text/html"});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    res.writeHead(200, {"Content-type": "text/html"});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // res.end("Products page!");
  }

  //API
  else if (pathname === "/api") {
    res.writeHead(200, {"Content-type": "application/json"});
    res.end(data);
  }

  //Error Case. Not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html"
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
