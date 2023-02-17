const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, filelist) {
        let title = "Welcome :)";
        let description = "Here is for to test node.js server :)";
        let list = template.List(filelist);
        let control = `
          <input type="button" value="create" onclick="redirect(this, '${title}')"/>
        `;
        let html = template.HTML(title, list, control, description);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir("./data", function (err, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          "utf-8",
          function (err, description) {
            let title = queryData.id;
            let list = template.List(filelist);
            let control = `
              <input type="button" value="create" onclick="redirect(this, '${title}')"/>
              <input type="button" value="update" onclick="redirect(this, '${title}')"/>
              <form id="frm" action="delete_process" method="post" style="display:inline">
                <input type="hidden" name="id" value="${title}">
                <input type="button" value="delete" 
                onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
              </form>
            `;
            let html = template.HTML(title, list, control, description);
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      let title = "create";
      let description = `
        <form action="/create_process" method="post">
	        <p><input type="text" name="title" placeholder="title"></p>
	        <p>
	        	<textarea name="description" placeholder="description"></textarea>
	        </p>
	        <p>
	        	<input type="submit">
	        </p>
        </form>
      `;
      let list = template.List(filelist);
      let control = ``;
      let html = template.HTML(title, list, control, description);
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: encodeURI(`/?id=${title}`)});
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readFile(`./data/${queryData.id}`, "utf8", function (err, description) {
      fs.readdir("./data", function (err, filelist) {
        let title = queryData.id;
        let updateForm = `
          <form action="/update_process" method="post">
	          <p>
              <input type="hidden" name="id" value="${title}">
              <input type="text" name="title" placeholder="title" value="${title}">
            </p>
	          <p>
	           	<textarea name="description" placeholder="description">${description}</textarea>
	          </p>
	          <p>
	           	<input type="submit">
	          </p>
          </form>
        `;
        let list = template.List(filelist);
        let control = ``;
        let html = template.HTML(title, list, control, updateForm);
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
      fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: encodeURI(`/?id=${title}`)});
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function (){
      let post = qs.parse(body);
      let id = post.id;
      fs.unlink(`data/${id}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    if (_url == "/style.css") {
      const path = "style.css";
      response.writeHead(200, { "Content-type": "text/css" });
      let fileContents = fs.readFileSync(path, "utf-8");
      response.write(fileContents);
      response.end();
    } else if (_url == "/lib/color.js") {
      const path = "./lib/color.js"
      response.writeHead(200, { "Content-type": "text/js" });
      let fileContents = fs.readFileSync(path, "utf-8");
      response.write(fileContents);
      response.end();
    } else if (_url == "/lib/crudBtn.js") {
      const path = "./lib/crudBtn.js";
      response.writeHead(200, { "Content-type": "text/js" });
      let fileContents = fs.readFileSync(path, "utf-8");
      response.write(fileContents);
      response.end();
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
  }
});
app.listen(3000);
