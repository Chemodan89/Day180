// Retire the old Day180 offline cache and let the new app load from the network.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('day180-')).map(key=>caches.delete(key)));
  await self.registration.unregister();
  const clients=await self.clients.matchAll({type:'window'});
  await Promise.all(clients.map(client=>client.navigate(client.url).catch(()=>{})));
})()));
