module.exports = {
  apps : [{
    name   : "main",
    script : "/app/src/main.js",
	watch : ["/app/src/*"],
	watch : ["/app/src/lib/*"],
	ignore_watch : ["/app/src/data/*"]
  }]
}
