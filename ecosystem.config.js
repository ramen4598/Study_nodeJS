module.exports = {
  apps : [{
    name   : "main",
    script : "/app/src/main.js",
	watch : ["/app/src/*"],
	ignore_watch : ["/app/src/data/*"]
  }]
}
