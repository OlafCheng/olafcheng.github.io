function TaskQueue() {
  this._queue = [];
  this._currentTask = null;
}
TaskQueue.prototype._next = function(){
  if(!this._currentTask) {// 如果当前没有任务在执行
    var obj = this._queue.shift();
    this._currentTask = setTimeout((function(argu) {
      console.log(argu);
      argu.fn.apply(argu.context === undefined ? null : argu.context, argu.para);
      clearTimeout(this._currentTask);
      this._currentTask = null;
      this._next();
    })(obj), obj.delay === undefined ? 0 : obj.delay);
  }
};
TaskQueue.prototype._add = function(obj) {
  this._queue.push(obj);
  this._next();
};

function Lazyman() {
  TaskQueue.call(this);
}

Lazyman.prototype = new TaskQueue();

Lazyman.prototype.a = function(obj) {
  this._add(obj);
  return this;
};
Lazyman.prototype.say = function(what) {
  this._add({fn: function(){}, para: what});
  return this;
};
Lazyman.prototype.sleep = function(time) {
  this._add({fn: function(){}, delay: time * 1000});
  return this;
};

A = new Lazyman();