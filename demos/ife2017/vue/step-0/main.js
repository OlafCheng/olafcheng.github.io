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

// 用于对每个类生成实例, 分别存储每个类的数据
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

let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science
