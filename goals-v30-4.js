/* v30.4 goals: additive data model, no changes to legacy starterGoals */
(function(){
'use strict';
const E=s=>document.querySelector(s), safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;',"'":'&#39;'}[c]));
function goals(){if(!Array.isArray(state.userGoals))state.userGoals=[];return state.userGoals}
function draw(){
 const root=E('#goalWorkspace');if(!root)return;
 const gs=goals(),active=gs.filter(g=>!g.completed),done=gs.filter(g=>g.completed);
 root.innerHTML='<div class="section-top"><h2>Мои цели</h2><button class="secondary" id="goalNew">＋ Цель</button></div><p class="hint">Большие результаты складываются из небольших шагов. Целей может быть сколько угодно — или ни одной.</p>'+
 (active.length?active.map(card).join(''):'<div class="empty">Пока нет целей. Добавь первую, когда будешь готов.</div>')+
 (done.length?'<details><summary>🏆 Достигнутые цели ('+done.length+')</summary>'+done.map(card).join('')+'</details>':'');
 root.querySelector('#goalNew').onclick=()=>edit();
 root.querySelectorAll('[data-goal-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.goalEdit));
 root.querySelectorAll('[data-goal-step]').forEach(b=>b.onchange=()=>{let g=gs.find(x=>x.id===b.dataset.goalStep);if(!g)return;let st=g.steps.find(x=>x.id===b.dataset.stepId);if(st){st.done=b.checked;save();draw()}});
 root.querySelectorAll('[data-goal-complete]').forEach(b=>b.onclick=()=>{let g=gs.find(x=>x.id===b.dataset.goalComplete);if(g){g.completed=!g.completed;save();draw()}});
}
function card(g){
 let steps=Array.isArray(g.steps)?g.steps:[],count=steps.filter(x=>x.done).length,pct=steps.length?Math.round(count/steps.length*100):(g.completed?100:0);
 return '<div class="goal-card"><div class="section-top"><strong>'+safe(g.title)+'</strong><button class="ghost" data-goal-edit="'+safe(g.id)+'">Изменить</button></div>'+
 (g.description?'<p class="hint">'+safe(g.description)+'</p>':'')+
 (g.deadline?'<p class="hint">📅 До '+safe(g.deadline)+'</p>':'')+
 '<div class="goal-meter"><span style="width:'+pct+'%"></span></div><p class="hint">'+count+' из '+steps.length+' этапов · '+pct+'%</p>'+
 steps.map(st=>'<label class="goal-step"><input type="checkbox" data-goal-step="'+safe(g.id)+'" data-step-id="'+safe(st.id)+'" '+(st.done?'checked':'')+'><span>'+safe(st.title)+'</span></label>').join('')+
 (g.habits?.length?'<p class="hint">🔗 Привычки: '+g.habits.map(safe).join(' · ')+'</p>':'')+
 '<button class="secondary" data-goal-complete="'+safe(g.id)+'">'+(g.completed?'↩ Вернуть в активные':'✓ Отметить достигнутой')+'</button></div>'
}
function edit(id){
 let g=goals().find(x=>x.id===id),overlay=E('#goalEditor'),title=E('#goalTitle'),desc=E('#goalDesc'),deadline=E('#goalDeadline'),steps=E('#goalSteps'),habits=E('#goalHabits');
 overlay.dataset.editId=id||'';
 title.value=g?.title||'';desc.value=g?.description||'';deadline.value=g?.deadline||'';
 steps.value=(g?.steps||[]).map(x=>x.title).join('\n');
 habits.innerHTML=(state.library||[]).map((h,i)=>'<label class="goal-habit"><input type="checkbox" value="'+i+'" '+(g?.habits||[]).includes(h)?'checked':'')+'><span>'+safe(h)+'</span></label>').join('');
 overlay.hidden=false;title.focus();
 E('#goalDelete').hidden=!g;
}
function close(){E('#goalEditor').hidden=true}
function persist(){
 let title=E('#goalTitle').value.trim();if(!title){alert('Напиши название цели');return}
 let id=E('#goalEditor').dataset.editId,g=goals().find(x=>x.id===id),lines=E('#goalSteps').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,40);
 let existing=g?.steps||[],used=new Set();
 let steps=lines.map(name=>{let found=existing.find(x=>x.title===name&&!used.has(x.id));if(found){used.add(found.id);return found}return{id:makeId(),title:name,done:false}});
 let selected=[...E('#goalHabits').querySelectorAll('input:checked')].map(x=>state.library[Number(x.value)]).filter(Boolean);
 if(!g){g={id:makeId(),created:localDate(),completed:false};goals().push(g)}
 Object.assign(g,{title,description:E('#goalDesc').value.trim(),deadline:E('#goalDeadline').value,steps,habits:selected});
 save();close();draw()
}
function init(){
 const plan=E('#planner');if(!plan)return;
 const panel=document.createElement('div');panel.className='panel';panel.id='goalWorkspace';
 plan.insertBefore(panel,plan.children[1]||null);
 const overlay=document.createElement('div');overlay.id='goalEditor';overlay.hidden=true;
 overlay.innerHTML='<div class="goal-dialog"><div class="section-top"><h2>Моя цель</h2><button class="ghost" id="goalClose">✕</button></div><label class="label">Название цели</label><input id="goalTitle" class="field" maxlength="100" placeholder="Например, пробежать 5 км"><label class="label">Зачем мне это?</label><textarea id="goalDesc" class="field" rows="2" maxlength="500"></textarea><label class="label">Срок (необязательно)</label><input id="goalDeadline" type="date" class="field"><label class="label">Этапы — каждый с новой строки</label><textarea id="goalSteps" class="field" rows="4" placeholder="Начать тренировки&#10;Пробежать 2 км&#10;Пробежать 5 км"></textarea><label class="label">Связанные привычки</label><div id="goalHabits" class="goal-habits"></div><div class="goal-actions"><button class="secondary" id="goalDelete">Удалить</button><button class="primary" id="goalSave">Сохранить цель</button></div></div>';
 document.body.appendChild(overlay);
 E('#goalClose').onclick=close;E('#goalSave').onclick=persist;
 E('#goalDelete').onclick=()=>{if(!confirm('Удалить эту цель? Привычки и дневник сохранятся.'))return;state.userGoals=goals().filter(x=>x.id!==overlay.dataset.editId);save();close();draw()};
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 const style=document.createElement('style');style.textContent='.goal-card{padding:14px;border:1px solid #38516a;border-radius:17px;background:#ffffff08;margin-top:12px}.goal-card strong{font-size:16px}.goal-meter{height:7px;border-radius:20px;background:#ffffff18;overflow:hidden;margin-top:12px}.goal-meter span{display:block;height:100%;background:var(--mint);border-radius:20px}.goal-step,.goal-habit{display:flex;align-items:center;gap:10px;padding:8px 0}.goal-step input,.goal-habit input{accent-color:var(--mint);width:18px;height:18px}#goalEditor[hidden]{display:none!important}#goalEditor{position:fixed;inset:0;z-index:9999;background:#030b17d9;display:flex;align-items:center;justify-content:center;padding:18px}.goal-dialog{width:min(100%,520px);max-height:90dvh;overflow:auto;border:1px solid #456078;border-radius:24px;padding:20px;background:#18273b;box-shadow:0 20px 80px #0009}.goal-dialog .label{margin-top:12px;display:block}.goal-habits{max-height:145px;overflow:auto}.goal-actions{display:flex;justify-content:space-between;margin-top:18px}';document.head.appendChild(style);
 const observer=new MutationObserver(()=>{if(plan.classList.contains('active')||plan.style.display!=='none')draw()});observer.observe(plan,{attributes:true,attributeFilter:['class','style']});draw();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
