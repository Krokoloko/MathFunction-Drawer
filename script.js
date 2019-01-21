let valueHolder = document.getElementById('variables');
let valueEdits = document.getElementsByTagName('input');
const dDownAxis = document.getElementById('dropDownAxis');
const dDownFunctions = document.getElementById('dropDownFunctions');
const StartButton = document.getElementById('switch');
const navBar = document.getElementById('nav');

let scene, render, camera, drawCount, positions, navigation, canRotate, canMove;
let AInp,BInp,EInp,YInp,mode;
let line = {y:{},z:{},line:{}};

function rescanValues(){
  AInp = document.getElementById('A');
  BInp = document.getElementById('B');
  EInp = document.getElementById('E');
  YInp = document.getElementById('yInt');
}

function onModeAxis(){
  mode = dDownAxis.value;
  if (mode == 'Z') {
    valueHolder.innerHTML = htmlLib[dDownFunctions.value].z;
  }
  if(mode == 'Y'){
    valueHolder.innerHTML = htmlLib[dDownFunctions.value].y;
  }
}

let funcs = [[function(x,a,e,b,y){return a*b+y},function(x,a,e,b,y){return a*b+y}],
             [function(x,a,e,b,y){return x*(a**e)*b+y},function(x,a,e,b,y){return x*(a**e)*b+y}],
             [function(x,a,e,b,y){return (x**e)%a+y},function(x,a,e,b,y){return (x**e)%a+y}],
             [function(x,a,e,b,y){return (Math.tan(x)**a)*b+y},function(x,a,e,b,y){return (Math.tan(x)**a)*b+y}],
             [function(x,a,e,b,y){return (Math.cos(x)**a)*b+y},function(x,a,e,b,y){return (Math.cos(x)**a)*b+y}],
             [function(x,a,e,b,y){return (Math.sin(x)**a)*b+y},function(x,a,e,b,y){return (Math.sin(x)**a)*b+y}],
             [function(x,a,e,b,y){return Math.sin((x*Math.PI)/a)**e*b+y},function(x,a,e,b,y){return Math.sin((x*Math.PI)/a)**e*b+y}]
            ];

htmlLib = [{y: '<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'},
           {y: '<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" placeholder="Exponent" id="E"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" placeholder="Exponent" id="E"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'},
           {y:'<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="Exponent" id="E"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt">',z:'<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="Exponent" id="E"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt">'},
           {y:'<li> <input type="number" autofocus placeholder="Tangent" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li> <li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="Tangent" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li> <li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'},
           {y:'<li> <input type="number" autofocus placeholder="Cosinus" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li> <li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="Cosinus" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li> <li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'},
           {y:'<li> <input type="number" autofocus placeholder="Sinus" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="Sinus" id="A" ></li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'},
           {y:'<li> <input type="number" autofocus placeholder="arc mulitplier" id="A"</li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" placeholder="Exponent" id="E"><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>',z:'<li> <input type="number" autofocus placeholder="arc mulitplier" id="A"</li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" placeholder="Exponent" id="E"><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'}]

onModeAxis();
rescanValues();

dDownAxis.onmousedown = function(){
  onModeAxis();
  rescanValues();
}

dDownFunctions.onmousedown = function(){
  line.func = funcs[dDownFunctions.valueAsNumber];
  onModeAxis();
  rescanValues();
};

let pause = true;

let webHeight = window.innerHeight;
let webWidth = window.innerWidth;


//three js
scene = new THREE.Scene();
render = new THREE.WebGLRenderer();
camera = new THREE.PerspectiveCamera(45,webWidth/webHeight,0.1,1000000);
navigation = new ThreeNavigator(camera);

//html events

for (var i = 0; i < valueEdits.length; i++) {
  valueEdits[i].onchange = function(){
    OnUpdateValues();
  }
}

StartButton.onclick = function(){
  OnUpdateValues();
}

// delegates
let OnUpdateValues = function(){
  console.log('updated values');
  if(mode == "Y"){
    line.y.A = AInp.valueAsNumber || 1;
    line.y.B = BInp.valueAsNumber || 1;
    line.y.E = EInp.valueAsNumber || 2;
    line.y.yIntercept = YInp.valueAsNumber || 0;
  }
  if(mode == "Z"){
    line.z.A = AInp.valueAsNumber || 1;
    line.z.B = BInp.valueAsNumber || 1;
    line.z.E = EInp.valueAsNumber || 2;
    line.z.yIntercept = YInp.valueAsNumber || 0;
  }

  line.spread = 400;
  line.x = -(line.spread/2);
  line.func = funcs[dDownFunctions.value];
}

let OnWebResize = function(){
  webWidth = window.innerWidth;
  webHeight = window.innerHeight;
  console.log('On resize');
};

function setUp(){
  //Three setup
  OnUpdateValues();
  render.setPixelRatio( window.devicePixelRatio );
  render.setSize(webWidth,webHeight-nav.offsetHeight);

  setEvents();

  document.body.appendChild(render.domElement);
  camera.position.set(0,0,150);

  line.geometry = new THREE.BufferGeometry();
  positions = new Float32Array(line.spread*3);

  line.material = new THREE.LineBasicMaterial({color: 0xeabfbf, linewidth: 3});

  line.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

  drawCount = 2;
  line.geometry.setDrawRange(0,drawCount);

  line.mesh = new THREE.Line(line.geometry,line.material);
  line.drawn = false;

  scene.add(line.mesh);
  render.render(scene,camera);

  loop();
}

function updatePos(){
  let x=y=z=index=0;

  x = line.x;
  y = line.func[0](x,line.y.A,line.y.E,line.y.B,line.y.yIntercept)||1;
  z = line.func[1](x,line.z.A,line.z.E,line.z.B,line.z.yIntercept)||1;;

  positions = line.mesh.geometry.attributes.position.array;

  for(let i = 0; i < line.spread;i+=1){
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;

    x = line.x;
    y = line.func[0](x,line.y.A,line.y.E,line.y.B,line.y.yIntercept)||1;
    z = line.func[1](x,line.z.A,line.z.E,line.z.B,line.z.yIntercept)||1;
    line.x++;
    line.currentLine = positions;
  }
}

function setEvents(){
  render.domElement.onmousedown = function(){
    canRotate = true;
  };
  render.domElement.onmousemove = function(e){
    if(canRotate){
      navigation.rotate(e.movementY/200,e.movementX/200);
    }
  };
  render.domElement.onmouseover = function(){
    canMove = true;
  };
  render.domElement.onkeypress = function(event){
    console.log(event);
    if(canMove){
      let x=y=z=0;
      switch(true){
        case (event.key == 'a' || event.key == 'A' || event.key == 'ArrowRight'):
          x = -1;
          break;
        case (event.key == 'd' || event.key == 'D' || event.key == 'ArrowLeft'):
          x = 1;
          break;
        case (event.key == 's' || event.key == 'S' || event.key == 'ArrowDown'):
          z = -1;
          break;
        case (event.key == 'w' || event.key == 'W' || event.key == 'ArrowUp'):
          z = 1;
          break;
        case (event.key == 'Spacebar'):
          y = 1;
          break;
        case (event.key == 'Spacebar' && event.altKey):
          y = -1;
          break;
      }
      navigation.move(x,y,z);
    }
  }
  render.domElement.onmouseout = function(){
    canMove = false;
    //console.log('mouseOut');
  };
  render.domElement.onmouseup= function(){
    canRotate = false;
  };
  render.domElement.onscrollup= function(){
    navigation.move(0,0,2);
  }
}

function loop()
{
  requestAnimationFrame(loop);
  //sliderDisplay.innerHTML = speedInp.value;
  // console.log('loop');

  if(webWidth != window.innerWidth || webHeight != window.innerHeight)
  {
    OnWebResize();
  }

  drawCount = (drawCount + 1)% line.spread;

  line.mesh.geometry.setDrawRange(0,drawCount);

  if(drawCount === 0){
    OnUpdateValues();
    updatePos();

    line.geometry.attributes.position.needsUpdate = true;
  }

  render.render(scene,camera);
}

window.onload = function()
{
  setUp();
}
