window.addEventListener("load", () => {
  var sim = new Simulator_ui(
    document.querySelectorAll("input"),
    document.querySelector("#clear"),
    document.querySelector("#overlay"),
    document.querySelector("#euler"),
    document.querySelector("#runge"),
    document.querySelector("#result")
  );

  sim.draw_axis();
});

class Simulator_ui {
  constructor(input, clear, overlay, euler, runge, canvas) {
    this.input = input;
    this.clear = clear;
    this.overlay = overlay;
    this.euler = euler;
    this.runge = runge;
    this.canvas = canvas;
    this.scale = 1.0;   //グラフの拡大率,500px基準
    
    this.clear.addEventListener("click", () => {
      console.log("clear");
      this.clear_canvas();
      this.draw_axis();
    });
    this.overlay.addEventListener("click", () => {

    });
    this.euler.addEventListener("click", () => {
      var result = new Euler(canvas, input);
      result.next();
    });
  }

  //座標軸と目盛りを描画
  draw_axis() {
    let ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0, this.canvas.height);
    ctx.lineTo(0, 0);
    ctx.moveTo(0, this.canvas.height);
    ctx.lineTo(this.canvas.width, this.canvas.height);
    ctx.stroke();


  }

  //グラフ描画を行うキャンバスの内容削除
  clear_canvas() {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Euler {
  constructor(canvas, input) {
    // this.canvas = canvas;
    // this.data = input[0].value;
    // this.formula = (new Function("return " + this.data))();
    // console.log(this.formula);
    this.xinit = parseFloat(input[1].value);
    this.yinit = parseFloat(input[2].value);
    this.prot = parseFloat(input[3].value);
    this.max = 10.0;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
  }

  next() {
    var scale = 10.0;
    
    while (this.xinit <= this.max) {
      this.yinit += this.prot * this.xinit ** 2;   //ここの1.0 * this.xinitを入力した式にしたい。
      this.xinit += this.prot;
      console.log("x = " + this.xinit);
      console.log("y = " + this.yinit);

      this.ctx.beginPath();
      this.ctx.moveTo(this.xinit * scale , this.canvas.height - this.yinit * scale);
      this.ctx.lineTo(this.xinit * scale + 1, this.canvas.height - this.yinit * scale + 1);
      this.ctx.stroke();
      console.log(this.canvas.height - this.yinit);
    }
    
  }

  
}

class runge {

}