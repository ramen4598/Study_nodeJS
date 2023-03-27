const db = require('./db.js');

module.exports = {
  HTML: async function (Ready) {
    const list = await this.List();
    console.log(list);
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
  List: async function () {
    try {
      const promiseDB = db.promise();
      const [topics, fields] = await promiseDB.query(`SELECT * FROM topic`);
      let list = "<ul>";
      topics.forEach(topic => {
        list += `<li><a href="/?id=${topic.id}">${topic.title}</a></li>`;
      });
      list += "</ul>";
      return list;
    } catch (error) {
      throw error;
    }
  },authorSelect:function(author_id){
    db.query(`SELECT * FROM author`,function(error, authors){
      if(error) throw error;
      let tag = '';
      authors.forEach(author => {
        let selected ='';
        if (author.id === author_id){
          selected = 'selected';
        }
        tag += `<option value="${author.id}" ${selected}>${author.name}</option>`;
      });
      return `
        <select name="author">
          ${tag}
        </select>
      `
    });
  }
};