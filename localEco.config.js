module.exports = {
  apps : [{
    name   : "app",
    script : "./app.js",
	watch : ["./app.js","./lib/","./public/", "./routes/"]
  }]
}
