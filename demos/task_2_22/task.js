var config = {
  timer: 500
};

// 动画队列函数
function delay(fn, t) {
  var schQueue = [];
  var currentTask = null;

  function exeTask(options) {
    currentTask = setTimeout(function(){
      options.fn();
      clearTimeout(currentTask);
      currentTask = null;
      if (schQueue.length) {
        exeTask(schQueue.shift());
      }
    }, options.t);
  }

  self = {
    delay : function(fn, t) {
      if (currentTask || schQueue.length) {
        schQueue.push({fn: fn, t: t});
      } else {
        exeTask({fn: fn, t: t});
      }
      return self;
    }
  };

  return self.delay(fn, t);
}

var aniQueue = delay(function(){}, 0).delay;

function Node(data) {
  this.data = data;
  this.left = null;
  this.right = null;
}

Node.prototype.show = function() {

  var e = document.getElementById("e" + this.data);
  (function(e){
    aniQueue(function(){
      e.setAttribute("class", "fire");
    }, 0);
    aniQueue(function(){
      e.removeAttribute("class");
    }, config.timer);
  })(e);
  return this.data;
};

function BST() {
  this.root = null;
}

BST.prototype.insert = function(data) {
  var n = new Node(data);
  var current = this.root;
  var parent = null;
  if (current === null) {
    this.root = n;
  } else {
    while(true) {
      parent = current;
      if (data 