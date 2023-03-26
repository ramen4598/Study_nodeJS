const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const sanitizeHtml = require("sanitize-html");
const template = require("./lib/template.js");
const db = require('./lib/db.js');

/** new Ready(title, des, control, author)   
* 속성 title, description, contol, author, html
* method : makeHtml, response
*/
class Ready{
  constructor(title, des, control, author){
    this.title = title;
    this.decscription = des;
    this.control = control;
    this.author = author;
    this.html = '';
  }
  makeHtml() {
    this.html = template.HTML(this);
  }
  response(response){
    response.writeHead(200);
    response.end(this.html);
  }
}

console.log('pass Ready');

const app = http.createServer(function (request, response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  console.log('pass import');


  if (pathname === "/") {
    if (queryData.id === undefined) {
      const title = "Welcome :)";
      const description = "Here is for to test node.js server :)";
      const control = `
        <input type="button" value="create" onclick="redirect(this, '')"/>
      `;
      const author = '';
      const undefinedCase = new Ready(title, description, control, author);
      undefinedCase.makeHtml;
      undefinedCase.response(response);
      console.log('pass undefinedCase');
    } else {
      db.query(
        `SELECT * FROM topic LEFT JOIN author ON topic.author_id= author.id WHERE topic.id=?`,
        [queryData.id],
        function (error, topic) {
          if (error) {
            throw error;
          }
          const title = topic[0].title;
          const description = topic[0].description;
          const control = `
          <input type="button" value="create" onclick="redirect(this, '')"/>
          <input type="button" value="update" onclick="redirect(this, '${queryData.id}')"/>
          <form id="frm" action="delete_process" method="post" style="display:inline">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="button" value="delete" 
            onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
          </form>
        `;
          const author = `작성자 : ${topic[0].name}`;
          const definedCase = new Ready(title, description, control, author);
          definedCase.makeHtml;
          definedCase.response(reponse);
        }
      );
    }
  } else if (pathname === "/create") {
    let title = "create";
    let description = `
        <form action="/create_process" method="post">
            <p>${template.authorSelect('')}</p>
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
      `;
    let control = '';
    let author  = '';
    const createCase = new Ready(title, description, control, author);
    createCase.makeHtml;
    createCase.response(reponse);
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
        [sanitizedTitle, sanitizedDesc, post.author],
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
    db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function (error, topic) {
      if (error) {
        throw error;
      }
      const id = queryData.id;
      const title = topic[0].title;
      const description = `
        <form action="/update_process" method="post">
            <p>${template.authorSelect(topic[0].author_id)}</p>
            <p>
            <input type="hidden" name="id" value="${id}">
            <input type="text" name="title" placeholder="title" value="${title}"> </p>
            <p>
                 <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
                 <input type="submit">
            </p>
        </form>
      `;
      let control = ``;
      const author = ``;
      const updateCase = new Ready(title, description, control, author);
      updateCase.makeHtml;
      updateCase.response(response);
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
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDesc = sanitizeHtml(description);
      db.query(
        `UPDATE topic 
          SET title=?, description=?, author_id=?
          WHERE id=?`,
        [sanitizedTitle, sanitizedDesc, post.author, id],
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