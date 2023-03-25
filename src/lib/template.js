module.exports = {
  HTML: function (title, list, control, description, author) {
    return `
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>WEB - ${title}</title>
         <link rel="stylesheet" href="style.css">
         <script src="./lib/color.js"></script>
         <script src="./lib/crudBtn.js"></script>
       </head>
       <body>
         <div id="top">
           <h1><a href="/">Board</a></h1>
           <input type="button" value="night" onclick="nightDayHandler(this)"/> </div>
         <div id="grid">
          ${list}
          <div id="article">
            <div id="control">${control}</div>
            <h2>${title}</h2>
            <p>
              ${author}
            </p>
            <p>
              ${description}
            </p>
          </div>
        </div>
       </body>
      </html>
    `;
  },
  List: function (topics) {
    let list = "<ul>";
    for (let i = 0; i < topics.length; i++) {
      list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
    }
    list += "</ul>";
    return list;
  },authorSelect:function(authors, author_id){
    let tag = '';
    let i = 0;
    while(i < authors.length){
      let selected ='';
      if (authors[i].id === author_id){
        selected = 'selected';
      }
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  }
};