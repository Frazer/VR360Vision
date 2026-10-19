// Dependency-free simulation checks; run with node test.cjs.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();const gradient={addColorStop(){}};const ctx=new Proxy({}, {get:(_,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>gradient:()=>{}});
function element(id){if(!elements.has(id))elements.set(id,{value:'',disabled:false,textContent:'',setAttribute(){},addEventListener(){},getContext:()=>ctx});return elements.get(id);}
const sandbox={console,Math,Float32Array,isSecureContext:true,navigator:{},document:{querySelector:element,addEventListener(){}},window:{},requestAnimationFrame(){}};
vm.createContext(sandbox);const source=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInContext(source+`;this.api={state,settings,trees,robots,start,pause,update,draw,project,mapAngle,spawnBall,hit,pointAt,multiply,robotPosition};`,sandbox);const a=sandbox.api;
for(const mode of ['uniform','forward','rear']){a.settings.mode=mode;assert.equal(a.mapAngle(0),0);assert.ok(Math.abs(a.mapAngle(Math.PI)-1)<1e-10);let prev=-2;for(let i=-100;i<=100;i++){const n=a.mapAngle(i*Math.PI/100);assert.ok(n>prev);prev=n;}}
a.start();a.update(.1);assert.equal(a.state.balls.length,1);a.pause();const elapsed=a.state.elapsed;a.update(2);assert.equal(a.state.elapsed,elapsed);a.pause();
a.state.balls=[{x:.7,y:1.6,z:-.5}];const p=a.project(.7,1.6,-.5);assert.equal(a.hit(p.x,p.y),true);assert.equal(a.state.score,10);assert.equal(a.state.streak,1);assert.equal(a.state.balls.length,0);
a.state.balls=[{x:0,y:1.6,z:-5}];assert.equal(a.hit(720,413),false);
a.state.balls=[{x:0,y:1.6,z:1}];const back=a.project(0,1.6,1);assert.equal(a.hit(back.x===0?1440:0,back.y),true);
a.state.balls=[{x:0,z:3.1,y:1.6,vx:0,vz:1,passed:true}];a.state.spawn=100;a.update(.01);assert.equal(a.state.missed,1);assert.equal(a.state.streak,0);
let bypass=0;for(let i=0;i<500;i++){a.spawnBall();const b=a.state.balls.pop();const speed=Math.hypot(b.vx,b.vz),offset=Math.abs(b.x*b.vz-b.z*b.vx)/speed;if(offset>=.5&&offset<=1.3)bypass++;}assert.ok(bypass>300);
a.settings.session='challenge';a.start();a.update(60);assert.equal(a.state.running,false);a.settings.session='practice';a.start();a.update(60);assert.equal(a.state.running,true);
assert.equal(a.trees.length,32);assert.equal(a.robots.length,4);const pos=a.robotPosition(a.robots[0]);a.state.time+=5;assert.notEqual(a.robotPosition(a.robots[0]).x,pos.x);a.draw();
const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);const viewer={transform:{inverse:{matrix:identity}}};let ray=identity;const frame={getPose:()=>({transform:{matrix:ray}})};const point=a.pointAt(frame,{targetRaySpace:{}},viewer);assert.equal(point.x,720);assert.equal(point.y,405);ray=new Float32Array(identity);ray[12]=.9;assert.ok(Math.abs(a.pointAt(frame,{targetRaySpace:{}},viewer).x-1080)<.001);ray[12]=3;assert.equal(a.pointAt(frame,{targetRaySpace:{}},viewer),null);
console.log('PASS: mappings, catch/reach/seam, scoring, pause, misses, trajectories, session timer, scenery animation, render, XR controller projection.');
