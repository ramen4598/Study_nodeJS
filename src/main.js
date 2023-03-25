const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

const template = require("./lib/template.js");
const dataDir = "/app/src/data";
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});
db.connect();

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  /**디렉터리 안에 파일의 이름을 읽고  html response함.
   * path, title, decscription, control
   */
  function readAndRes(path, title, description, control) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      if (error) {
        throw error;
      }
      let list = template.List(topics);
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
        <input type="button" value="create" onclick="redirect(this, '')"/>
      `;
      readAndRes(dataDir, title, description, control);
    } else {
      db.query(
        `SELECT * FROM topic WHERE id=?`,
        [queryData.id],
        function (error, topic) {
          if (error) {
            throw error;
          }
          const title = topic[0].title;
          const description = topic[0].description;
          const id = queryData.id;
          let control = `
          <input type="button" value="create" onclick="redirect(this, '${id}')"/>
          <input type="button" value="update" onclick="redirect(this, '${id}')"/>
          <form id="frm" action="delete_process" method="post" style="display:inline">
            <input type="hidden" name="id" value="${id}">
            <input type="button" value="delete" 
            onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
          </form>
        `;
          readAndRes(dataDir, title, description, control);
        }
      );
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
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDesc = sanitizeHtml(description);
      db.query(
        `INSERT INTO topic (title, description, created, author_id) 
        VALUES (?, ?, NOW(), ?)`,
        [sanitizedTitle, sanitizedDesc, 1],
        function (error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {
            Location: encodeURI(`/?id=${result.insertId}`),
          });
          response.end();
        }
      );
    });
  } else if (pathname === "/update") {
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      function (error, topic) {
        if (error) {
          throw error;
        }
        const title = topic[0].title;
        const description = topic[0].description;
        const id = queryData.id;
        let control = ``;
        const updateForm = `
          <form action="/update_process" method="post">
              <p>
              <input type="hidden" name="id" value="${id}">
              <input type="text" name="title" placeholder="title" value="${title}"> </p>
              <p>
                   <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                   <input type="submit">
              </p>
          </form>
        `;
        readAndRes(dataDir, title, updateForm, control);
      }
    );
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
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDesc = sanitizeHtml(description);
      db.query(
        `UPDATE topic 
          SET title=?, description=?, author_id=1
          WHERE id=?`,
        [sanitizedTitle, sanitizedDesc, id],
        function (error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {
            Location: encodeURI(`/?id=${id}`),
          });
          response.end();
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
      db.query(`DELETE FROM topic WHERE id=?`,[id],function (error) {
        if (error){
          throw error;
        }
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