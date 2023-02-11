const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require('querystring');

function templateHTML(title, list, description){
  return `
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>WEB - ${title}</title>
       <link rel="stylesheet" href="style.css">
       <script src="color.js"></script>
     </head>
     <body>
       <div id="top">
         <h1><a href="/">차</a></h1>
         <input type="button" value="night" onclick="nightDayHandler(this)"/>
       </div>
       <div id="grid">
        ${list}
        <div id="article">
          <a href="/create">create</a>
          <h2>${title}</h2>
          ${description}
        </div>
      </div>
     </body>
    </html>
  `;
}

function templateList(filelist){
  let list = '<ul>';
  for (let i=0; i<filelist.length; i++){
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }
  list += '</ul>';
  return list;
}

const app = http.createServer(function (request, response) {
  const _url = request.url;
  // console.log(_url);
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir('./data', function(err, filelist){
        let title = "Welcome";
        let description = "Hello Node.js";
        let list = templateList(filelist);
        template = templateHTML(title, list, description);
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function(err, filelist){
        fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
          let title = queryData.id;
          let list = templateList(filelist);
          template = templateHTML(title, list, description);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === '/create'){
    fs.readdir('./data', function(err, filelist){
      let title = "create";
      let description = `
        <form action="http://localhost:3000/create_process" method="post">
	        <p><input type="text" name="title" placeholder="title"></p>
	        <p>
	        	<textarea name="description" placeholder="description"></textarea>
	        </p>
	        <p>
	        	<input type="submit">
	        </p>
        </form>
      `;
      let list = templateList(filelist);
      template = templateHTML(title, list, description);
      response.writeHead(200);
      response.end(template);
    });
  }else if(pathname === '/create_process'){
   let body = '';
   request.on('data', function(data){ body += data;});
   request.on('end', function(){
    let post = qs.parse(body);
    console.log('url : ' + _url);
    console.log('body : ' + body);
    console.log(post);
   });
  } else {
    if (_url == "/style.css") {
      response.writeHead(200, { "Content-type": "text/css" });
      let fileContents = fs.readFileSync("style.css", "utf-8");
      response.write(fileContents);
      response.end();
    } else if (_url == "/color.js") {
      response.writeHead(200, { "Content-type": "text/js" });
      let fileContents = fs.readFileSync("color.js", "utf-8");
      response.write(fileContents);
      response.end();
    } else {
      response.writeHead(404);
      response.end("Not found");
    }
  }
});
app.listen(3000);
