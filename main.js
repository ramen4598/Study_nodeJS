var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  console.log(_url);
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      var title = "Welcome";
      var description = "Hello Node.js";
      fs.readdir('./data', function(err, filelist){
        let list = '<ul>';
	      let i = 0; 
        while(i < filelist.length){
	      	list += `<li>${filelist[i]}</li>`;
	      	i++;
	      }
	      list += '</ul>';
        var template = `
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
                <div id="article">${description}</div>
              </div>
            </body>
          </html>
        `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function(err, filelist){
        let list = '<ul>';
	      let i = 0; 
	      while(i < filelist.length){
	      	list += `<li>${filelist[i]}</li>`;
	      	i++;
	      }
	      list += '</ul>';
        fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
         var title = queryData.id;
          var template = `
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
                     <div id="article">${description}</div>
                   </div>
                 </body>
               </html>
             `;
         response.writeHead(200);
         response.end(template);
        });
      });
    }
  } else {
    if (_url == "/style.css") {
      response.writeHead(200, { "Content-type": "text/css" });
      var fileContents = fs.readFileSync("style.css", "utf-8");
      response.write(fileContents);
      response.end();
      // console.log("css 전송완료");
    } else if (_url == "/color.js") {
      response.writeHead(200, { "Content-type": "text/js" });
      var fileContents = fs.readFileSync("color.js", "utf-8");
      response.write(fileContents);
      response.end();
      // console.log("js 전송완료");
    } else {
      response.writeHead(404);
      response.end("Not found");
      // console.log("Not Found");
    }
  }
});
app.listen(3000);
