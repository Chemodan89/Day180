/* Day180 34.3: six ready-made categories, curated suggestions, safe local migration */
(function(){
'use strict';
const GROUPS=[
 ['Здоровье',['Лечь спать до 23:00','Выпить достаточно воды','Здоровый завтрак','Прогулка на свежем воздухе','Отслеживать самочувствие','Утро без телефона']],
 ['Спорт',['Утренняя зарядка','Тренировка в зале','Пробежка','Бокс','Йога','Растяжка','Пройти 8000 шагов']],
 ['Развитие',['Чтение 20 минут','Медитация 10 минут','Изучение нового навыка','Обучение 30 минут','Практика нового навыка','Записать итоги дня']],
 ['Работа',['Работа над проектом','Изучить спрос и конкурентов','Практика технического навыка','Поиск клиентов','Создать контент','Снять Reels','Подвести итоги работы']],
 ['Личное',['Провести время с семьёй','Уборка дома','Время для себя','План на завтра','Позвонить близким','Отдых без телефона']],
 ['Прочее',['Покупки','Оплатить счета','Разобрать документы','Записаться на встречу','Выполнить поручение']]
];
function init(){
 const known=new Map(GROUPS.flatMap(([category,items])=>items.map(text=>[text.toLocaleLowerCase('ru'),{text,category}])));
 const previous=new Map([['Тренировка','Спорт'],['Бокс','Спорт'],['Йога','Спорт'],['Зарядка / разминка','Спорт'],['Прогулка','Здоровье'],['План дня','Личное'],['Фокус на проекте','Работа'],['Чтение 20 минут','Развитие'],['Практика нового навыка','Развитие'],['Вечерний дневник','Развитие'],['Время с семьёй','Личное'],['План на завтра','Личное']]);
 state.categories??={};
 // Run only once. Preserve existing categories selected by the user and all recorded days.
 if(!state.librarySeedV34){
   const present=new Set((state.library||[]).map(t=>t.trim().toLocaleLowerCase('ru')));
   for(const [category,items] of GROUPS)for(const text of items){const key=text.toLocaleLowerCase('ru');if(!present.has(key)){state.library.push(text);state.categories[text]=category;present.add(key)}}
   for(const text of state.library){if(previous.has(text))state.categories[text]=previous.get(text);else if(known.has(text.toLocaleLowerCase('ru'))&&!state.categories[text])state.categories[text]=known.get(text.toLocaleLowerCase('ru')).category}
   state.librarySeedV34=true;save();
 }
 // Clean only known legacy presets and obvious semantic duplicates; retain personal tasks.
 if(!state.libraryCleanV343){
   const legacy=new Set(['План дня','Зарядка / разминка','Фокус на проекте','Вечерний дневник','Тренировка','Прогулка','Прогулка 20 минут','Тренировка 3 раза в неделю','Практика нового навыка','Время с семьёй','Чтение 20 минут','Бокс','Йога','План на завтра','Утро без телефона']);
   const canonical=new Map([['прогулка','Прогулка на свежем воздухе'],['прогулка 20 минут','Прогулка на свежем воздухе'],['тренировка','Тренировка в зале'],['тренировка 3 раза в неделю','Тренировка в зале'],['зарядка / разминка','Утренняя зарядка'],['фокус на проекте','Работа над проектом'],['вечерний дневник','Записать итоги дня'],['практика нового навыка','Изучение нового навыка'],['время с семьёй','Провести время с семьёй'],['план дня','План на завтра']]);
   const kept=[],seen=new Set(),archived=[];
   for(const raw of state.library){const t=String(raw).trim(),key=t.toLocaleLowerCase('ru');if(!t)continue;
     const replacement=canonical.get(key);
     if(replacement&&state.library.some(x=>x.trim().toLocaleLowerCase('ru')===replacement.toLocaleLowerCase('ru'))){archived.push(t);continue}
     if(seen.has(key)){archived.push(t);continue}
     seen.add(key);kept.push(t);
   }
   state.libraryArchiveV343=archived;
   state.library=kept;
   state.libraryCleanV343=true;save();
 }
 const categories=GROUPS.map(g=>g[0]);
 // Fixed categories in all creation/editing surfaces; no new management UI.
 for(const id of ['libraryCategory','todayCategory','customCategory']){const e=document.getElementById(id);if(!e)continue;const selected=e.value;e.innerHTML=categories.map(c=>'<option>'+c+'</option>').join('');if(categories.includes(selected))e.value=selected}
 const version=document.getElementById('appVersion');if(version)version.textContent='34.3';
 // Refresh only the library view, leaving the user's current day untouched.
 if(typeof renderGroupedLibrary==='function')renderGroupedLibrary();
 if(typeof render==='function')render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();