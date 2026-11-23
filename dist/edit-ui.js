export function installEditor(){
const topbar=document.createElement('div');topbar.className='topbar';document.body.prepend(topbar);topbar.append(document.querySelector('header'),document.querySelector('#trees'));
const panel=document.querySelector('aside');document.body.insertBefore(document.querySelector('footer'),panel);
document.querySelector('.panel-head').append(document.querySelector('#tabs'));
const toggle=document.createElement('button');toggle.id='panel-toggle';toggle.textContent='收起挂饰';toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-controls','catalog');document.querySelector('.panel-head').append(toggle);
toggle.onclick=()=>{const collapsed=panel.classList.toggle('collapsed');toggle.textContent=collapsed?'展开挂饰':'收起挂饰';toggle.setAttribute('aria-expanded',String(!collapsed));};
const note=document.createElement('div');note.className='footer-note';document.querySelector('footer').append(note);note.append(document.querySelector('#hint'),document.querySelector('#saved'));document.querySelector('#hint').textContent='拖动旋转视角 · 点击挂饰编辑';
document.querySelector('#edit').innerHTML='<label>大小 <input aria-label="挂饰大小" id="size" type="range" min="0.6" max="1.8" step="0.1" value="1"></label><label>转向 <input aria-label="挂饰旋转角度" id="rotation" type="range" min="-90" max="90" step="5" value="0"></label><div class="edit-actions"><button id="move">移动位置</button><button id="duplicate">复制一件</button><button id="remove">移除</button></div>';
document.querySelector('#stage').title='滚轮或双指放大，最小为初始大小；拖动旋转';
const reset=document.createElement('button');reset.id='reset';reset.textContent='重置视角';document.querySelector('#orbit').after(reset);
}
