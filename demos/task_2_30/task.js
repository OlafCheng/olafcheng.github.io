// 1. 事件代理
let bindStrategies = (root, strasGroup) => {
  // 消息提示程序
  let showHint = ({ele, msg, cls}) => {
    ele.className = cls;
    let next = ele.nextSibling;
    if (next.tagName && next.tagName.toLowerCase() === "span") {
      next.className = cls;
      next.textContent = msg;
    } else {
      let span = document.createElement("span");
      let text = document.createTextNode(msg);
      span.appendChild(text);
      span.className = cls;
      ele.parentNode.insertBefore(span, next);
    }
  };

  // 先不考虑那么多情况, 只假设有复数个 input 和单个 button
  let inputs = root.querySelectorAll("input");
  let button = root.querySelector("button");
  let value, type, msg, result;

  root.addEventListener("focusin", (e) => {
    type = e.target.dataset && e.target.dataset.type;
    if (type && strasGroup[type]) {
      showHint({
        ele: e.target,
        msg: strasGroup[type].focus,
        cls: "focus"
      });
    }
  });

  root.addEventListener("focusout", (e) => {
    value = e.target.value;
    type = e.target.dataset && e.target.dataset.type;
    if (type && strasGroup[type]) {
      result = strasGroup[type].check(value);
      showHint({
        ele: e.target,
        msg: result ? strasGroup[type].right : strasGroup[type].wrong,
        cls: result ? "checkRight" : "checkWrong"
      });
    }
  });

  button.addEventListener("click", (e) => {
    let checkAll = true;
    let tmpPsw, tmpType, tmpValue, ifPswSame, alertMsg;
    [].forEach.call(inputs, (currentValue, index, array) => {
      console.log("!");
      tmpType = currentValue.dataset.type;
      tmpValue = currentValue.value;
      if (tmpType === "password") {
        if (tmpPsw) {
          ifPswSame = tmpPsw === tmpValue ? true : false;
        } else {
          tmpPsw = tmpValue;
        }
      }
      checkAll &= strasGroup[tmpType].check(tmpValue);
    });

    if (checkAll && ifPswSame) {
      alertMsg = "所有验证均已通过。";
    } else if (checkAll && !ifPswSame) {
      // 单项检验通过, 两次密码不一致
      alertMsg = "两次密码输入不一致，请重新输入。";
    } else if (!checkAll){
      // 单项检验未通过
      alertMsg = "请根据验证信息重新检查您的输入。";
    }

    alert(alertMsg);

    e.preventDefault();

  });
};

// 2. 策略组
let strategies = {
  name: {
    focus: "用户名必须以字母开头, 可以包含 _ 或数字, 长度在 6 位到 12 位之间， 字母不区分大小写",
    right: "用户名格式正确",
    wrong: "用户名格式错误, 请重新检查您的输入",
    check: s => /^[a-z]{1}\w{5,11}$/i.test(s)
  },
  password: {
    focus: "密码必须同时包含小写字母、数字，可以包含下划线，逗号，括号，字母区分大小写, 长度在 8-22 位",
    right: "密码格式正确",
    wrong: "密码格式错误, 请重新检查您的输入",
    check: s => /^[\w(),\.]{8,22}$/.test(s) && /\d+/.test(s) && /[a-zA-Z]+/.test(s)
  },
  email: {
    focus: "请输入您的邮箱",
    right: "邮箱格式正确",
    wrong: "邮箱格式错误, 请重新检查您的输入",
    check: s => /^[a-zA-Z0-9]+[a-zA-Z0-9\.]{2,20}@[a-zA-Z0-9\-]{1,6}(\.[a-zA-Z]{1,6})+$/.test(s)
  },
  mobilephone: {
    focus: "请输入您的手机号",
    right: "手机号格式正确",
    wrong: "手机号格式错误, 请重新检查您的输入",
    check: s => /^1[3-8]{1}\d{9}$/.test(s)
  }
};

// 使用方法:
//  bindStrategies(rootEle, strategies)
//  bindStrategies 根据标签中的 dataset 的信息, 来判断当前标签所需要使用的策略
//  button 不考虑那么多, 直接写成符合要求的那种行为, 绑定死在 function 里
const form = document.forms['information-check'];
bindStrategies(form, strategies);

// bindStrategies 内部细节
/*
  1. 对 lists 设置事件代理
  2. 当 eventListener 接受到事件的时候, 临时对时间进行委托, 而不进行新的绑定
  3. 事件委托的细节：
    a. 获取 event.target
    b. 根据 event.target 获取 dataset 中的 type
    c. 根据不同的 event handler 程序, 在内部写好不同的处理方式
      比如, "blur" 的 event handler
      将 event.target 中的 value 用  strategies 中的策略进行验证
        验证的方式:
          将 value 传入 strategies 中对应的策略中, 函数的返回值为 ture or false,
          以此判断是否通过检验, 来显示不同的消息
          对 DOM 的操作过程, 属于这个 event handler
      而 "focus" 事件发生时, 进行规则的提示
        对 DOM 的操作过程, 也写在这个 event handler 之内
*/