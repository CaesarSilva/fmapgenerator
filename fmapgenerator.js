const fs = require('fs');
const { createCanvas, loadImage} = require('canvas');
const cos = Math.cos.bind(null);
const sin = Math.sin.bind(null);
const cos2 = (a)=>{return Math.pow(cos(a),2);};
const sin2 = (a)=>{return Math.pow(cos(a),2);};
const pi = Math.PI ;
let i,ii;
let mV = [0];//main vertices
let sV = [];//secondary vertices
let sV2 = [];//alternative one
let kx=20;
let ky=40;
const dx=Math.pow(10,-5);
let width = 6000;
let height = 1500;
let x0 = width/2-2000;
//y=\ 12\cos^{2}\left(\frac{3}{4}x\right)-6\sin\left(x+0.5\right)+5\sin\left(0.1x\right)
const fmain = (y)=>{
  return 12*cos2(0.75*y)-6*sin(y+pi/4)+5*sin(0.1*y);
//return 12*cos2(0.75*y);
};
const fdif = (y)=>{return ((fmain(y+dx)-fmain(y))/dx)};
const fdifdif = (y)=>{return ((fdif(y+dx)-fdif(y))/dx)};
const fdifdifabs = (y)=>{return Math.abs(fdifdif(y))};
const fdifdifabsdint = (ya,yb)=>{
let result = 0;
const dX = (yb-ya)/100;
for(let o = 0; o<100 ; o++){
//calculating area of the trapezoid
result += 0.5*dX*(fdifdifabs(ya+dX*o)+fdifdifabs(ya+dX*(o+1)));
}
return result;
};

let sign = fdif(0)>=0;
for(i = 1; i<height ; i++){
if(!((fdif(i/ky) >= 0) === sign)){
mV.push(i/ky);
sign = !sign;
}

}
mV.push(height/ky);
console.log("TEST1"+ fmain(20));
let canvas = createCanvas(width, height);
let context = canvas.getContext('2d');
context.fillStyle = "#0000FF";
//context.fillRect(0,0,width-100, height-30);
context.beginPath();
context.moveTo(x0,0)
for(i=0; i<height ; i++){
context.lineTo(x0+fmain(i/ky)*kx,i);
//console.log(x0+fmain(i/ky)*kx + ","+ i);
}
context.strokeStyle = "red";
context.stroke();
context.beginPath();
mV.forEach((a)=>{
context.fillRect(x0+fmain(a)*kx-3,a*ky-3,6,6);
context.moveTo(0,a*ky);
context.lineTo(width,a*ky);
});
context.strokeStyle = "red";
context.stroke();
//DRAW DERIVATIVE
context.beginPath();
context.moveTo(700+x0,0)
for(i=0; i<height ; i++){
context.lineTo(700+x0+fdif(i/ky)*kx,i);
//console.log(x0+fmain(i/kmoveToy)*kx + ","+ i);
}
context.moveTo(700+x0,0);
context.lineTo(700+x0,height);
context.strokeStyle = "blue";
context.stroke();
//and of derivative drawing
//start of derivative of derivative drawing
context.beginPath();
context.moveTo(1500+x0,0)
for(i=0; i<height ; i+=2){
context.lineTo(1500+x0+fdifdif(i/ky)*kx,i);
//console.log(x0+fmain(i/kmoveToy)*kx + ","+ i);
}
context.moveTo(1500+x0,0);
context.lineTo(1500+x0,height);
context.strokeStyle = "black";
context.stroke();
//end of that drawing
//start of the absolute value of the latest function
context.beginPath();
context.moveTo(2000+x0,0)
for(i=0; i<height ; i+=2){
context.lineTo(2000+x0+fdifdifabs(i/ky)*kx,i);
//console.log(x0+fmain(i/kmoveToy)*kx + ","+ i);
}
context.moveTo(2000+x0,0);
context.lineTo(2000+x0,height);
context.strokeStyle = "green";
context.stroke();
//start of integration part
//for(i = 0 ; i < mV.length ; i++){ //original
for(i = 0; i < mV.length ; i++){
//  console.log("VERTICE"+i)
  let defint = fdif(mV[i+1])-fdif(mV[i]);
//  console.log("defint"+defint);
  let vcount = 0;
  const vertices = 3;
  const threshold = defint/(vertices+1);
  let lastvertice = mV[i];
  //console.log("mvI"+mV[i]);
//  console.log("mvI+1"+mV[i+1]);
  //console.log("last"+(lastvertice + 100*(mV[i+1]-mV[i])/100));
  for(ii = 1 ; ii <= 100 && vcount < vertices ; ii++){
  //  console.log("ii"+ii)
    let currentY = mV[i] + ii*(mV[i+1]-mV[i])/100;
    //console.log("currentY"+ currentY);
    let defint2 = fdif(currentY)-fdif(lastvertice);
    if(Math.abs(threshold) < Math.abs(defint2)){
      sV.push(currentY);
      console.log("PUSH I");
      lastvertice = currentY;
      vcount++;
    }


  }


}
//alternative method of finding the vertices
for(i = 0; i < mV.length ; i++){
let defint = fdifdifabsdint(mV[i],mV[i+1]);
let vcount = 0;
const vertices = 21;//6 for testing purposes
const threshold = defint/(vertices+1);
let lastvertice = mV[i];

for(ii = 1 ; ii <= 100 && vcount < vertices ; ii++){
//  console.log("ii"+ii)
  let currentY = mV[i] + ii*(mV[i+1]-mV[i])/100;
  //console.log("currentY"+ currentY);
  let defint2 = fdifdifabsdint(lastvertice,currentY);
  if(Math.abs(threshold) < Math.abs(defint2)){
    sV2.push(currentY);
    console.log("PUSH I");
    lastvertice = currentY;
    vcount++;
  }


}


}
//end of integration part
//adding secondary vertices
context.fillStyle = "#00FF00";
sV.forEach((a)=>{
context.fillRect(x0+fmain(a)*kx-3,a*ky-3,6,6);

});
context.fillStyle = "#00FFFF";
sV2.forEach((a)=>{
context.fillRect(x0+fmain(a)*kx-2,a*ky-2,4,4);

});
//drawing aproximate graph using just lines
let allv = sV2.concat(mV);
context.beginPath();
//context.moveTo(4000+x0,0);
allv.sort((fE,sE)=>{
  if(fE>sE)
  return 1
  if(fE<sE){
    return -1;
  }else{
    return 0;
  }
  }
);
console.log(allv);
function vtx(x,y){
  this.x = x;
  this.y = y;
}
function triangle(v1,v2,v3){
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;
}
let allv2= [];
allv.forEach((a)=>{
  if(a==0){
    context.moveTo(4000+x0+fmain(a)*kx,a*ky)
  }else{
    context.lineTo(4000+x0+fmain(a)*kx,a*ky);
  }
  allv2.push(new vtx(fmain(a),a));
  console.log(a);

});

console.log("TOTAL AMMOUNT OF VERTICES:"+ allv.length);
context.strokeStyle = "green";
context.stroke();


let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./out.png', buffer);

kx = 70;
ky = 70;
let yoffset = 5;
let xoffset = 5000;
let d = 0.05;//distance between tunel walls
let thickness = 0.1; //wall thickness
width = 10000;
height = yoffset + allv[allv.length-1]*ky+5;

canvas = createCanvas(width, height);
context = canvas.getContext('2d');
x0 = xoffset;
context.beginPath();
let allv2a = [];
let allv2b = [];

allv2.forEach((a)=>{
  if(a.y==0){
    context.moveTo(x0+a.x*kx,a.y*ky+yoffset);
  }else{
    context.lineTo(x0+a.x*kx,a.y*ky+yoffset);
  }
  //console.log(a);
  //allv2a.push(new vtx(a.x-d,a.y));
  //allv2b.push(new vtx(a.x-d,a.y));

});
let allv2at = [];// triangle vertex
let allv2bt = [];

context.strokeStyle = "green";
context.stroke();
context.beginPath();
for(i = 0 ; i < allv2.length ; i++){
  let a = allv2[i];
  if(i == 0 || i == allv2.length-1){
    allv2a.push(new vtx(a.x-d*3,a.y));
    allv2b.push(new vtx(a.x+d*3,a.y));
    allv2at.push(new vtx(a.x-(d+thickness)*3,a.y));
    allv2bt.push(new vtx(a.x+(d+thickness)*3,a.y));
  }else{
    let cosine = cos(Math.atan(fdif(a.y)));
    let sine = sin(Math.atan(fdif(a.y)));
    allv2a.push(new vtx(a.x-d*cosine,a.y + d* sine));
    allv2b.push(new vtx(a.x+d*cosine,a.y - d* sine));
    allv2at.push(new vtx(a.x-(d+thickness)*cosine,a.y + (d+thickness)* sine));
    allv2bt.push(new vtx(a.x+(d+thickness)*cosine,a.y - (d+thickness)* sine));
    context.moveTo(x0+allv2a[i].x*kx, allv2a[i].y*ky + yoffset);
    context.lineTo(x0+allv2b[i].x*kx, allv2b[i].y*ky + yoffset);

    //context.moveTo(x0+a.x*kx - cosine*30 ,a.y*ky+yoffset +sine*30 );
    //context.lineTo(x0+a.x*kx + cosine*30 ,a.y*ky+yoffset -sine*30 );
  }

}
context.strokeStyle = "black";
context.stroke();
//making the triangles
tri = [];
for(i = 0 ; i < allv2.length-1 ; i++){
  //console.log("I="+i);
  for(let iA = 0 ; iA <2; iA++ ){
    //console.log("Ia="+iA);
    let inn1,inn2,out1,out2;
    if(iA == 0){
      inn1 = allv2a[i];
      inn2 = allv2a[i+1];
      out1 = allv2at[i];
      out2 = allv2at[i+1];
    }else{
      inn1 = allv2b[i];
      inn2 = allv2b[i+1];
      out1 = allv2bt[i];
      out2 = allv2bt[i+1];
    }
    //the first triangle will be the one inside
    //2 of the vertices will be taken from allv2a or b and one from allv2at or bt
    tri.push(new triangle(inn1,inn2, out2));
    tri.push(new triangle(inn1,out1,out2));

  }
  //the first triangle will be the one inside
  //2 of the vertices will be taken from allv2a or b and one from allv2at or bt

}
i=0;
tri.forEach((a)=>{
  if((i%4)==0 || (i%4)==2){
    context.fillStyle = "orange";
  }else{
    context.fillStyle = "brown";
  }
  context.beginPath();
  context.moveTo(x0+a.v1.x*kx,a.v1.y*ky+yoffset);
  context.lineTo(x0+a.v2.x*kx,a.v2.y*ky+yoffset);
  context.lineTo(x0+a.v3.x*kx,a.v3.y*ky+yoffset);
  context.closePath();
  context.fill();
i++;
});

//left wall
context.beginPath();
x0 = xoffset
allv2a.forEach((a)=>{
  if(a.y==0){
    context.moveTo(x0+a.x*kx,a.y*ky+yoffset);
  }else{
    context.lineTo(x0+a.x*kx,a.y*ky+yoffset);
  }
  //console.log(a);

});
//right wall
allv2b.forEach((a)=>{
  if(a.y==0){
    context.moveTo(x0+a.x*kx,a.y*ky+yoffset);
  }else{
    context.lineTo(x0+a.x*kx,a.y*ky+yoffset);
  }
  //console.log(a);

});
context.strokeStyle = "purple";
context.stroke();
buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./out2.png', buffer);
kx=360;
ky=360;

function tri2xml(tr,id,type,color){
  let output = "";
  output += "\n<triangle id=\"triangle#"+id+"\" text=\"\" poly-type=\""+type+"\" bounciness=\"0\" texture=\"\">";
  output += "\n<vertex id=\"vertex#"+(id*3+0)+"\" text=\"\" x=\""+tr.v1.x*kx+"\" y=\""+tr.v1.y*ky+"\" u=\"0\" v=\"0\" color=\""+color+"\"/>";
  output += "\n<vertex id=\"vertex#"+(id*3+1)+"\" text=\"\" x=\""+tr.v2.x*kx+"\" y=\""+tr.v2.y*ky+"\" u=\"0\" v=\"0\" color=\""+color+"\"/>";
  output += "\n<vertex id=\"vertex#"+(id*3+2)+"\" text=\"\" x=\""+tr.v3.x*kx+"\" y=\""+tr.v3.y*ky+"\" u=\"0\" v=\"0\" color=\""+color+"\"/>";

  output += "\n</triangle>";

  return output;
}
let stream = fs.createWriteStream("output.txt", {flags: "w"});
i=0
tri.forEach((a)=>{
  if(i%2 == 0){
    stream.write(tri2xml(a,i,"deadly","#FFA500"));
  }else{
  stream.write(tri2xml(a,i,"deadly","#800080"));
}i++;
});


stream.end();



