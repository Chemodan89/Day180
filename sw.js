const CACHE='day180-v34-5-update-repair';
const ASSETS=['./index.html','./goals-v30-4.js','./simplify-v32.js','./library-v34.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async cache=>{
  await Promise.all(ASSETS.map(async path=>{try{await cache.add(new Request(path,{cache:'reload'}))}catch(e){/* optional assets should not block activation */}}));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('day180-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 event.respondWith(fetch(req).then(res=>{
  if(res.ok){const copy=res.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{}))}
  return res;
 }).catch(async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(req,{ignoreSearch:true});
  return hit||await cache.match('./index.html')||Response.error();
 }));
});