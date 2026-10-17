/* v31.9 — single habit editor from library */
(function(){
'use strict';
const $=s=>document.querySelector(s);
function init(){
 const library=$('#libraryManage'),old=$('#v31HabitRows')?.closest('.panel');if(!library)return;
 if(old)old.hidden=true;
 const css=document.createElement('style');css.textContent='#v319Editor[hidden]{display:none!important}#v319Editor{position:fixed;inset:0;z-index:10001;background:#07101bdb;display:flex;align-items:center;justify-content:center;padding:16px}#v319Editor .v319-sheet{width:min(100%,500px);max-height:90dvh;overflow:auto;border:1px solid #ffffff2d;background:#18283c;border-radius:24px;padding:20px;box-shadow:0 25px 70px #0009}#v319Editor label{display:block;margin:14px 0 7px;font-size:13px}#v319Editor .v319-actions{display:flex;justify-content:space-between;gap:10px;margin-top:20px}#v319Editor .v319-days{display:flex;flex-wrap:wrap;gap:7px}#v319Editor .v319-days label{margin:0;padding:8px;border:1px solid #ffffff30;border-radius:10px}#v319Editor .v319-days input{accent-color:var(--mint)}#v319Editor .v319-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}#library .v319-edit{font-size:12px;flex-shrink:0}';document.head.appendChild(css);
 const overlay=document.createElement('div');overlay.id='v319Editor';overlay.hidden=true;
 overlay.innerHTML='<div class="v319-sheet" role="dialog" aria-modal="true" aria-label="Настроить привычку"><div class="section-top"><h2>Настроить привычку</h2><button id="v319Close" class="ghost" type="button">✕</button></div><p class="hint" id="v319Name"></p><label for="v319Category">Категория</label><select id="v319Category" class="field"></select><label for="v319Schedule">Расписание</label><select id="v319Schedule" class="field"><option value="daily">Каждый день</option><option value="weekdays">По дням недели</option><option value="interval">Каждые N дней</option></select><div id="v319DaysWrap" hidden><label>Выбери дни</label><div class="v319-days" id="v319Days"></div></div><div id="v319IntervalWrap" hidden><label for="v319Interval">Интервал в днях</label><input class="field" id="v319Interval" type="number" min="1" max="365" value="2"></div><div class="v319-grid"><div><label for="v319Target">Цель (0 — галочка)</label><input class="field" id="v319Target" type="number" min="0" step="0.1" value="0"></div><div><label for="v319Unit">Единица</label><input class="field" id="v319Unit" maxlength="25" placeholder="мин, км, раз"></div></div><div class="v319-actions"><button id="v319Cancel" class="secondary">Отмена</button><button id="v319Save" class="primary">Сохранить</button></div></div>';
 document.body.appendChild(overlay);
 const rules=()=>{state.v31??={};state.v31.habitRules??={};return state.v31.habitRules};
 let current='';
 const close=()=>overlay.hidden=true;
 $('#v319Close').onclick=close;$('#v319Cancel').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close()};
 const labels=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
 $('#v319Days').innerHTML=labels.map((x,i)=>'<label><input type="checkbox" value="'+((i+1)%7)+'"> '+x+'</label>').join('');
 const show=()=>{$('#v319DaysWrap').hidden=$('#v319Schedule').value!=='weekdays';$('#v319IntervalWrap').hidden=$('#v319Schedule').value!=='interval'};
 $('#v319Schedule').onchange=show;
 function open(name){
  current=name;let r=rules()[name]||{},categories=[...new Set([...LIB_GROUPS.map(x=>x[0]),...Object.values(state.categories||{}),state.categories[name]||categoryOf(name)])];
  $('#v319Name').textContent=name;$('#v319Category').innerHTML=categories.map(x=>'<option value="'+escapeHtml(x)+'">'+escapeHtml(x)+'</option>').join('');
  $('#v319Category').value=state.categories[name]||categoryOf(name);$('#v319Schedule').value=r.schedule||'daily';
  $('#v319Interval').value=r.interval||2;$('#v319Target').value=r.target||0;$('#v319Unit').value=r.unit||'';
  $('#v319Days').querySelectorAll('input').forEach(x=>x.checked=(r.weekdays||[1,2,3,4,5]).includes(Number(x.value)));
  show();overlay.hidden=false;
 }
 $('#v319Save').onclick=()=>{
  if(!current)return;let r=rules()[current]||{},schedule=$('#v319Schedule').value,weekdays=[...$('#v319Days').querySelectorAll('input:checked')].map(x=>Number(x.value));
  if(schedule==='weekdays'&&!weekdays.length){alert('Выбери хотя бы один день');return}
  let target=Number($('#v319Target').value),interval=Number($('#v319Interval').value);
  if(!Number.isFinite(target)||target<0||!Number.isFinite(interval)||interval<1||interval>365){alert('Проверь числовые значения');return}
  rules()[current]={...r,schedule,weekdays,interval:Math.floor(interval),start:r.start||localDate(),target,unit:$('#v319Unit').value.trim()};
  state.categories[current]=$('#v319Category').value;save();close();renderGroupedLibrary();if(typeof renderHabits==='function')renderHabits();
 };
 function addButtons(){const root=$('#library');if(!root)return;root.querySelectorAll('.lib-entry').forEach(row=>{if(row.querySelector('.v319-edit'))return;let name=row.querySelector('.lib-entry-name')?.textContent;if(!name)return;let btn=document.createElement('button');btn.type='button';btn.className='secondary v319-edit';btn.textContent='Настроить';btn.onclick=()=>open(name);row.querySelector('.lib-entry-name')?.after(btn)})}
 const obs=new MutationObserver(()=>addButtons());obs.observe($('#library'),{childList:true,subtree:true});addButtons();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();