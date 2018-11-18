class Send {
  constructor () {
    this.subs = {}
  }

  bind (name, event) {
    // 根据要求, 这里实现为一个属性只能绑定一个函数
    // 所以直接进行赋值就可以了
    this.subs[name] = event;
  }

  fire (name, para, context = null) {
    this.subs[name] && this.subs[name].apply(context, para);
  }

  disPatch (name) {
    // 暂时不提供根据函数名来 disPatch 事件的方法
    // 以后再加进来
    this.subs[name] = null;
  }
}

class Observer {
  constructor (data) {
    this.data = data;
    this.subs = new Send();
    this.bind(data);
  }

  bind (data) {
    const _this = this;

    // 这次要满足的是, data 中的元素, 仍然有对象的情况
    // 所以要对传进来的对象的类型进行判断
    Object.keys(data).forEach(key => {
      if (Object.prototype.toString.call(data[key]) !== '[object Object]') {
        _this.bindObj(data, key)
      } else {
        _this.bind(data[key]);
      }
    });

    return data;
  }

  bindObj (obj, key) {
    // 通过闭包保存单独的数据
    this.subs.bind(key, (val, newVal) => {
      if (val === newVal) {
        console.log('你设置了' + key + ', 但是值没有更新。');
      } else {
        console.log('你设置了' + key + ', 新的值为 ' + newVal + '.');
      }
    });

    let oldVal = obj[key];
    const _this = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      set: para => {
        if (Object.prototype.toString.call(para) === '[object Object]' && !para.hasBeenSettled) {
          para.hasBeenSettled = true;
          Object.keys(para).forEach(innerKey => {
            _this.data[key] = _this.bind(para);
          });
        } else {
          _this.subs.fire(
            key,
            [oldVal, para],
            _this
          );
          oldVal = para;
        }
      },
      get: () => {
        // 这里不区分属性, 直接返回与键值相关的信息
        _this.subs.fire(
          key,
          {key: key, data: obj},
          _this);
      }
    })

    return obj;
  }

  $watch (key, func) {
    this.subs.disPatch(key);
    this.subs.bind(key, func);
  }
}


// 1. 循环绑定
// 2. 每个对象都要有独立监听者, 避免同名属性
// 3.