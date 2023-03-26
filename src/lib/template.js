const db = require('./db.js');

module.exports = {
  // HTML: function (title, list, control, description, author) {
  HTML: function (Ready) {
    const list = this.List();
    return `
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>WEB - ${Ready.title}</title>
         <link rel="stylesheet" href="style.css">
         <script src="./lib/color.js"></script>
         <script src="./lib/crudBtn.js"></script>
       </head>
       <body>
         <div id="top">
           <h1><a href="/">Board</a></h1>
           <input type="button" value="night" onclick="nightDayHandler(Ready)"/> </div>
         <div id="grid">
          ${list}
          <div id="article">
            <div id="control">${Ready.control}</div>
            <h2>${Ready.title}</h2>
            <p>
              ${Ready.author}
            </p>
            <p>
              ${Ready.description}
            </p>
          </div>
        </div>
       </body>
      </html>
    `;
  },
  List: function (topics) {
    db.query(`SELECT * FROM topic`,(error, topics)=>{
      let list = "<ul>";
      for (let i = 0; i < topics.length; i++) {
        list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      }
      list += "</ul>";
      return list;
    });
  },authorSelect:function(author_id){
    db.query(`SELECT * FROM author`,function(error, authors){
      if(error) throw error;
      let tag = '';
      authors.forEach(author => {
        let selected ='';
        if (author.id === author_id){
          selected = 'selected';
        }
        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      });
      return `
        <select name="author">
          ${tag}
        </select>
      `
    });
  }
};