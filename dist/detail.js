import * as T from './vendor/three.module.js';

const textures=new Map();
function noiseTexture(kind){
 if(textures.has(kind))return textures.get(kind);
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
 let seed=218;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 x.fillStyle='#888';x.fillRect(0,0,256,256);
 for(let i=0;i<24000;i++){const a=random()*256,b=random()*256,v=Math.floor(70+random()*110);x.fillStyle=`rgb(${v},${v},${v})`;x.fillRect(a,b,kind==='wood'?random()*35+5:1,kind==='fabric'?3:1);}
 if(kind==='fabric')for(let i=0;i<256;i+=3){x.strokeStyle='#aaaaaa55';x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();}
 if(kind==='stone')for(let i=0;i<90;i++){x.fillStyle='#55555533';x.beginPath();x.ellipse(random()*256,random()*256,random()*18,random()*10,random()*3,0,7);x.fill();}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;textures.set(kind,t);return t;
}
export function fabric(color,glitter=false){return new T.MeshPhysicalMaterial({color,roughness:glitter?.43:.92,metalness:glitter?.36:0,sheen:1,sheenColor:new T.Color(color).lerp(new T.Color('#fff0e5'),.5),sheenRoughness:.65,bumpMap:noiseTexture('fabric'),bumpScale:glitter?.025:.012,side:T.DoubleSide});}
export function finishRoom(scene){
 scene.traverse(o=>{if(!o.isMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){if(!m.isMeshStandardMaterial||m.map)continue;const p=o.position;if(p.z< -2.6&&p.x< -2.1){m.bumpMap=noiseTexture('stone');m.bumpScale=.09;}else if(p.y<.01){m.bumpMap=noiseTexture('wood');m.bumpScale=.025;}}});
 const rng=()=>Math.random();const snow=new T.BufferGeometry(),positions=[];for(let i=0;i<220;i++)positions.push(-2.5+rng()*7.5,.8+rng()*5,-3.7+rng()*.05);snow.setAttribute('position',new T.Float32BufferAttribute(positions,3));const points=new T.Points(snow,new T.PointsMaterial({color:'#ffffff',size:.025,transparent:true,opacity:.6}));scene.add(points);
 // Gifts with satin ribbon at the edge of the scene.
 const g=new T.Group();g.position.set(2.05,0,-.7);scene.add(g);for(let i=0;i<3;i++){const p=new T.Group();p.position.set((i%2)*.53,.24+Math.floor(i/2)*.46,0);g.add(p);const color=i===1?'#6a2030':'#bc9870';const m=new T.Mesh(new T.BoxGeometry(.48,.43,.46),new T.MeshStandardMaterial({color,bumpMap:noiseTexture('fabric'),bumpScale:.01}));p.add(m);for(const size of [[.065,.44,.47],[.49,.44,.065]]){const r=new T.Mesh(new T.BoxGeometry(...size),fabric(i===1?'#d8b984':'#7e2135'));p.add(r);}for(let s of [-1,1]){const b=new T.Mesh(new T.TorusGeometry(.095,.018,6,18),fabric('#9d3443'));b.position.set(s*.07,.245,0);b.rotation.x=1.2;b.scale.y=.55;p.add(b);}}
 return dt=>{const a=snow.attributes.position;for(let i=0;i<a.count;i++){a.array[i*3+1]-=dt*.11;if(a.array[i*3+1]<.8)a.array[i*3+1]=5.8;}a.needsUpdate=true;};
}

export function foliage(parent,index,random,radius){
 const capacity=150000,geo=new T.ConeGeometry(1,1,3);geo.translate(0,.5,0);
 const material=new T.MeshStandardMaterial({color:'#ffffff',roughness:.87});
 const inst=new T.InstancedMesh(geo,material,capacity);inst.castShadow=true;inst.receiveShadow=false;parent.add(inst);
 const d=new T.Object3D(),col=new T.Color(),axis=new T.Vector3(0,1,0),stems=[];let count=0;
 const put=(p,v,length,width,t)=>{if(count>=capacity)return;d.position.copy(p);d.quaternion.setFromUnitVectors(axis,v.normalize());d.scale.set(width,length,width);d.updateMatrix();inst.setMatrixAt(count,d.matrix);col.setHSL(index===1?.265:.285,.28+random()*.23,.055+random()*.09+t*.055);inst.setColorAt(count++,col);};
 for(let layer=0;layer<25;layer++){
  const y=.73+layer*.19,boughs=index===2?8:10;
  for(let b=0;b<boughs;b++){
   const a=b/boughs*Math.PI*2+layer*2.399+(random()-.5)*.32,rad=radius(y)*(.75+random()*.29),branchY=y+(random()-.5)*.2;
   const direction=new T.Vector3(Math.cos(a),0,Math.sin(a)),side=new T.Vector3(-Math.sin(a),0,Math.cos(a));
   let previous=new T.Vector3(0,branchY,0);
   for(let j=1;j<=14;j++){
    const t=j/14,width=(1-t*.87)*rad*.35;
    const center=direction.clone().multiplyScalar(t*rad);center.y=branchY+(index===1?-.29*t*t:.16*t*t)+Math.sin(t*Math.PI)*.09;
    stems.push(...previous.toArray(),...center.toArray());previous=center.clone();
    for(let sign of [-1,1]){
     const branchDir=direction.clone().multiplyScalar(.48).addScaledVector(side,sign*.85).normalize();
     for(let k=0;k<9;k++){
      const u=k/9,p=center.clone().addScaledVector(branchDir,u*width);p.y+=index===1?-.26*u*u:.07*u;
      for(let pair of [-1,1]){const v=direction.clone().multiplyScalar(.5).addScaledVector(side,sign*.25+pair*.55);v.y=index===1?-.55-random()*.4:.3+random()*.45;
       put(p,v,(index===1?.105:.08)+random()*.055,.005+random()*.0035,t);
      }
     }
    }
    put(center,direction.clone().add(new T.Vector3(0,.6,0)),.10,.006,t);
   }
  }
 }
 // A slender, irregular leader rather than a flat cut-off at the top.
 for(let j=0;j<20;j++){const y=5.15+j*.018;for(let k=0;k<7;k++){const a=k*2.399+j;put(new T.Vector3(0,y,0),new T.Vector3(Math.cos(a),1.5,Math.sin(a)),.07+(5.5-y)*.22,.004,1);}}
 const stemGeo=new T.BufferGeometry();stemGeo.setAttribute('position',new T.Float32BufferAttribute(stems,3));parent.add(new T.LineSegments(stemGeo,new T.LineBasicMaterial({color:'#554630'})));
 inst.count=count;inst.instanceMatrix.needsUpdate=true;if(inst.instanceColor)inst.instanceColor.needsUpdate=true;inst.computeBoundingSphere();return inst;
}

export function bowGeometry(parent,color,long,glitter){
 const m=fabric(color,glitter),rows=24,cols=16;
 function surface(fn){const p=[],uv=[],idx=[];for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){p.push(...fn(i/rows,j/cols));uv.push(j/cols,i/rows);}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){let a=i*(cols+1)+j;idx.push(a,a+1,a+cols+1,a+1,a+cols+2,a+cols+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const o=new T.Mesh(g,m);o.castShadow=true;parent.add(o);}
 for(let sign of [-1,1]){
  surface((u,v)=>{const spread=Math.sin(u*Math.PI*.8),w=.035+.19*spread;return [sign*(.045+u*.43),(v-.5)*w*2+.04*Math.sin(u*3),.04+Math.sin(u*Math.PI)*.15+Math.cos(v*6*Math.PI)*.015*spread];});
  surface((u,v)=>[sign*(.05+u*.22)+(v-.5)*(long?.105:.19),-.04-u*(long?.95:.5),.045+Math.sin(u*8)*.035+Math.sin(v*3.14)*.025]);
 }
 const knot=new T.Mesh(new T.SphereGeometry(1,18,14),m);knot.scale.set(.085,.11,.085);knot.position.z=.07;parent.add(knot);
}

