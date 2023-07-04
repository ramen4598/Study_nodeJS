const express = require('express');
const router = express.Router();
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");
const db = require('../lib/db.js');

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
  response(res){
    res.status(200).send(this.html);
  }
}

router.route('/create')
  .get( async(req,res,next)=>{
    req.author = await template.authorSelect('');
    next();
  },(req,res,next)=>{
    let authorSelect = req.author;
    let title = "create";
    let description = `
        <form action="/topic/create" method="post">
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
    .then(()=>{createCase.response(res)});
  })
  .post((req,res,next)=>{
    let post = req.body;
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
          return next(err);
        }
        res.redirect(`/topic/${result.insertId}`);
      }
    );
  });

router.get('/update/:pageId', async(req,res,next)=>{
  const pageId = req.params.pageId;
  try{
    const promiseDB = db.promise();
    const [topic, fields] = await promiseDB.query(`SELECT * FROM topic WHERE id=?`,[pageId]);
    req.topic = topic;
    req.author = await template.authorSelect(topic[0].author_id);
    next();
  }catch(error){
    return next(err);
  }
},(req,res,next)=>{
  const pageId = req.params.pageId;
  const topic = req.topic;
  const authorSelect = req.author;
  const id = pageId;
  const title = topic[0].title;
  const description = `
    <form action="/topic/update" method="post">
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
  .then(()=>{updateCase.response(res)});
});

router.post('/update',(req,res,next)=>{
  let post = req.body;
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
        return next(err);
      }
      res.redirect(`/topic/${id}`);
    }
  );
});

router.post('/delete', (req,res,next)=>{
  let post = req.body;
  let id = post.id;
  db.query(`DELETE FROM topic WHERE id=?`,[id],function (error) {
    if (error){
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/:pageId', (req, res, next)=>{
  const pageId = req.params.pageId;
  db.query(
    `SELECT * FROM topic LEFT JOIN author ON topic.author_id= author.id WHERE topic.id=?`,
    [pageId],
    function (error, topic) {
      if (error) {
        return next(err);
      }
      req.topic = topic;
      next();
    }
  );
  },(req, res)=>{
    const pageId = req.params.pageId;
    const topic = req.topic;
    const title = topic[0].title;
    const description = topic[0].description;
    const control = `
    <input type="button" value="create" onclick="redirect(this, '')"/>
    <input type="button" value="update" onclick="redirect(this, '${pageId}')"/>
    <form id="frm" action="/topic/delete" method="post" style="display:inline">
      <input type="hidden" name="id" value="${pageId}">
      <input type="button" value="delete" 
      onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
    </form>
    `;
    const author = `${topic[0].name} 작성`;
    const definedCase = new Ready(title, description, control, author);
    definedCase.makeHtml()
    .then(()=>{definedCase.response(res)});
  }
);

module.exports = router;