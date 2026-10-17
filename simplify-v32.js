/* Day180 32.0 — essentials only, non-destructive UI simplification */
(function(){
'use strict';
function init(){
 const $=s=>document.querySelector(s),removePanel=(s)=>{const e=$(s);if(e)e.closest('.panel')?.remove()};
 // Keep plan, library and goals; remove starter, helper and yesterday carry-over.
 removePanel('#openStarter');
 $('#carryOver')?.remove();
 // Simplify daily screen: retain task list, mood, sleep and journal.
 const task=$('#taskList');
 if(task){const panel=task.closest('.panel');panel?.querySelectorAll('.hint').forEach(h=>{if(/Удерживай|Галочка сохраняется/.test(h.textContent))h.remove()})}
 // Remove rejected historical dashboards; keep graph, diary and day history.
 ['#weeklyMedals','#categoryStats','#exportJournal'].forEach(removePanel);
 // Remove legacy training entry and clean obsolete explanations.
 removePanel('#replayTour');
 const stats=$('#stats');if(stats){const graph=$('#chart')?.closest('.panel');if(graph)stats.insertBefore(graph,stats.firstElementChild)}
 // Keep the library visible and put it immediately after planning/goals.
 const planner=$('#planner'),plan=$('#plannedList')?.closest('.panel'),goals=$('#goalWorkspace'),lib=$('#libraryManage')?.closest('.panel');
 if(planner&&plan)planner.insertBefore(plan,planner.firstElementChild);
 if(goals){goals.hidden=false;goals.querySelectorAll('.hint').forEach(h=>{if(/Большие результаты/.test(h.textContent))h.remove()})}
 if(lib){lib.querySelectorAll('p.hint').forEach(h=>{if(/Сохранённые задачи доступны/.test(h.textContent))h.remove()})}
 // Goals retain previously saved advanced metadata, but only essential editing is shown.
 const editor=$('#goalEditor');if(editor){['#goalSteps','#goalHabits'].forEach(s=>{const e=$(s);if(e){e.hidden=true;const label=e.previousElementSibling;if(label?.tagName==='LABEL')label.hidden=true}})}
 // Category is the only library habit setting for this streamlined release.
 const library=$('#library');if(library){const obs=new MutationObserver(()=>{library.querySelectorAll('.lib-entry').forEach(row=>{row.querySelector('.v319-edit')?.remove()})});obs.observe(library,{childList:true,subtree:true})}
 // Keep version always clear.
 const v=$('#appVersion');if(v)v.textContent='32.0';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();