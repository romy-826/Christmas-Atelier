import * as T from './vendor/three.module.js';
import {OrbitControls} from './vendor/controls/OrbitControls.js';
import {foliage,fabric,bowGeometry,finishRoom} from './detail.js';
import {installEditor} from './edit-ui.js';
installEditor();
const $=s=>document.querySelector(s), scene=new T.Scene();scene.background=new T.Color('#514236');scene.fog=new T.Fog('#746251',18,40);
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;$('#stage').append(renderer.domElement);
const camera=new T.PerspectiveCamera(40,1,.1,80),controls=new OrbitControls(camera,renderer.domElement);camera.position.set(0,3.4,10.8);controls.target.set(0,2.5,0);controls.enableDamping=true;controls.enableZoom=true;controls.zoomSpeed=.65;controls.minDistance=6;controls.maxDistance=12;controls.maxPolarAngle=1.441;controls.minPolarAngle=1.441;controls.maxAzimuthAngle=1.15;controls.minAzimuthAngle=-1.15;controls.enablePan=false;
const mat=(c,rough=.7,metal=0)=>new T.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});
const green=mat('#193c27'),wood=mat('#715035'),gold=mat('#bc8a35',.25,.75),white=mat('#eee5cf');
function mesh(geo,m,parent=scene,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
const sph=new T.SphereGeometry(1,20,14),box=new T.BoxGeometry(1,1,1);
function ball(p,m,x,y,z,sx,sy=sx,sz=sx){const o=mesh(sph,m,p,x,y,z);o.scale.set(sx,sy,sz);return o}
function cube(p,m,x,y,z,sx,sy,sz){const o=mesh(box,m,p,x,y,z);o.scale.set(sx,sy,sz);return o}
function rod(p,a,b,r,m){const d=b.clone().sub(a),o=mesh(new T.CylinderGeometry(r*.6,r,d.length(),5),m,p);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
function tube(p,points,r,m){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),24,r,6,false),m,p)}
scene.add(new T.HemisphereLight('#dce8ee','#7d5737',2));const key=new T.DirectionalLight('#ffe2aa',3);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-7,right:7,top:9,bottom:-5});key.shadow.bias=-.001;scene.add(key);const windowLight=new T.DirectionalLight('#c1e0ff',2.2);windowLight.position.set(3,5,-4);scene.add(windowLight);
// A small winter room, built as geometry so the camera can move around the tree.
cube(scene,mat('#927052'),0,-.13,0,22,.2,20);for(let i=0;i<32;i++)cube(scene,mat(i%2?'#836245':'#9a7755'),(i%16-8)*.7,-.02,Math.floor(i/16)*8-3,.68,.04,8);
cube(scene,mat('#897560'),0,3.5,-4,20,7,.15);cube(scene,mat('#8d7963'),-6,3.5,0,.2,7,10);
const snowMat=mat('#d7e2e4');cube(scene,snowMat,1.3,3.25,-3.87,7.8,4.9,.05);
const winter=new T.Group();scene.add(winter);for(let i=0;i<18;i++){let x=-2.2+i*.42;rod(winter,new T.Vector3(x,.9,-3.79),new T.Vector3(x+Math.sin(i)*.3,5.6,-3.79),.018,mat('#8c9d9c'));for(let j=0;j<4;j++)rod(winter,new T.Vector3(x,2+j*.7,-3.78),new T.Vector3(x+(j%2?.6:-.6),2.6+j*.7,-3.78),.008,mat('#9caeac'));}
const frame=mat('#e9ddc7');for(let x of [-2.7,1.2,5.1])cube(scene,frame,x,3.25,-3.65,.13,5.2,.22);for(let y of [.65,3,5.85])cube(scene,frame,1.2,y,-3.65,7.95,.13,.22);for(let x of [-.75,3.15])cube(scene,frame,x,3.25,-3.65,.06,5.1,.12);
const stoneColors=['#77614b','#8a735a','#6a5847','#94816a'];for(let row=0;row<11;row++)for(let col=0;col<4;col++){if(row<4&&col>0&&col<3)continue;let o=cube(scene,mat(stoneColors[(row*3+col)%4]),-4.25+col*.55+(row%2)*.08,.28+row*.51,-3.25,.53,.47,.55);o.rotation.z=Math.sin(row+col)*.05;}cube(scene,mat('#a38b6a'),-3.4,2.45,-3,2.8,.18,1);cube(scene,mat('#403323'),-3.4,.07,-2.8,2.9,.15,1.5);cube(scene,mat('#241d19'),-3.4,1,-3.48,1.25,1.8,.1);
const fire=new T.Group();scene.add(fire);const flame= new T.MeshBasicMaterial({color:'#ffc56c'});for(let i=0;i<9;i++)ball(fire,flame,-3.85+i*.11,.35+(i%3)*.12,-3.1,.07,.3+(i%3)*.1,.055);const glow=new T.PointLight('#ff9b33',8,6);glow.position.set(-3.4,1,-2.6);scene.add(glow);
for(let i=0;i<25;i++)ball(scene,green,-4.65+i*.1,2.6+Math.sin(i*.4)*.05,-2.9,.14,.1,.12);
// Woven vintage rug.
const rugCanvas=document.createElement('canvas');rugCanvas.width=rugCanvas.height=512;const rc=rugCanvas.getContext('2d');rc.fillStyle='#aa9275';rc.fillRect(0,0,512,512);for(let k=0;k<7;k++){rc.strokeStyle=k%2?'#675344':'#d3bea0';rc.lineWidth=3;rc.strokeRect(12+k*6,12+k*6,488-k*12,488-k*12);}for(let y=55;y<460;y+=28)for(let x=55;x<460;x+=28){rc.strokeStyle=(x+y)%3?'#88705a':'#c6b391';rc.beginPath();rc.moveTo(x,y-9);rc.lineTo(x+9,y);rc.lineTo(x,y+9);rc.lineTo(x-9,y);rc.closePath();rc.stroke();}const rug=mesh(new T.PlaneGeometry(7,5),new T.MeshStandardMaterial({map:new T.CanvasTexture(rugCanvas),roughness:1}),scene,0,.015,1);rug.rotation.x=-Math.PI/2;
const treeGroup=new T.Group();scene.add(treeGroup);const decor=new T.Group();scene.add(decor);let treeIndex=0,lit=true,selected=null,choice=null,undoStack=[],states=[[],[],[]];
const lightsMat=new T.MeshStandardMaterial({color:'#ffe4a1',emissive:'#ffc35d',emissiveIntensity:5});
const selectionBox=new T.Box3Helper(new T.Box3(),0xf5cd83);scene.add(selectionBox);selectionBox.visible=false;let moving=null;
function markSelection(o){if($('aside').classList.contains('collapsed'))$('#panel-toggle').click();selected=o;selectionBox.box.setFromObject(o);selectionBox.visible=true;$('#rotation').value=Math.round((o.userData.data.roll||0)*180/Math.PI);}
function seeded(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}};
function disposeGroup(g){const geometries=new Set(),materials=new Set();g.traverse(o=>{if(o.geometry&&o.geometry!==sph&&o.geometry!==box)geometries.add(o.geometry);if(o.material)for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(![green,wood,gold,white,lightsMat].includes(m))materials.add(m);});g.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
function treeRadius(y){return Math.max(.07,(5.4-y)/4.7*(treeIndex===2?1.48:1.65));}
function buildTree(){moving=null;disposeGroup(treeGroup);const rng=seeded(22+treeIndex*17);mesh(new T.CylinderGeometry(.065,.16,4.8,9),wood,treeGroup,0,2.7,0);
 foliage(treeGroup,treeIndex,rng,treeRadius);const dummy=new T.Object3D();
 const bulbs=new T.InstancedMesh(new T.SphereGeometry(.018,6,5),lightsMat,200);treeGroup.add(bulbs);for(let i=0;i<200;i++){const y=.7+i/200*4.55,a=i*.51,r=treeRadius(y)*.93;dummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r);dummy.scale.setScalar(1);dummy.quaternion.identity();dummy.updateMatrix();bulbs.setMatrixAt(i,dummy.matrix);}bulbs.visible=lit;bulbs.name='bulbs';
 const wirePoints=[];for(let i=0;i<=320;i++){const y=.76+i/320*4.4,a=i/320*200*.51,r=treeRadius(y)*.94;wirePoints.push(new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r));}
 mesh(new T.TubeGeometry(new T.CatmullRomCurve3(wirePoints),420,.005,3,false),mat('#6b6133'),treeGroup);

 if(treeIndex===2){
  const fur=fabric('#ede5d6');mesh(new T.CylinderGeometry(1.12,1.27,.12,64),fur,treeGroup,0,.09,0);
  const tufts=new T.InstancedMesh(new T.ConeGeometry(1,1,3),fur,6500);const d=new T.Object3D();
  for(let i=0;i<6500;i++){const a=rng()*Math.PI*2,r=Math.sqrt(rng())*1.28;d.position.set(Math.cos(a)*r,.14+.04*Math.sin(r*17+a*5),Math.sin(a)*r);d.rotation.set((rng()-.5)*1.5,a,(rng()-.5)*1.5);d.scale.set(.008,.07+rng()*.1,.009);d.updateMatrix();tufts.setMatrixAt(i,d.matrix);}tufts.castShadow=true;tufts.receiveShadow=true;treeGroup.add(tufts);
 }else{
  mesh(new T.CylinderGeometry(.61,.79,.51,48,1,true),mat('#3e3024'),treeGroup,0,.28,0);
  const weaveMat=mat('#8b6946');for(let row=0;row<22;row++){const pts=[];const y=.035+row*.024,r=.79-y*.34;for(let j=0;j<=240;j++){const a=j/240*Math.PI*2,rr=r+.013*Math.sin(a*40+(row%2)*Math.PI);pts.push(new T.Vector3(Math.cos(a)*rr,y,Math.sin(a)*rr));}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),240,.012,4,false),weaveMat,treeGroup);}
  for(let i=0;i<40;i++){const a=i/40*Math.PI*2;rod(treeGroup,new T.Vector3(Math.cos(a)*.8,.03,Math.sin(a)*.8),new T.Vector3(Math.cos(a)*.61,.56,Math.sin(a)*.61),.013,wood);}
 }

 rebuildDecor();}
// Ornaments are separate 3D meshes, attached to the tree in world coordinates.
const items=[
 ['pinkBow','闪粉大蝴蝶结','蝴蝶结','bow','#c87c91'],['smallBow','闪粉小蝴蝶结','蝴蝶结','bow','#d995ac'],['ribbon','粉色长尾缎带','蝴蝶结','ribbon','#edb5c6'],['ivoryRibbon','奶白长尾缎带','蝴蝶结','ribbon','#f4e5c8'],['redBow','酒红丝绒蝴蝶结','蝴蝶结','bow','#740f29'],
 ['pink','柔粉小球','小球','ball','#e9b7c8'],['ivory','珍珠白球','小球','ball','#f0e8dc'],['pinkRib','粉色条纹球','小球','rib','#dca1b5'],['ivoryRib','奶白条纹球','小球','rib','#e8d9b6'],['gold','金色玻璃球','小球','ball','#c39935'],['red','经典红球','小球','ball','#a51d30'],['silver','银色小球','小球','ball','#c4d0d0'],['leaf','金叶玻璃球','小球','leaf','#ead7a0'],
 ['pineSnow','覆雪松果','自然','pine','#6c4225'],['pineBow','奶白蝴蝶结松果','自然','pineBow','#754725'],['pineDouble','双生松果','自然','doublePine','#936331'],['pineRed','红缎带松果','自然','pineRed','#6d4027'],
 ['ginger','姜饼人','趣味','ginger','#bc813e'],['star','金色空心星','趣味','star','#c29b38'],['heart','丝绒爱心','趣味','heart','#a21e37'],['candy','拐杖糖','趣味','candy','#efdfcc'],['record','复古唱片机','趣味','record','#792737'],['mail','圣诞信箱','趣味','mail','#b75159'],['bird','小鸟邮差','趣味','bird','#664630'],['wardrobe','圣诞小衣橱','趣味','wardrobe','#ae784a'],
 ['santa','针织圣诞老人','玩偶','santa','#b82d37'],['holly','冬青浆果','玩偶','holly','#b22b3b'],['snowman','围巾雪人','玩偶','snowman','#f4eee0'],['penguin','蓝围巾企鹅','玩偶','penguin','#34424b'],['bear','红围巾小熊','玩偶','bear','#b18b5c'],['polar','格纹北极熊','玩偶','bear','#eee6d3'],['rabbit','圣诞垂耳兔','玩偶','rabbit','#b6a59a']
 ];const byId=Object.fromEntries(items.map(i=>[i[0],i]));
function bow(g,c,long=false){bowGeometry(g,c,long,c==='#c87c91'||c==='#d995ac');}
function makeOrnament(id){const item=byId[id]||items[0],type=item[3],c=item[4],g=new T.Group(),m=mat(c,type==='ball'?.24:.85,type==='ball'?.35:0),cream=mat('#f6ebd5'),dark=mat('#251f1d'),red=mat('#a51c37');
 if(type==='bow'||type==='ribbon'){bow(g,c,type==='ribbon'||id==='redBow');if(id==='smallBow')g.scale.setScalar(.7);}
 else if(['ball','rib','leaf'].includes(type)){const gm=new T.SphereGeometry(.29,48,32);if(type==='rib'){const p=gm.attributes.position;for(let k=0;k<p.count;k++){const x=p.getX(k),z=p.getZ(k),factor=1+.055*Math.cos(Math.atan2(z,x)*12);p.setXYZ(k,x*factor,p.getY(k),z*factor);}gm.computeVertexNormals();}const surface=type==='rib'||id==='pink'||id==='ivory'?fabric(c):new T.MeshPhysicalMaterial({color:c,roughness:.16,metalness:.55,clearcoat:1,clearcoatRoughness:.12});mesh(gm,surface,g,0,-.05,0);mesh(new T.CylinderGeometry(.055,.065,.07,12),gold,g,0,.26,0);if(type==='leaf'){for(let i=0;i<10;i++){let a=i*2.4,y=(i/10-.5)*.42,r=Math.sqrt(.29*.29-y*y);let o=ball(g,gold,Math.cos(a)*r,y-.05,Math.sin(a)*r,.045,.09,.008);o.rotation.y=-a+Math.PI/2;o.rotation.z=.5;}}}
 else if(type.startsWith('pine')||type==='doublePine'){const cone=(x,s)=>{const p=new T.Group();p.position.x=x;p.scale.setScalar(s);g.add(p);ball(p,m,0,-.17,0,.19,.34,.19);for(let row=0;row<7;row++)for(let j=0;j<7;j++){const a=j/7*6.28+row*.4,r=.18*Math.sin((row+1)/8*Math.PI);let o=ball(p,m,Math.cos(a)*r,.07-row*.075,Math.sin(a)*r,.09,.035,.065);o.rotation.y=-a;if(type==='pine'||type==='pineRed')ball(p,cream,Math.cos(a)*r,.09-row*.075,Math.sin(a)*r,.07,.012,.04);}};if(type==='doublePine'){cone(-.16,.8);cone(.16,.8)}else cone(0,1);for(let i=0;i<6;i++)ball(g,green,(i-2.5)*.07,.16,0,.12,.025,.06);if(type==='pineBow'||type==='pineRed'){let b=new T.Group();g.add(b);b.position.y=.18;b.scale.setScalar(.45);bow(b,type==='pineRed'?'#9f2034':'#eee3cd');}else for(let i=0;i<3;i++)ball(g,red,(i-1)*.08,.2,.07,.045);}
 else if(type==='star'){let p=[];for(let i=0;i<=10;i++){let a=i/10*Math.PI*2+Math.PI/2,r=i%2?.18:.37;p.push([Math.cos(a)*r,Math.sin(a)*r,0]);}tube(g,p,.022,gold);}
 else if(type==='heart'){const sh=new T.Shape();sh.moveTo(0,-.34);sh.bezierCurveTo(-.7,.1,-.3,.5,0,.18);sh.bezierCurveTo(.3,.5,.7,.1,0,-.34);mesh(new T.ExtrudeGeometry(sh,{depth:.09,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3,steps:1}),m,g);}
 else if(type==='candy'){let pts=[[0,-.45,0],[0,.15,0],[.02,.34,0],[.2,.42,0],[.34,.3,0],[.34,.17,0]];tube(g,pts,.065,cream);for(let i=0;i<5;i++){let o=mesh(new T.TorusGeometry(.066,.014,5,12),red,g,0,-.37+i*.13,0);o.rotation.x=Math.PI/2;}}
 else if(type==='record'){cube(g,m,0,-.15,0,.65,.16,.43);let lid=cube(g,m,0,.15,-.21,.65,.47,.05);lid.rotation.x=-.15;cube(g,mat('#254b3a'),0,.15,-.172,.55,.37,.01);let d=mesh(new T.CylinderGeometry(.22,.22,.018,32),dark,g,0,-.05,0);mesh(new T.CylinderGeometry(.065,.065,.02,20),gold,g,0,-.035,0);rod(g,new T.Vector3(.27,.01,-.15),new T.Vector3(.1,.01,.1),.012,gold);}
 else if(type==='mail'||type==='wardrobe'){cube(g,m,0,0,0,.46,.59,.21);cube(g,cream,0,.1,.12,.28,.15,.02);cube(g,red,0,-.08,.12,.26,.08,.02);if(type==='wardrobe'){cube(g,m,-.31,0,.08,.17,.6,.1).rotation.y=-.5;cube(g,m,.31,0,.08,.17,.6,.1).rotation.y=.5;}}
 else if(type==='holly'){for(let i=0;i<5;i++){let a=i*1.25;let l=ball(g,green,Math.cos(a)*.22,Math.sin(a)*.2,-.06,.13,.24,.035);l.rotation.z=-a;}for(let i=0;i<3;i++)ball(g,red,(i-1)*.16,i===1?.12:-.08,.04,.16);}
 else {let ginger=type==='ginger',rabbit=type==='rabbit',snow=type==='snowman',santa=type==='santa',peng=type==='penguin',bird=type==='bird';ball(g,m,0,-.15,0,.2,.27,.14);ball(g,m,0,.19,0,.2,.19,.16);if(peng||bird)ball(g,cream,0,-.14,.1,.15,.21,.07);if(snow){ball(g,m,0,-.17,0,.24);ball(g,mat('#c87728'),0,.19,.2,.05,.04,.09);}if(!snow&&!bird){for(let s of [-1,1]){ball(g,m,s*.16,-.4,0,.09,.14,.09);let arm=ball(g,m,s*.26,-.09,0,.09,.2,.09);arm.rotation.z=s*.7;if(!ginger&&!santa&&!peng)ball(g,m,s*.15,rabbit?.05:.34,-.01,rabbit?.065:.08,rabbit?.3:.08,.07);}}for(let s of [-1,1])ball(g,dark,s*.07,.23,.148,.018);if(!snow)ball(g,santa?red:dark,0,.15,.17,.027);if(!ginger&&!bird){const scarf=mesh(new T.TorusGeometry(.15,.037,6,20),mat(peng?'#66899e':'#8a2438'),g,0,.02,0);scarf.rotation.x=Math.PI/2;cube(g,scarf.material,.09,-.08,.15,.07,.23,.03);}if(santa){ball(g,cream,0,.07,.13,.19,.15,.09);mesh(new T.ConeGeometry(.2,.4,16),red,g,0,.5,0);ball(g,cream,0,.7,0,.055);}if(rabbit){mesh(new T.ConeGeometry(.16,.32,16),red,g,0,.49,0);ball(g,cream,0,.65,0,.05);}if(ginger){for(let y of [-.1,-.22])ball(g,cream,0,y,.14,.022);const b=new T.Group();g.add(b);b.position.set(0,.01,.16);b.scale.setScalar(.18);bow(b,'#aa2636');}}
 const loop=mesh(new T.TorusGeometry(.055,.008,5,18),gold,g,0,type==='bow'||type==='ribbon'?.25:.43,0);g.userData.kind=id;return g;}
function save(){try{localStorage.setItem('christmas-atelier-v1',JSON.stringify({states,treeIndex,lit}));$('#saved').textContent='已自动保存 · 下次打开继续装饰';}catch{$('#saved').textContent='浏览器无法保存，请保留当前页面';}}
function snapshot(){undoStack.push(JSON.stringify({states,treeIndex}));if(undoStack.length>40)undoStack.shift();}
function rebuildDecor(){moving=null;disposeGroup(decor);selectionBox.visible=false;for(const data of states[treeIndex]){const o=makeOrnament(data.id);o.position.fromArray(data.p);o.rotation.y=data.a;o.rotation.z=data.roll||0;o.scale.multiplyScalar(.65*data.s);o.userData.data=data;decor.add(o);}selected=null;$('#edit').hidden=true;$('#count').textContent=states[treeIndex].length+' 件';}
function defaults(){return [0,1,2].map(t=>{let list=[];for(let i=0;i<7;i++){const y=1.1+i*.52,a=i*2.4,r=(5.4-y)/4.7*(t===2?1.48:1.65);list.push({id:t===2?'silver':t===1?'red':i%2?'red':'gold',p:[Math.sin(a)*r,y,Math.cos(a)*r],a,s:1});}if(t===1)list.push({id:'redBow',p:[0,4.8,.3],a:0,s:1.65});return list;});}
try{const saved=JSON.parse(localStorage.getItem('christmas-atelier-v1'));if(saved&&Array.isArray(saved.states)&&saved.states.length===3){states=saved.states.map(list=>Array.isArray(list)?list.filter(d=>byId[d.id]&&Array.isArray(d.p)&&d.p.length===3&&d.p.every(v=>Number.isFinite(v)&&Math.abs(v)<10)&&Number.isFinite(d.a)&&Number.isFinite(d.s)&&d.s>=.6&&d.s<=1.8&&(!('roll' in d)||Number.isFinite(d.roll))).slice(0,100):[]);treeIndex=[0,1,2].includes(saved.treeIndex)?saved.treeIndex:0;lit=saved.lit!==false;}else states=defaults();}catch{states=defaults();}
const thumbRenderer=new T.WebGLRenderer({antialias:true,alpha:true});thumbRenderer.setSize(160,130);thumbRenderer.setPixelRatio(1);thumbRenderer.toneMapping=T.ACESFilmicToneMapping;const thumbScene=new T.Scene();thumbScene.add(new T.HemisphereLight('#fff5df','#725c4c',3));const tl=new T.DirectionalLight('#fff',4);tl.position.set(-2,3,4);thumbScene.add(tl);const tc=new T.PerspectiveCamera(34,160/130,.1,10);tc.position.set(.2,.15,2.2);tc.lookAt(0,-.1,0);const thumbs={};for(const i of items){const o=makeOrnament(i[0]);thumbScene.add(o);thumbRenderer.render(thumbScene,tc);thumbs[i[0]]=thumbRenderer.domElement.toDataURL();thumbScene.remove(o);disposeGroup(o);}thumbRenderer.dispose();
function catalog(cat){$('#catalog').replaceChildren();for(const i of items.filter(i=>i[2]===cat)){const b=document.createElement('button');b.innerHTML='<img alt="" src="'+thumbs[i[0]]+'"><span>'+i[1]+'</span>';b.title='选择'+i[1];b.classList.toggle('active',choice===i[0]);b.onclick=()=>{choice=i[0];selected=null;$('#edit').hidden=true;$('#selection').textContent='已选择 '+i[1]+' · 点击树枝放置';$('#orbit').classList.remove('active');catalog(cat);};$('#catalog').append(b);}}
for(const cat of ['蝴蝶结','小球','自然','趣味','玩偶']){const b=document.createElement('button');b.textContent=cat;b.onclick=()=>{selected=null;moving=null;selectionBox.visible=false;$('#edit').hidden=true;$$('#tabs button').forEach(n=>n.classList.remove('active'));b.classList.add('active');catalog(cat)};$('#tabs').append(b);}function $$(s){return [...document.querySelectorAll(s)]}$('#tabs button').click();
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}
function browse(){moving=null;selected=null;selectionBox.visible=false;$('#edit').hidden=true;choice=null;$('#orbit').classList.add('active');$$('#catalog button').forEach(n=>n.classList.remove('active'));$('#selection').textContent='浏览模式 · 拖动旋转，点击已挂的饰品编辑';}$('#orbit').onclick=browse;
$$('[data-tree]').forEach(b=>b.onclick=()=>{treeIndex=+b.dataset.tree;buildTree();sync();save();toast('已切换树款，布置分别保存');});function sync(){$$('[data-tree]').forEach(b=>b.classList.toggle('active',+b.dataset.tree===treeIndex));$('#lights').textContent='灯光 · '+(lit?'开':'关');}
const ray=new T.Raycaster(),pointer=new T.Vector2();let down=null,multiTouch=false;const activePointers=new Set();renderer.domElement.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);down=null;});renderer.domElement.addEventListener('pointerdown',e=>{if(!activePointers.size)multiTouch=false;activePointers.add(e.pointerId);if(activePointers.size>1)multiTouch=true;down=[e.clientX,e.clientY];});renderer.domElement.addEventListener('pointerup',e=>{activePointers.delete(e.pointerId);if(multiTouch||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);
 if(!choice&&!moving){const hit=ray.intersectObjects(decor.children,true)[0];if(hit){let o=hit.object;while(o.parent!==decor)o=o.parent;markSelection(o);$('#edit').hidden=false;$('#size').value=o.userData.data.s;$('#selection').textContent='已选中 '+byId[o.userData.kind][1]+' · 可移动、旋转或移除';}return;}
 // Pick a cone envelope rather than every needle to keep placement responsive.
 const proxy=new T.Mesh(new T.ConeGeometry(treeRadius(.6),4.8,48),new T.MeshBasicMaterial({side:T.DoubleSide}));proxy.position.y=3;proxy.updateMatrixWorld();const hit=ray.intersectObject(proxy)[0];proxy.geometry.dispose();proxy.material.dispose();if(!hit){toast('点击圣诞树的枝叶区域挂上饰品');return;}const p=hit.point;if(p.y<.65||p.y>5.28)return;const a=Math.atan2(p.x,p.z),r2=treeRadius(p.y)+.08;p.x=Math.sin(a)*r2;p.z=Math.cos(a)*r2;if(!moving&&states[treeIndex].length>=100){toast('这棵树已挂满 100 件饰品');return;}snapshot();if(moving){moving.p=p.toArray();moving.a=a;moving=null;toast('已移动挂饰');}else states[treeIndex].push({id:choice,p:p.toArray(),a,s:1});rebuildDecor();save();});
$('#remove').onclick=()=>{if(!selected)return;snapshot();states[treeIndex]=states[treeIndex].filter(d=>d!==selected.userData.data);rebuildDecor();save();};$('#size').addEventListener('pointerdown',()=>snapshot());$('#size').oninput=()=>{if(!selected)return;selected.userData.data.s=+$('#size').value;const old=selected.userData.data;rebuildDecor();markSelection(decor.children.find(o=>o.userData.data===old));$('#edit').hidden=false;save();};$('#undo').onclick=()=>{if(!undoStack.length)return toast('暂时没有可撤销的操作');const s=JSON.parse(undoStack.pop());states=s.states;treeIndex=s.treeIndex;buildTree();sync();save();};$('#clear').onclick=()=>{if(!states[treeIndex].length)return;snapshot();states[treeIndex]=[];rebuildDecor();save();toast('已清空当前树的挂饰，可以撤销');};$('#lights').onclick=()=>{lit=!lit;treeGroup.getObjectByName('bulbs').visible=lit;sync();save();};$('#photo').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='我的圣诞树.png';a.href=renderer.domElement.toDataURL('image/png');a.click();toast('已生成圣诞树照片');};window.addEventListener('keydown',e=>{if(e.key==='Escape')browse();if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();$('#undo').click();}if(e.key==='Delete'&&selected&&!['INPUT','TEXTAREA'].includes(e.target.tagName))$('#remove').click();});
const animateRoom=finishRoom(scene);
// Reference-matched painted environment behind independently movable 3D assets.
scene.background=null;scene.fog=null;$('#stage').style.background='url(assets/winter-room.png) center bottom / cover';
for(const o of scene.children){if(o.isMesh||o.isPoints||(o.isGroup&&o!==treeGroup&&o!==decor))o.visible=false;}
const shadow=mesh(new T.PlaneGeometry(12,10),new T.ShadowMaterial({opacity:.21}),scene,0,.015,0);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
scene.children.filter(o=>o.isHemisphereLight).forEach(o=>o.intensity=.9);key.intensity=2.2;windowLight.intensity=1.2;
new T.TextureLoader().load('assets/winter-room.png',texture=>{texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;scene.environment=texture;scene.environmentIntensity=.35;});
$('#move').onclick=()=>{if(!selected)return;moving=selected.userData.data;choice=null;$('#selection').textContent='点击树枝上的新位置，移动当前挂饰';};
$('#duplicate').onclick=()=>{if(!selected)return;choice=selected.userData.kind;moving=null;$('#selection').textContent='点击树枝，再挂一件 '+byId[choice][1];};
$('#rotation').addEventListener('pointerdown',snapshot);$('#rotation').addEventListener('keydown',e=>{if(e.key.startsWith('Arrow'))snapshot();});$('#size').addEventListener('keydown',e=>{if(e.key.startsWith('Arrow'))snapshot();});
$('#rotation').oninput=()=>{if(!selected)return;selected.userData.data.roll=+$('#rotation').value*Math.PI/180;selected.rotation.z=selected.userData.data.roll;selectionBox.box.setFromObject(selected);save();};
$('#reset').onclick=()=>{camera.position.set(0,3.4,10.8);controls.target.set(0,2.5,0);controls.update();};
const browseOriginal=$('#orbit').onclick;$('#orbit').onclick=()=>{moving=null;selectionBox.visible=false;browseOriginal();};
$('#catalog').addEventListener('click',()=>{moving=null;selectionBox.visible=false;});
const photoBackground=new Image();photoBackground.src='assets/winter-room.png';
$('#photo').onclick=async()=>{try{await photoBackground.decode();const wasVisible=selectionBox.visible;selectionBox.visible=false;renderer.render(scene,camera);const c=document.createElement('canvas');c.width=renderer.domElement.width;c.height=renderer.domElement.height;const x=c.getContext('2d'),scale=Math.max(c.width/photoBackground.width,c.height/photoBackground.height),w=photoBackground.width*scale,h=photoBackground.height*scale;x.drawImage(photoBackground,(c.width-w)/2,c.height-h,w,h);x.drawImage(renderer.domElement,0,0);selectionBox.visible=wasVisible;const a=document.createElement('a');a.download='我的圣诞树.png';a.href=c.toDataURL('image/png');a.click();toast('已保存含客厅背景的圣诞树照片');}catch{toast('照片生成失败，请稍后重试');}};
window.addEventListener('keydown',e=>{if(e.key==='Escape'){moving=null;selectionBox.visible=false;}});
// Keep the same pixel scale when the collection drawer opens, closes or edits.
function resetView(){controls.target.set(0,2.7,0);camera.position.set(0,4.25,11.899);controls.update();}
$('#reset').onclick=()=>{resetView();resize();};
function resize(){
 const stage=$('#stage'),w=stage.clientWidth,h=Math.max(1,stage.clientHeight);
 // Use the fully expanded drawer as the stable size budget. Editing replaces
 // the catalog, so selecting an ornament does not steal scene height.
 const panelHeight=innerWidth<=600?98:70;
 const available=Math.max(60,innerHeight-$('.topbar').offsetHeight-$('footer').offsetHeight-panelHeight);
 camera.updateMatrixWorld();
 const reference=camera.clone();reference.position.copy(camera.position).sub(controls.target).setLength(12).add(controls.target);reference.updateMatrixWorld();
 let top=-Infinity,bottom=Infinity,left=Infinity,right=-Infinity;
 for(const [y,r] of [[0,1.3],[.6,1.9],[1.6,1.6],[3,1.1],[4.6,.6],[5.65,.12]]){
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2,v=new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r).applyMatrix4(reference.matrixWorldInverse);const px=v.x/-v.z,py=v.y/-v.z;top=Math.max(top,py);bottom=Math.min(bottom,py);left=Math.min(left,px);right=Math.max(right,px);}
 }
 const scale=Math.min((available-16)/(top-bottom),w*.95/(right-left));
 renderer.setSize(w,h);camera.aspect=w/h;camera.clearViewOffset();camera.fov=2*Math.atan(h/(2*scale))*180/Math.PI;
 // Anchor the lowest base point to the floor, with only 8px clearance.
 let groundBottom=Infinity;
 for(let i=0;i<48;i++){const a=i/48*Math.PI*2,v=new T.Vector3(Math.cos(a)*1.3,0,Math.sin(a)*1.3).applyMatrix4(camera.matrixWorldInverse);groundBottom=Math.min(groundBottom,v.y/-v.z);}
 const defaultBottom=h/2-groundBottom*scale;
 camera.setViewOffset(w,h,0,defaultBottom-(h-8),w,h);camera.updateProjectionMatrix();
}

resetView();controls.addEventListener('change',resize);new ResizeObserver(resize).observe($('#stage'));window.addEventListener('resize',resize);resize();buildTree();sync();$('#loading').style.display='none';let time=0,last=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.06);last=now;time+=dt;controls.update();if(selected&&selectionBox.visible)selectionBox.box.setFromObject(selected);animateRoom(dt);glow.intensity=7+Math.sin(time*5)*.6;fire.scale.y=1+Math.sin(time*4)*.06;renderer.render(scene,camera);});
window.addEventListener('error',()=>{$('#loading').textContent='场景加载遇到问题，请刷新重试。';});
export {camera,controls,treeGroup,decor,states,renderer};


