const string = 'abc'



function reverse(string){
  let newString = '';
  for(var i = 1; i<=string.length;i++){
    newString += string[string.length - i]
  }
  return newString

}

console.log(reverse(string))
