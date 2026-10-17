/* v30.4: safe cleanup of historical daily records */
(function(){
'use strict';
function init(){
 const settings=document.querySelector('#settings');
 const anchor=document.querySelector('#export');
 if(!settings||!anchor)return;
 const panel=document.createElement('div');
 panel.className='panel';
 panel.innerHTML='<h2>Очистка истории</h2><p class="hint">Удалить записи всех дней <strong>до сегодняшнего</strong>: дела и отметки выполнения, настроение, сон и дневник. Сегодняшний день, будущие планы, библиотека привычек, цели и настройки останутся без изменений.</p><p class="hint" id="historyCleanupCount"></p><button class="secondary" id="historyCleanupBackup" type="button">⬇ Скачать копию перед очисткой</button><p><button class="secondary" id="historyCleanupRun" type="button">🗑 Очистить предыдущие дни</button></p><p class="hint">Действие нельзя отменить без резервной копии.</p>';
 anchor.closest('.panel').after(panel);
 const count=panel.querySelector('#historyCleanupCount');
 const run=panel.querySelector('#historyCleanupRun');
 const getPast=()=>Object.keys(state.days||{}).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&d<localDate());
 function update(){const n=getPast().length;count.textContent=n?'Будет удалено дней: '+n:'Записей за предыдущие дни нет';run.disabled=!n}
 panel.querySelector('#historyCleanupBackup').onclick=()=>anchor.click();
 run.onclick=()=>{
  const dates=getPast();if(!dates.length){update();return}
  const message='Удалить данные за '+dates.length+' предыдущих дней?\n\nВсе задачи, отметки, сон, настроение и записи дневника за эти даты будут удалены.\n\nПеред продолжением сохрани резервную копию в настройках.';
  if(!confirm(message))return;
  if(!confirm('Подтверждаешь окончательную очистку истории до сегодняшнего дня?'))return;
  dates.forEach(date=>delete state.days[date]);
  save();update();render();
  alert('История за предыдущие дни очищена. Сегодняшние данные и будущие планы сохранены.');
 };
 const tabs=document.querySelector('.tabs');
 if(tabs)tabs.addEventListener('click',()=>setTimeout(update,0));
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
