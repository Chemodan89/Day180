/* v31.8: progressive disclosure, preserve all existing functionality */
(function(){
'use strict';
function init(){
 const $=s=>document.querySelector(s), planner=$('#planner'),stats=$('#stats'),today=$('#today');
 if(!planner||!stats||!today)return;
 function collapse(panel,title,open=false){
  if(!panel||panel.dataset.organized)return;
  panel.dataset.organized='1';
  let content=document.createElement('div');content.className='organized-content';
  while(panel.firstChild)content.appendChild(panel.firstChild);
  let toggle=document.createElement('button');toggle.type='button';toggle.className='organized-toggle';toggle.setAttribute('aria-expanded',String(open));
  toggle.innerHTML='<span>'+title+'</span><span class="organized-chevron">'+(open?'⌃':'⌄')+'</span>';
  panel.append(toggle,content);content.hidden=!open;
  toggle.onclick=()=>{let next=content.hidden;content.hidden=!next;toggle.setAttribute('aria-expanded',String(next));toggle.querySelector('.organized-chevron').textContent=next?'⌃':'⌄'};
 }
 // Day: focus on doing, with optional reflection and quantitative habit tools
 const journal=$('#note')?.closest('.panel');if(journal)collapse(journal,'✍️ Дневник дня',false);
 const progress=$('#v31TodayHabits')?.closest('.panel');if(progress)collapse(progress,'📊 Дополнительный прогресс привычек',false);
 const reflection=$('#v31ReflectPanel');if(reflection)collapse(reflection,'🌙 Вечерняя рефлексия',true);
 // Planner: daily planning first; everything else available but not competing for attention
 const planning=$('#plannedList')?.closest('.panel');
 if(planning&&planning!==planner.firstElementChild)planner.insertBefore(planning,planner.firstElementChild);
 const intro=$('#openStarter')?.closest('.panel');if(intro)collapse(intro,'✨ Подобрать привычки и готовый план',false);
 const goals=$('#goalWorkspace');if(goals)collapse(goals,'🎯 Мои цели',false);
 const library=$('#libraryManage')?.closest('.panel');if(library)collapse(library,'📚 Управление библиотекой',false);
 const habit=$('#v31HabitRows')?.closest('.panel');if(habit)collapse(habit,'⚙️ Расписание привычек',false);
 // History: one quick overview, deeper reports on demand
 const panels=[...stats.querySelectorAll(':scope > .panel')];
 for(let p of panels){let h=p.querySelector('h2')?.textContent?.trim()||'Подробности';let primary=p.querySelector('#chart')||p.querySelector('#history');if(!primary)collapse(p,h,false)}
 // Only remove repetitive instructional text; do not remove data or controls
 const planHelp=today.querySelector('#taskList')?.parentElement?.querySelector('.hint');
 if(planHelp&&planHelp.textContent.includes('Удерживай'))planHelp.hidden=true;
 const style=document.createElement('style');style.textContent='.organized-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:42px;border:0;background:transparent;color:var(--ink);text-align:left;font-size:17px;font-weight:750;padding:0;gap:10px}.organized-chevron{font-size:22px;color:var(--muted)}.organized-content[hidden]{display:none!important}.organized-content{padding-top:12px}.organized-content>.section-top:first-child{display:none}.organized-content>h2:first-child{display:none}.organized-content>.hint:first-child{margin-top:0}.organized-content .section-top{flex-wrap:wrap}';document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();