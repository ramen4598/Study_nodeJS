module.exports = {
  HTML : function(title, list, control, description) {
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
           <input type="button" value="night" onclick="nightDayHandler(this)"/>
         </div>
         <div id="grid">
          ${list}
          <div id="article">
            <div id="control">${control}</div>
            <h2>${title}</h2>
            ${description}
          </div>
        </div>
       </body>
      </html>
    `;
  },
  List : function(filelist) {
    let list = "<ul>";
    if(Array.isArray(filelist)){
	    for (let i = 0; i < Object.keys(filelist).length; i++) {
	      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
	    }
	    list += "</ul>";
	    return list;
    }else{
      return `filelist isn't array. filelist is ${typeof filelist}.`;
    }
  }
}
