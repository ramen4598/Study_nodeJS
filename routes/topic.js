const express = require('express');
const router = express.Router();
const sanitizeHtml = require("sanitize-html");
const template = require("../lib/template.js");
const db = require('../lib/db.js');
const auth = require('../lib/auth');

router.route('/create')
  .get((req,res,next)=>{
    req.author_id = ''; 
    next();
  },auth.statusUI,template.List,template.authorSelect,(req,res,next)=>{
    req.title = "create";
    req.desc = `
      <form action="/topic/create" method="post">
          <p>${req.authorSelect}</p>
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit">
          </p>
      </form>
    `;
    req.control = '';
    req.author  = '';
    next();
  },template.HTML)
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
      function (err, result) {
        if (err) {
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
    req.author_id = topic[0].author_id;
    next();
  }catch(err){
    return next(err);
  }
},auth.statusUI,template.List,template.authorSelect,(req,res,next)=>{
  const topic = req.topic;
  req.title = topic[0].title;
  req.desc = `
    <form action="/topic/update" method="post">
        <p>${req.authorSelect}</p>
        <p>
        <input type="hidden" name="id" value="${req.params.pageId}">
        <input type="text" name="title" placeholder="title" value="${topic[0].title}"> </p>
        <p>
              <textarea name="description" placeholder="description">${topic[0].description}</textarea>
        </p>
        <p>
              <input type="submit">
        </p>
    </form>
  `;
  req.control = ``;
  req.author = ``;
  next();
},template.HTML);

router.post('/update',(req,res,next)=>{
  let post = req.body;
  let sanitizedTitle = sanitizeHtml(post.title);
  let sanitizedDesc = sanitizeHtml(post.description);
  db.query(
    `UPDATE topic 
      SET title=?, description=?, author_id=?
      WHERE id=?`,
    [sanitizedTitle, sanitizedDesc, post.author, post.id],
    function (err, result) {
      if (err) {
        return next(err);
      }
      res.redirect(`/topic/${post.id}`);
    }
  );
});

router.post('/delete', (req,res,next)=>{
  let post = req.body;
  db.query(`DELETE FROM topic WHERE id=?`,[post.id],function (err) {
    if (err){
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/:pageId', (req, res, next)=>{
  db.query(
    `SELECT * FROM topic LEFT JOIN author ON topic.author_id= author.id WHERE topic.id=?`,
    [req.params.pageId],
    function (err, topic) {
      if (err) {
        return next(err);
      }
      req.topic = topic;
      next();
    }
  );
},auth.statusUI,template.List,(req,res,next)=>{
    const pageId = req.params.pageId;
    const topic = req.topic;
    req.title = topic[0].title;
    req.desc = topic[0].description;
    req.control = `
    <input type="button" value="create" onclick="redirect(this, '')"/>
    <input type="button" value="update" onclick="redirect(this, '${pageId}')"/>
    <form id="frm" action="/topic/delete" method="post" style="display:inline">
      <input type="hidden" name="id" value="${pageId}">
      <input type="button" value="delete" 
      onclick="if(confirm('really delete?')==true){document.getElementById('frm').submit();}">
    </form>
    `;
    req.author = `${topic[0].name} 작성`;
    next();
  },template.HTML);

module.exports = router;