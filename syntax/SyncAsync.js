const fs = require('fs');
 
//synchronous
console.log('Syncronous');
console.log('A');
var result = fs.readFileSync('./sample.txt', 'utf8');
console.log(result);
console.log('C');
 
//asynchronous
console.log('Asynchronous');
console.log('A');
fs.readFile('./sample.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');