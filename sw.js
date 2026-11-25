const C='onsite-reports-v21';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url),base=new URL(self.registration.scope);
  /* leave published reports (other folders on this site) alone */
  if(u.origin===base.origin&&!SHELL.some(x=>new URL(x,base).pathname===u.pathname))return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();if(r.ok||r.type==='opaque')caches.open(C).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});
