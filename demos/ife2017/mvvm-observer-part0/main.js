/**
 * 
 */

class DataStorage {
  constructor (obj) {
    this.data = {};
  }

  addProp (data, key) {
    this.data[key] = data[key];
  }

  getProp (key) {
    return this.data[key];
  }

  setProp (key, val) {
    this.data[key] = val;
  }
}

class Observer {

  constructor (data) {
    this.data = data;
    this.bind(data);
  }

  bind (data) {
    // 这里通过私有属性构成一个内部才能访问的闭包
    let storage = new DataStorage();
    
    Object.keys(data).forEach(key => {
      // 1. 在初始化的时候, 把数据存进对象自己的 DataStorage 实例中
      // 2. 然后通过 setter 和 getter 可以对 DataStorage 进行操作
      storage.addProp(data, key); // 存入数据
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        set: val => {
          if (val === storage.getProp(key)) {
            console.log('你设置了 ' + key + ', 但是没有对值进行更改。');
          } else {
            storage.setProp(key, val);
            console.log('你设置了 ' + key + ', 新的值为 ' + val);
          }
        },
        get: () => {
          console.log('你访问了 ' + key + ', 值为 ' + storage.getProp(key));
        }
      });
    });
  }
}