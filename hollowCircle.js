const fs = require('fs');
const { createCanvas, loadImage} = require('canvas');
const cos = Math.cos.bind(null);
const sin = Math.sin.bind(null);
const sqrt = (a)=>{return Math.pow(a,0.5);};
const sqr = (a)=>{return Math.pow(a,2);};
const cos2 = (a)=>{return Math.pow(cos(a),2);};
const sin2 = (a)=>{return Math.pow(cos(a),2);};
const pi = Math.PI ;
let width = 1000;
let height = 1000;
let radius = 300;
let thickness = 100;
let centerX = width/2;
let centerY = height/2;
let vertices = 30; // INPUT: the desired number of vertices on the main circle
let mV_A = []; //the angles
let mV = [];
let mTriangles=[];
let sTriangles=[];
for(let i = 0; i < vertices ; i++){
mV_A.push((2*pi/vertices)*i);
}
function vtx(x,y){
  this.x = x;
  this.y = y;
}
function triangle(v1,v2,v3){
  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;
}
//NOW the main vertices will be plotted
let canvas = createCanvas(width, height);
let context = canvas.getContext('2d');
mV_A.forEach((a)=>{
let vX= centerX + cos(a)*radius;
let vY= centerY + sin(a)*radius;
let vertex = new vtx(vX,vY);
context.fillRect(vX-3,vY-3,6,6);
mV.push(vertex);
});
for(let i = 0; i < mV.length; i++){
if(i>0){
  mX=(mV[i].x+mV[i-1].x)/2;
  mY=(mV[i].y+mV[i-1].y)/2;
  let cosine = (-centerX+mX)/sqrt(sqr(centerX-mX)+sqr(centerY-mY));
  let sine = (-centerY+mY)/sqrt(sqr(centerX-mX)+sqr(centerY-mY));
  vertex = new vtx(mX+thickness*cosine,mY+thickness*sine);
  mTriangles.push(new triangle(mV[i],mV[i-1],vertex) );
}
if(i==(mV.length-1)){
  mX=(mV[0].x+mV[i].x)/2;
  mY=(mV[0].y+mV[i].y)/2;
  let cosine = (-centerX+mX)/sqrt(sqr(centerX-mX)+sqr(centerY-mY));
  let sine = (-centerY+mY)/sqrt(sqr(centerX-mX)+sqr(centerY-mY));
  vertex = new vtx(mX+thickness*cosine,mY+thickness*sine);
  mTriangles.push(new triangle(mV[0],mV[i],vertex) );
}
}
//draw the main triangles
mTriangles.forEach((a)=>{
context.fillStyle = "orange";
context.beginPath();
  context.moveTo(a.v1.x,a.v1.y);
  context.lineTo(a.v2.x,a.v2.y);
  context.lineTo(a.v3.x,a.v3.y);
  context.closePath();
  context.fill();

});
//creates the secondary triangles now
for(let i = 0; i < mTriangles.length; i++){
cTri = mTriangles[i];
if(i == 0){
pTri = mTriangles[mTriangles.length - 1];
}else{
pTri = mTriangles[i-1];
}
sTriangles.push(new triangle(cTri.v3,pTri.v3,cTri.v2));
}
//draw the secondary triangles
sTriangles.forEach((a)=>{
context.fillStyle = "green";
context.beginPath();
  context.moveTo(a.v1.x,a.v1.y);
  context.lineTo(a.v2.x,a.v2.y);
  context.lineTo(a.v3.x,a.v3.y);
  context.closePath();
  context.fill();

});
//saves the png file
buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./hcout.png', buffer);

function fixHex(str){
if(str.length ==1){
return "0"+str;
}else{
return str;
}
}
function tri2xml(tr,id,type,color1,color2,color3){
  let output = "";
  output += "\n<triangle id=\"triangle#"+id+"\" text=\"\" poly-type=\""+type+"\" bounciness=\"0\" texture=\"\">";
  output += "\n<vertex id=\"vertex#"+(id*3+0)+"\" text=\"\" x=\""+tr.v1.x+"\" y=\""+tr.v1.y+"\" u=\"0\" v=\"0\" color=\""+color1+"\"/>";
  output += "\n<vertex id=\"vertex#"+(id*3+1)+"\" text=\"\" x=\""+tr.v2.x+"\" y=\""+tr.v2.y+"\" u=\"0\" v=\"0\" color=\""+color2+"\"/>";
  output += "\n<vertex id=\"vertex#"+(id*3+2)+"\" text=\"\" x=\""+tr.v3.x+"\" y=\""+tr.v3.y+"\" u=\"0\" v=\"0\" color=\""+color3+"\"/>";

  output += "\n</triangle>";

  return output;
}
function colorF(r=0,g,b){
this.r=r;
this.g=g;
this.b=b;
}
function c2s(c){
console.log(c);
let output = "#"+fixHex((Math.round(Number(c.r))).toString(16))+(fixHex(Math.round(Number(c.g)).toString(16)))+fixHex((Math.round(Number(c.b)).toString(16)));
console.log("output"+output);
return output;
//return "#000000";
}
console.log("teest"+c2s(new colorF(2,2,2)));
function gradient(color1,color2,step,divisions){
let st = step;
if(step > divisions){
st = divisions;
}
console.log("color1"+color1);
console.log("color2"+color2);
console.log("divisions"+divisions)
console.log("step"+step);
let red = Math.abs(color1.r+((color2.r-color1.r)/divisions)*st);
let green = Math.abs(color1.g+((color2.g-color1.g)/divisions)*st);
let blue = Math.abs(color1.b+((color2.b-color1.b)/divisions)*st);
console.log("red"+red);
console.log("green"+green);
console.log("blue"+blue);

return (new colorF(red,green,blue));
}
//
let stream = fs.createWriteStream("hollowC.polywonks", {flags: "w"});
stream.write("<map text=\"Untitled\" description=\"\" color-top=\"#1e1e1e\" color-bottom=\"#1e1e1e\" jet=\"0\" grenades=\"0\" medikits=\"0\" weather=\"none\" steps=\"hard-ground\">"+
"\n  <resources id=\"resources#0\" text=\"Resources\"/>"+
"\n  <layer id=\"layer#0\" text=\"Background Polygons\" type=\"polygons-back\"/>"+
"\n  <layer id=\"layer#1\" text=\"Background Scenery\" type=\"scenery-back\"/>"+
"\n  <layer id=\"layer#2\" text=\"Middle Scenery\" type=\"scenery-middle\"/>"+
"\n  <layer id=\"layer#3\" text=\"Front Polygons\" type=\"polygons-front\"/>");
let idcount = 0;
let c1 = new colorF(255,255,0);
let c2 = new colorF(0,0,255);
for(let i= 0; i < mTriangles.length;i++){
//stream.write(tri2xml(mTriangles[i],idcount,"normal",c2s(c1),c2s(c2),c2s(c1) ) );
stream.write(tri2xml(mTriangles[i],idcount,"normal",c2s(gradient(c1,c2,i+1,vertices)),c2s(gradient(c1,c2,i,vertices)),c2s(gradient(c1,c2,vertices-i,vertices))));
idcount++;
stream.write(tri2xml(sTriangles[i],idcount,"normal",c2s(gradient(c1,c2,vertices-i,vertices)),c2s(gradient(c1,c2,vertices-i+1,vertices)),c2s(gradient(c1,c2,i,vertices))));
idcount++;
}
stream.write("  <layer id=\"layer#4\" text=\"Front Scenery\" type=\"scenery-front\"/>"+
"\n  <layer id=\"layer#5\" text=\"Colliders\" type=\"colliders\"/>"+
"\n  <layer id=\"layer#6\" text=\"Waypoints\" type=\"waypoints\"/>"+
"\n  <layer id=\"layer#7\" text=\"Spawns\" type=\"spawns\"/>"+
"\n</map>");
stream.end();

