// function a(){
//   console.log('A');
// }

let a = function(){
  console.log('A');
}
 
 
function func(callback){
  callback();
}
 
func(a);
