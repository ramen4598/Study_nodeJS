module.exports = {
  apps : [{
    name   : "main",
    script : "./src/main.js",
	watch : ["./src/*"],
	watch : ["./src/lib/*"],
	ignore_watch : ["./src/data/*"]
  }]
}
