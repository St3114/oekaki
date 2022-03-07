//参考URL:https://qiita.com/Ryota-Onuma/items/61414b513979e94eaefa
window.addEventListener("load", () => {
  const canvas = document.querySelector("#draw-area");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF"; //白にする
  ctx.fillRect(0, 0, 600, 600); //四角を描く
  const context = canvas.getContext("2d");

  // 現在のマウスの位置を中心に、現在選択している線の太さをで表現するために使用するcanvas
  const canvasForWidthIndicator = document.querySelector("#line-width-indicator");
  const contextForWidthIndicator = canvasForWidthIndicator.getContext("2d");

  const lastPosition = { x: null, y: null };
  let isDrag = false;//偽
  let currentColor = "#000000";//黒

  // 現在の線の太さを記憶する変数
  // <input id="range-selector" type="range"> の値と関数する
  let currentLineWidth = 1;//1固定

  function draw(x, y) {
    if (!isDrag) {
      return;//返す
    }
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = currentLineWidth;
    context.strokeStyle = currentColor;
    if (lastPosition.x === null || lastPosition.y === null) {
      context.moveTo(x, y);
    } else {
      context.moveTo(lastPosition.x, lastPosition.y);
    }
    context.lineTo(x, y);
    context.stroke();

    lastPosition.x = x;
    lastPosition.y = y;
  }

  // <canvas id="line-width-indicator"> 上で現在のマウスの位置を中心に
  // 線の太さを表現するための「○」を描画する。
  function showLineWidthIndicator(x, y) {
    contextForWidthIndicator.lineCap = "round";
    contextForWidthIndicator.lineJoin = "round";
    contextForWidthIndicator.strokeStyle = currentColor;

    //1で固定する
    contextForWidthIndicator.lineWidth = 1;

    contextForWidthIndicator.clearRect(0,0,canvasForWidthIndicator.width,canvasForWidthIndicator.height);
    contextForWidthIndicator.beginPath();

    // x, y座標を中心とした円を描画する。
    // 第3引数の「currentLineWidth / 2」で、実際に描画する線の太さと同じ大きさになる。
    // ドキュメント: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    contextForWidthIndicator.arc(x,y,currentLineWidth / 2,0,2 * Math.PI);
    contextForWidthIndicator.stroke();
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF"; //筆に白い絵の具をつけて
    ctx.fillRect(0, 0, 600, 600); //四角を描く
  }

  //描き始め
  function dragStart(event) {
    context.beginPath();
    isDrag = true;//真
  }

  //描き終わり
  function dragEnd(event) {
    context.closePath();
    isDrag = false;//偽
    lastPosition.x = null;//0であるか判断する
    lastPosition.y = null;//0であるか判断する
  }

  function initEventHandler() {
    const clearButton = document.querySelector("#clear-button");//全消しボタン
    const eraserButton = document.querySelector("#eraser-button");//消しゴムボタン
    clearButton.addEventListener("click", clear);//全消しボタンを押したら
    eraserButton.addEventListener("click", () => {
      currentColor = "#FFFFFF";//白にする
    });

    const layeredCanvasArea = document.querySelector(
      "#layerd-canvas-area"
    );

    // 2つのcanvasを重ねて使うため、親要素である <span id="layerd-canvas-area">に対して
    // イベント処理を定義するようにした。
    layeredCanvasArea.addEventListener("mousedown", dragStart);
    layeredCanvasArea.addEventListener("mouseup", dragEnd);
    layeredCanvasArea.addEventListener("mouseout", dragEnd);
    layeredCanvasArea.addEventListener("mousemove", (event) => {
      // 2つのcanvasに対する描画処理を行う

      // 実際に線を引くcanvasに描画を行う。(ドラッグ中のみ線の描画を行う)
      draw(event.layerX, event.layerY);

      // 現在のマウスの位置を中心として、線の太さを表現するためのcanvasに描画を行う
      showLineWidthIndicator(event.layerX, event.layerY);
    });
  }

  //カラーパレット
  function initColorPalette() {
    const joe = colorjoe.rgb("color-palette", currentColor);
    joe.on("done", (color) => {
      currentColor = color.hex();
    });
  }

  // 文字の太さの設定・更新を行う機能
  function initConfigOfLineWidth() {
    const textForCurrentSize = document.querySelector("#line-width");
    const rangeSelector = document.querySelector("#range-selector");
    const numberField = document.getElementById("line-width-number-field");
    // 線の太さを記憶している変数の値を更新する
    currentLineWidth = rangeSelector.value;

   // 線を<input type='number'>からも更新できるようにする。
    numberField.addEventListener("input", (event) => {
      const width = event.target.value;
      // 線の太さを記憶している変数の値を更新する
      currentLineWidth = width;
      rangeSelector.value = width;
      // 更新した線の太さ値(数値)を<input id="range-selector" type="range">の右側に表示する
      textForCurrentSize.innerText = width;
    });
    // "input"イベントをセットすることでスライド中の値も取得できるようになる。
    // ドキュメント: https://developer.mozilla.org/ja/docs/Web/HTML/Element/Input/range

    rangeSelector.addEventListener("input", (event) => {
      const width = event.target.value;
      numberField.value = width;
      // 線の太さを記憶している変数の値を更新する
      currentLineWidth = width;

      // 更新した線の太さ値(数値)を<input id="range-selector" type="range">の右側に表示する
      textForCurrentSize.innerText = width;
    });
  }

  initEventHandler();
  initColorPalette();

  // 文字の太さの設定を行う機能を有効にする
  initConfigOfLineWidth();
  const button = document.getElementById("download");
  button.onclick = function() {
    let canvas = document.getElementById("draw-area");
    console.dir(canvas)
    let base64 = canvas.toDataURL("image/jpeg");

    document.getElementById("download").href = base64;
  };
  
});