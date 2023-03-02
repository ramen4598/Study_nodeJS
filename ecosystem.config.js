module.exports = {
  apps : [{
    name   : "main",
    script : "/src/main.js",
	watch : ["/src/*"],
	ignore_watch : ["/src/data/*"]
  }]
}
