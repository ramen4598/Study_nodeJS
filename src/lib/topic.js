const url = require("url");
const qs = require("querystring");
const sanitizeHtml = require("sanitize-html");
const template = require("./template.js");
const db = require('./db.js');

/** new Ready(title, des, control, author)   
* 속성 title, description, contol, author, html
* method : makeHtml, response
*/
class Ready{
  constructor(title, des, control, author){
    this.title = title;
    this.description = des;
    this.control = control;
    this.author = author;
    this.html = '';
  }
  async makeHtml() {
    this.html = await template.HTML(this);
  }
  response(response){
    response.status(200).send(this.html);
  }
}

exports.home = function (request,response) {
    const title = "Welcome :)";
    const description = "Here is for to test node.js server :)";
    const control = `
      <input type="button" value="create" onclick="redirect(this, '')"/>
    `;
    const author = '';
    const undefinedCase = new Ready(title, description, control, author);
    undefinedCase.makeHtml()
    .then(()=>{undefinedCase.response(response)});
}

exports.page = function (request, response) {
  const pageId = request.params.pageId;
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id= author.id WHERE topic.id=?`,
      [pageId],
      function (error, topic) {
        if (error) {
          throw error;
        }
        const title = topic[0].title;
        const description = topic[0].description;
        const control = `
        <input type="button" value="create" onclick="redirect(this, '')"/>
        <input type="button" value="update" onclick="redirect(this, '${pageId}')"/>
        <form id="frm" action="delete_process" method="post" style="display:inline">
          <input type="hidden" name="id" value="${pageId}">
          <input type="button" value="delete" 
          onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
        </form>
      `;
        const author = `${topic[0].name} 작성`;
        const definedCase = new Ready(title, description, control, author);
        definedCase.makeHtml()
        .then(()=>{definedCase.response(response)});
      }
    );
}

exports.create = async function (request, response) {
    let title = "create";
    let authorSelect = await template.authorSelect('');
    let description = `
        <form action="/create_process" method="post">
            <p>${authorSelect}</p>
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
    createCase.makeHtml()
    .then(()=>{createCase.response(response)});
}

exports.create_process = function (request, response) {
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
          response.redirect(`/page/${result.insertId}`);
          response.end();
        }
      );
    });
}

exports.update = async function (request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    try{
        const promiseDB = db.promise();
        const [topic, fields] = await promiseDB.query(`SELECT * FROM topic WHERE id=?`,[queryData.id]);
        const authorSelect = await template.authorSelect(topic[0].author_id);
        const id = queryData.id;
        const title = topic[0].title;
        const description = `
          <form action="/update_process" method="post">
              <p>${authorSelect}</p>
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
        updateCase.makeHtml()
        .then(()=>{updateCase.response(response)});
    }catch(error){
        throw error;
    }
}

exports.update_process = function (request, response) {
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
}

exports.delete_process = function (request, response) {
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
}
