const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

const template = require("./lib/template.js");
const dataDir = "/app/src/data";

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  /**디렉터리 안에 파일의 이름을 읽고  html response함.
   * path, title, decscription, control
   */
  function readAndRes(path, title, description, control) {
    fs.readdir(path, function (err, filelist) {
      const noData = `ENOENT: no such file or directory, scandir '/app/src/data'`;
      if (err && err.message === noData) {
        fs.mkdirSync(path, { recursive: true });
        filelist = [""];
      }
      let list = template.List(filelist);
      let html = template.HTML(title, list, control, description);
      response.writeHead(200);
      response.end(html);
    });
  }

  if (pathname === "/") {
    if (queryData.id === undefined) {
      let title = "Welcome :)";
      let description = "Here is for to test node.js server :)";
      let control = `
        <input type="button" value="create" onclick="redirect(this, '${title}')"/>
      `;
      readAndRes(dataDir, title, description, control);
    } else {
      const filteredTitle = path.parse(queryData.id).base;
      const description = fs.readFileSync(
        `${dataDir}/${filteredTitle}`,
        "utf-8"
      );
      let control = `
        <input type="button" value="create" onclick="redirect(this, '${filteredTitle}')"/>
        <input type="button" value="update" onclick="redirect(this, '${filteredTitle}')"/>
        <form id="frm" action="delete_process" method="post" style="display:inline">
          <input type="hidden" name="id" value="${filteredTitle}">
          <input type="button" value="delete" 
          onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
        </form>
      `;
      readAndRes(dataDir, filteredTitle, description, control);
    }
  } else if (pathname === "/create") {
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
    let control = ``;
    readAndRes(dataDir, title, description, control);
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      let filteredTitle = path.parse(title).base;
      let sanitizedTitle = sanitizeHtml(filteredTitle);
      let sanitizedDesc = sanitizeHtml(description);
      fs.writeFile(
        `${dataDir}/${sanitizedTitle}`,
        sanitizedDesc,
        "utf8",
        function (err) {
          response.writeHead(302, {
            Location: encodeURI(`/?id=${sanitizedTitle}`),
          });
          response.end();
        }
      );
    });
  } else if (pathname === "/update") {
    const filteredTitle = path.parse(queryData.id).base;
    const description = fs.readFileSync(`${dataDir}/${filteredTitle}`, "utf8");
    const updateForm = `
      <form action="/update_process" method="post">
          <p>
          <input type="hidden" name="id" value="${filteredTitle}">
          <input type="text" name="title" placeholder="title" value="${filteredTitle}"> </p>
          <p>
               <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
               <input type="submit">
          </p>
      </form>
    `;
    let control = ``;
    readAndRes(dataDir, filteredTitle, updateForm, control);
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
      let filteredId = path.parse(id).base;
      let filteredTitle = path.parse(title).base;
      let sanitizedId = sanitizeHtml(filteredId);
      let sanitizedTitle = sanitizeHtml(filteredTitle);
      let sanitizedDesc = sanitizeHtml(description);
      fs.rename(
        `${dataDir}/${sanitizedId}`,
        `./data/${sanitizedTitle}`,
        function (err) {
          fs.writeFile(
            `${dataDir}/${sanitizedTitle}`,
            sanitizedDesc,
            "utf8",
            function (err) {
              response.writeHead(302, {
                Location: encodeURI(`/?id=${sanitizedTitle}`),
              });
              response.end();
            }
          );
        }
      );
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body += data;
    });
    request.on("end", function () {
      let post = qs.parse(body);
      let id = post.id;
      let filteredId = path.parse(id).base;
      fs.unlink(`${dataDir}/${filteredId}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    function resFile(path) {
      let fileContents = fs.readFileSync(path, "utf-8");
      response.write(fileContents);
      response.end();
    }
    if (_url == "/style.css") {
      response.writeHead(200, { "Content-type": "text/css" });
      const path = "/app/src/style.css";
      resFile(path);
    } else if (_url == "/lib/color.js") {
      response.writeHead(200, { "Content-type": "text/js" });
      const path = "/app/src/lib/color.js";
      resFile(path);
    } else if (_url == "/lib/crudBtn.js") {
      response.writeHead(200, { "Content-type": "text/js" });
      const path = "/app/src/lib/crudBtn.js";
      resFile(path);
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
  }
});
app.listen(3000);
