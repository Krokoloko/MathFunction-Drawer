console.log('hello world');

class Line{
  constructor(slope,yIntercept){
    this.slope = slope;
    this.yIntercept = yIntercept;
  }
  calcY(x)
  {
    let y = this.slope * x + this.yIntercept;
    return y;
  }
  draw(a,b){
    let beg = a || 0;
    let end = b || window.innerWidth;
    cont.beginPath();
    cont.moveTo(beg,this.calcY(beg));
    cont.lineTo(end,this.calcY(end));
    cont.stroke();
    cont.closePath();
  }

  intersection(m){
    var ans = {};
    ans.x = (m.yIntercept - this.yIntercept)/(this.slope-m.slope);
    ans.y = (ans.x * this.slope)+this.yIntercept;
    return ans;
  }

  inverseSlope(){
    return -1/this.slope;
  }

  reinitialise(slope,yIntercept){
    this.slope = slope;
    this.yIntercept = yIntercept;
  }

  letSlopeDefineLine(slope,A,type){
    let t = type || "point";
    this.slope = slope || this.slope;

    if(t == "point"){
      this.yIntercept = A.y-(this.slope*A.x);
    }if(t == "vector"){
      this.yIntercept = A.dy-(this.slope*A.dy);
    }
  }

  letTwoPointsDefineLine(A,B,type){
    let t = type || "point";
    if(t == "vector"){
      this.slope = (A.dy-B.dy)/(A.dx-B.dx);
      this.yIntercept = A.dy-(this.slope*A.dx);
    }if(t == "point"){
      this.slope = (A.y-B.y)/(A.x-B.x);
      this.yIntercept =  A.y-(this.slope*A.x);
    }
  }
}
