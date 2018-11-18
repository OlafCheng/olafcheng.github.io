document.addEventListener("contextmenu", (e) => {
  switch(e.target.id) {// DOM
    case "custome_contextmenu":
      showMenu(e);
      e.preventDefault();
      break;
    default:
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.dataset.type || e.target.dataset.type !== "contextmenu") {// DOM
    if (global_component.contextmenu.state !== "none") {
      global_component.contextmenu.hide();
      global_component.contextmenu.state = "none";
    }
  }
});

let global_component = {
  "contextmenu": {
    "mixin": null,
    "menu": ["Menu item 0", "Menu item 1"],
    "class": "context_menu",
    "width": null,
    "height": null,
    "state": "none",
    "type": "contextmenu",
    generater () {
      let container = document.createElement("div");//DOM
      let ul = document.createElement("ul");//DOM
      this.menu.forEach((e) => {
        let txt = document.createTextNode(e);
        let li = document.createElement("li");
        li.dataset.type = this.type;
        li.appendChild(txt);
        ul.appendChild(li);
      });//DOM
      container.appendChild(ul);//DOM
      container.className = this.class;//DOM
      container.dataset.type = this.type;
      this.mixin = container;//javascipt
      return this.mixin;
    },
    hide () {
      this.mixin.style.display = "none";
      this.state = "none";
    }
  }
};

const showMenu = (mouse) => {
  let x = mouse.clientX;// DOM
  let y = mouse.clientY;// DOM
  console.log([x, y].join(", "));// javascript


  show(x, y);
};

const moveDiv = (ele, offX, offY) => {
  // 将 menu 对鼠标所在对位置进行相对的移动
  ele.style.left = offX + "px";
  ele.style.top = offY + "px";
};

const show = (() => {
  let gcc = global_component.contextmenu;
  let menu = gcc.generater();
  document.body.appendChild(menu);// DOM
  const style = getComputedStyle(menu);// DOM javascipt
  moveDiv(menu, -1000, -1000);
  menu.style.display = "block";
  gcc.height = parseFloat(style.getPropertyValue("height"));// DOM javascipt
  console.log(gcc.height);
  gcc.width = parseFloat(style.getPropertyValue("width"));// DOM javascipt
  menu.style.display = "none";
  return (x, y) => {
    // 会形成闭包
    let horizontal = window.innerWidth - x;
    let vertical = window.innerHeight - y;
    let offX, offY;
    if (horizontal < gcc.width && vertical < gcc.height) {
      // 需要将浮出窗口挪动到左上角
      offX = x - gcc.width;
      offY = y - gcc.height;
    } else if (horizontal < gcc.width && vertical >= gcc.height) {
      // 需要将浮出窗口挪动到左下角
      offX = x - gcc.width;
      offY = y;
    } else if (horizontal >= gcc.width && vertical < gcc.height) {
      // 需要将窗口挪动到右上角
      offX = x;
      offY = y - gcc.height;
    } else {
      // 直接在右下角显示
      offX = x;
      offY = y;
    }
    moveDiv(menu, offX, offY);
    // 属性设置完毕后, 再进行 layout
    menu.style.display = "block";// DOM
    gcc.state = "block";
  };
})();