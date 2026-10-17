/* Day180 34.2 — essentials only, non-destructive UI simplification */
(function(){
'use strict';
function init(){
 const $=s=>document.querySelector(s),removePanel=(s)=>{const e=$(s);if(e){const panel=e.closest('.panel');if(panel)panel.hidden=true}};
 // Keep plan, library and goals; remove starter, helper and yesterday carry-over.
 removePanel('#openStarter');
 const carry=$('#carryOver');if(carry)carry.hidden=true;
 // Simplify daily screen: retain task list, mood, sleep and journal.
 const task=$('#taskList');
 if(task){const panel=task.closest('.panel');panel?.querySelectorAll('.hint').forEach(h=>{if(/Удерживай|Галочка сохраняется/.test(h.textContent))h.remove()})}
 // Remove rejected historical dashboards; keep graph, diary and day history.
 ['#weeklyMedals','#categoryStats'].forEach(removePanel);
 const exportButton=$('#exportJournal');if(exportButton)exportButton.hidden=true;
 const journal=$('#journalHistory')?.closest('.panel');if(journal){journal.hidden=false;journal.querySelectorAll('p.hint').forEach(h=>{if(/скачай дневник|нейросети|загрузи TXT/.test(h.textContent))h.hidden=true})}
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
 // One identical add-flow for Today and Plan: open the same library picker for the selected date.
 const todayAdd=$('#openAddModal');if(todayAdd){todayAdd.onclick=()=>{planning=selected;openPlanAdd();$('#v31PlanLibraryTab')?.click()}}
 const tomorrow=$('#planTomorrow');if(tomorrow){tomorrow.onclick=()=>{planning=addDays(selected,1);setTab('planner');render();}}
 // Rejected elements stay in the DOM only where legacy renderers require them; never expose them.
 const style=document.createElement('style');style.textContent='#stats .panel[hidden],#settings .panel[hidden],#planner .panel[hidden],#carryOver[hidden],#exportJournal[hidden],#journalHistory~p[hidden],#goalSteps[hidden],#goalHabits[hidden]{display:none!important}#planner>.panel,#stats>.panel,#today>.panel{margin-bottom:14px}';document.head.appendChild(style);
 // Keep version always clear.
 const v=$('#appVersion');if(v)v.textContent='34.2';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();