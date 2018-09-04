console.log('hello world');
let valueHolder = document.getElementById('variables');
let valueEdits = document.getElementsByTagName('input');
const dDown = document.getElementById('dropDown');
const StartButton = document.getElementById('switch');
const spreadInp = document.getElementById('spread');
const speedInp = document.getElementById('speed');
const speedDisplay = document.getElementById("sliderDisplay");
const navBar = document.getElementById('nav');

let scene, render, camera, drawCount, positions, navigation, canRotate, canMove;
let AInp,BInp,EInp,YInp;
let line = {};

function rescanValues(){
  AInp = document.getElementById('A');
  BInp = document.getElementById('B');
  EInp = document.getElementById('C');
  YInp = document.getElementById('yInt');
}

functionLib = [{ind : 0,func : function(a,e,b,y){return a*b+y;},html : '<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'}
,{ind : 1,func : function(a,e,b,y){return Math.pow(a,e)*b+y},html : '<li> <input type="number" autofocus placeholder="A" id="A" > </li><li> <input type="number" placeholder="B" id="B"> </li><li> <input type="number" placeholder="Exponent" id="E"> </li><li> <input type="number" step="0.5" placeholder="yIntercept" id="yInt"> </li>'}
,{ind : 2, func : function(a,e,b,y){return 5;},html : ''}];

valueHolder.innerHTML = functionLib[dDown.value].html;
rescanValues();

dDown.onmousedown = function(){
  valueHolder.innerHTML = functionLib[dDown.value].html;
  line.func = functionLib[dDown.value].func;
  console.log(valueHolder);
};

let pause = true;
let linearfunc = new Line(0,0);

let webHeight = window.innerHeight;
let webWidth = window.innerWidth;



//input elements


//etc
//three js
scene = new THREE.Scene();
render = new THREE.WebGLRenderer();
camera = new THREE.PerspectiveCamera(45,webWidth/webHeight,0.1,100000000000000000);
navigation = new ThreeNavigator(camera);
console.log(speedDisplay);


//html events

for (var i = 0; i < valueEdits.length; i++) {
  valueEdits[i].onchange = function(){
    OnUpdateValues();
  }
}

StartButton.onclick = function(){
  OnUpdateValues();
  OnPause();
  StartButton.value = "Pause";
}



// delegates
let OnUpdateValues = function(){
  console.log('updated values');
  line.A = AInp.valueAsNumber || 1;
  line.B = BInp.valueAsNumber || 1;
  line.E = EInp.valueAsNumber || 2;
  line.yIntercept = YInp.valueAsNumber || 0;
  line.spread = spreadInp.valueAsNumber || 200;
  line.x = -(line.spread/2);
  line.speed = speedInp.valueAsNumber || 1;

}


let OnPause = function(){
  console.log('switch');
  pause = !pause;
};

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
  camera.position.set(0,0,200);

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

  console.log(line.mesh.geometry);
  loop();
}

function updatePos(){
  let x=y=z=index=0;

  x = line.x;
  y = x*line.A*line.B+line.yIntercept;

  positions = line.mesh.geometry.attributes.position.array;

  for(let i = 0; i < line.spread;i+=1){
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;

    x = line.x;
    y = x*line.func(line.A,line.B,line.E,line.yIntercept);
    // y= Math.tan(x)*x;+line.yIntercept;
    z = 0;

    line.x += 1;
    line.currentLine = positions;
  }


}

function setEvents(){
  render.domElement.onmousedown = function(){
    canRotate = true;
  };

  render.domElement.onmousemove = function(e){
    if(canRotate){
      navigation.rotate(e.movementY/100,e.movementX/100);
    }
  };
  render.domElement.onmouseover = function(){
    canMove = true;
    console.log('mouseOver');
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
    console.log('mouseOut');
  };

  render.domElement.onmouseup= function(){
    canRotate = false;
  };
}

function loop()
{
  requestAnimationFrame(loop);
  sliderDisplay.innerHTML = speedInp.value;
  // console.log('loop');

  if(webWidth != window.innerWidth || webHeight != window.innerHeight)
  {
    OnWebResize();
  }
  if(!pause)
  {
    // line.mesh.geometry.vertices.push(new THREE.Vector3(line.x,line.A*line.x*line.B+line.yIntercept,0));
    console.log(drawCount + line.speed);
    drawCount = (drawCount + line.speed)% line.spread;

    line.mesh.geometry.setDrawRange(0,drawCount);

    if(drawCount === 0){
      OnUpdateValues();
      console.log('drawcount === 0');
      updatePos();

      line.geometry.attributes.position.needsUpdate = true;
    }
  }

  render.render(scene,camera);
}

setUp();
