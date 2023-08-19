const express = require('express');
const db = require('./db.js');

async function getTopics(){
    const promiseDB = db.promise();
    const [topics, fields] = await promiseDB.query(`SELECT * FROM topic`);
    return topics;
}

function getList(topics){
  let list = "<ul>";
  topics.forEach(topic => {
    list += `<li><a href="/topic/${topic.id}">${topic.title}</a></li>`;
  });
  list += "</ul>";
  return list;
}

/**
 * @make req.list
 */
module.exports.List = async(req,res,next)=>{
  try {
    const topics = await getTopics();
    const list = getList(topics);
    req.list = list;
    next();
  } catch (err) {
    return next(err);
  }
}

async function getAuthors(){
  const promiseDB = db.promise();
  const [authors, fields] = await promiseDB.query(`SELECT * FROM author`);
  return authors;
}

function getTag(authors, author_id){
  let tag = '';
  authors.forEach(author => {
    let selected ='';
    if (author.id === author_id){
      selected = 'selected';
    }
    tag += `<option value="${author.id}" ${selected}>${author.name}</option>`;
  });
  return tag;
}
 
/**
* @needs req.author_id
* @make req.authorSelect
*/
module.exports.authorSelect = async function(req,res,next){
  try{
    const authors = await getAuthors();
    const tag = getTag(authors, req.author_id);
    req.authorSelect = `<select name="author">${tag}</select>`;
    next();
  }catch(err){
    return next(err);
  }
}

/**
 * @need req.title, req.desc, req.control, req.list, req.author
 * @send html 
 */
module.exports.HTML = (req,res,next)=>{
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>WEB - ${req.title}</title>
        <link rel="stylesheet" href="/static/css/style.css">
        <script src="/static/js/crudBtn.js"></script>
        <script src="/static/js/darkMode.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", ()=>{
            nightDayHandler();
          });
        </script>
      </head>
      <body>
        <div id="top">
          <h1><a href="/">Board</a></h1>
          <input id="nightDayBtn" type="button" value="night" onclick="changeDarkMode()"/> 
          <a href="/auth/login">login</a>
        </div>
        <div id="grid">
        ${req.list}
        <div id="article">
          <div id="control">${req.control}</div>
          <h2>${req.title}</h2>
          <p>
            ${req.author}
          </p>
          <p>
            ${req.desc}
          </p>
        </div>
      </div>
      </body>
    </html>
  `;

  res.status(200).send(html);
}