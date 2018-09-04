console.log('hello world');

function checkMax(num,max){
  if(num >= max){
    return true;
  }else{
    return false;
  }
}

function sub2D(a,b,type){
  let t = type || "point";
  let r = {};
  if(t == "point"){
    r.x = a.x - b.x;
    r.y = a.y - b.y;
  }if(t == "vector2"){
    r.x = a.dx - b.dx;
    r.y = a.dy - b.dy;
  }
  return r;
}

function pitagoras(a,b,type){
  let t = type || "vector2";
  let A,B,C;

  switch (t) {
    case "vector2":
      A = a.dx - b.dx;
      B = a.dy - b.dy;
      C = Math.sqrt((Math.pow(A,2) + Math.pow(B,2)));
    return C;

    case "point":
      A = a.x - b.x;
      B = a.y - b.y;
      C = Math.sqrt((Math.pow(A,2) + Math.pow(B,2)));
    return C;

    default:
    return 0;
  }

}

function forFunc(func,loop){
  for (let i = 0; i < loop; i++) {
    func(i);
  }
}
function clamp(number, min, max) {
  return Math.min(Math.max(number, min),max);
}
