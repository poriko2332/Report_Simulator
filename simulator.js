window.addEventListener("load", () => {
  var sim = new Simulator_ui(
    document.querySelectorAll("input"),
    document.querySelector("#clear"),
    document.querySelector("#euler"),
    document.querySelector("#runge"),
    document.querySelector("#result"),
    document.querySelectorAll("#scale_aj > button")
  );

  sim.draw_axis();
});

class Simulator_ui {
  constructor(input, clear, euler, runge, canvas, scale) {
    this.input = input;
    this.clear = clear;
    this.euler = euler;
    this.runge = runge;
    this.canvas = canvas;
    this.scale = 25.0;   //グラフの拡大率,500px基準
    
    this.clear.addEventListener("click", () => {
      console.log("clear");
      this.clear_canvas();
      this.draw_axis();
    });
    this.euler.addEventListener("click", () => {
      let euler_result = new Euler(canvas, input, this.scale);
      euler_result.animate();
    });
    this.runge.addEventListener("click", () => {
      let runge_result = new Runge(canvas, input, this.scale);
      runge_result.animate();
    })
    for (let btn of scale) {
      btn.addEventListener("click", () => {
        if (btn.getAttribute("number")) {
          this.scale = btn.getAttribute("number");
          this.clear_canvas();
          this.draw_axis();
          console.log(this.scale);
        }
      });
    }
  }

  //座標軸と目盛りを描画
  draw_axis() {
    let ctx = this.canvas.getContext("2d");
    // ctx.strokeStyle = ("rgb(0, 0, 0)");
    // ctx.beginPath();
    // ctx.moveTo(0, this.canvas.height);
    // ctx.lineTo(0, 0);
    // ctx.moveTo(0, this.canvas.height);
    // ctx.lineTo(this.canvas.width, this.canvas.height);
    // ctx.stroke();

    //x軸の目盛り
    for (let i = 0; i <= this.canvas.width; i += this.scale) {
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.canvas.height);
      ctx.stroke();
      console.log("draw");
    }

    //y軸の目盛り
    for (let i = 0; i <= this.canvas.height; i += this.scale) {
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      ctx.moveTo(0, i);
      ctx.lineTo(this.canvas.width, i);
      ctx.stroke();
    }
  }

  //グラフ描画を行うキャンバスの内容削除
  clear_canvas() {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Euler {
  constructor(canvas, input, scale) {
    this.xinit = parseFloat(input[1].value);
    this.yinit = parseFloat(input[2].value);
    this.prot = parseFloat(input[3].value);
    this.max = 25.0;
    this.scale = scale;
    this.x_prot = document.querySelector("#x_prot");
    this.y_prot = document.querySelector("#y_prot");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  next() {
    while (this.xinit <= this.max) {
      this.yinit += this.prot * this.func_f(this.xinit);   //ここの1.0 * this.xinitを入力した式にしたい。
      this.xinit += this.prot;
      console.log("x = " + this.xinit);
      console.log("y = " + this.yinit);

      this.ctx.lineWidth = 2.0;
      this.ctx.strokeStyle = "rgb(220, 40, 40)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.xinit * this.scale , this.canvas.height - this.yinit * this.scale);
      this.ctx.lineTo(this.xinit * this.scale + 1, this.canvas.height - this.yinit * this.scale + 1);
      this.ctx.stroke();
      console.log(this.canvas.height - this.yinit);
      this.x_prot.innerHTML = String(this.xinit);
      this.y_prot.innerHTML = String(this.yinit);
      
    } 
  }

  animate() {
    let intervalID = setInterval(() => {
      if (this.xinit >= this.max) {
        clearInterval(intervalID);
      }
      this.yinit += this.prot * this.func_f(this.xinit, this.yinit);   //ここの1.0 * this.xinitを入力した式にしたい。
      this.xinit += this.prot;
      console.log("x = " + this.xinit);
      console.log("y = " + this.yinit);

      this.ctx.lineWidth = 2.0;
      this.ctx.strokeStyle = "rgb(220, 40, 40)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2 + this.xinit * this.scale, this.canvas.height / 2 - this.yinit * this.scale);
      this.ctx.lineTo(this.canvas.width / 2 + this.xinit * this.scale + 1, this.canvas.height / 2 - this.yinit * this.scale + 1);
      this.ctx.stroke();
      console.log(this.canvas.height - this.yinit);
      this.x_prot.innerHTML = String(this.xinit);
      this.y_prot.innerHTML = String(this.yinit);

    }, 1);
  }

  func_f(x, y) {
    return 2.0 * x  ;
  }
}

class Runge {
  constructor(canvas, input, scale) {
    this.xinit = parseFloat(input[1].value);
    this.yinit = parseFloat(input[2].value);
    this.prot = parseFloat(input[3].value);
    this.max = 10.0;
    this.scale = scale;
    this.x_prot = document.querySelector("#x_prot");
    this.y_prot = document.querySelector("#y_prot");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  next() {
    var k1, k2, k3, k4;
    while (this.xinit <= this.max) {
      k1 = this.func_f(this.xinit, this.yinit);
      k2 = this.func_f(this.xinit + this.prot / 2.0, this.yinit + this.prot * k1 * this.prot / 2.0);
      k3 = this.func_f(this.xinit + this.prot / 2.0, this.yinit + this.prot * k2 * this.prot / 2.0);
      k4 = this.func_f(this.xinit + this.prot, this.yinit + k3 * this.prot);
      this.yinit += (this.prot / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
      this.xinit += this.prot;

      this.ctx.lineWidth = 2.0;
      this.ctx.strokeStyle = "rgb(0, 70, 200)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.xinit * this.scale, this.canvas.height - this.yinit * this.scale);
      this.ctx.lineTo(this.xinit * this.scale + 1, this.canvas.height - this.yinit * this.scale + 1);
      this.ctx.stroke();
      console.log(this.canvas.height - this.yinit);
    }
  }

  animate() {
    let intervalID = setInterval(() => {
      if (this.xinit >= this.max) {
        clearInterval(intervalID);
      }
      var k1, k2, k3, k4;
      k1 = this.func_f(this.xinit, this.yinit);
      k2 = this.func_f(this.xinit + this.prot / 2.0, this.yinit + this.prot * k1 * this.prot / 2.0);
      k3 = this.func_f(this.xinit + this.prot / 2.0, this.yinit + this.prot * k2 * this.prot / 2.0);
      k4 = this.func_f(this.xinit + this.prot, this.yinit + k3 * this.prot);
      this.yinit += (this.prot / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
      this.xinit += this.prot;

      this.ctx.lineWidth = 2.0;
      this.ctx.strokeStyle = "rgb(0, 70, 200)";
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2 + this.xinit * this.scale, this.canvas.height / 2 - this.yinit * this.scale);
      this.ctx.lineTo(this.canvas.width / 2 + this.xinit * this.scale + 1, this.canvas.height / 2 - this.yinit * this.scale + 1);
      this.ctx.stroke();
      console.log(this.canvas.height - this.yinit);
      console.log("x = " + this.xinit);
      console.log("y = " + this.yinit);
      this.x_prot.innerHTML = String(this.xinit);
      this.y_prot.innerHTML = String(this.yinit);
    }, 1);
  }

  func_f(x, y) {
    return 2.0 * x;
  }
}