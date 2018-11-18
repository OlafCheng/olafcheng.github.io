let readJSON = (name) => {
  return JSON.parse(name);
};

let addOnLoad = (fn) => {
  let oldLoad = null;
  if (typeof window.onload === "function") {
    oldLoad = window.onload;
    window.onload = () => {
      oldLoad();
      fn();
    };
  } else {
    window.onload = fn;
  }
};

console.log(data);
console.log(readJSON(data));


function add() {

  var calculate = function() {
    var arr = [].slice.call(arguments);
    console.log("arguments = " + arr.join(", "));
    var sum = 0;
    switch (arr.length) {
        case 0:
          sum = 0;
          break;
        case 1:
          sum = arr[0];
          break;
        default:
          sum = arr.reduce(function(accumulator, currentValue) {
            return accumulator + currentValue;
          });
    }
    return sum;
  };

  var fun = function() {
    result += calculate(arguments);
    return fun;
  };

  var result = calculate(arguments);
  
  fun.toString = fun.valueOf = function() {
    return result;
  };

  return fun;
}