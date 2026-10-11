(function(){

  var MAIL='paulhenri@pauldepierre.com', WA='32472609200';
  var form=document.getElementById('form'), err=document.getElementById('err'), res=document.getElementById('result');
  function v(id){return document.getElementById(id).value.trim();}

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var missing=[];
    [['first-name','je voornaam'],['age','je leeftijd'],['town','je woonplaats'],['since','sinds wanneer je thuisonderwijs volgt'],['parent','de naam van je ouder'],['phone','een gsm-nummer'],['email','een e-mailadres']].forEach(function(f){if(!v(f[0]))missing.push(f[1]);});
    var em=v('email'); if(em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) missing.push('een geldig e-mailadres');
    if(!document.getElementById('consent-1').checked||!document.getElementById('consent-2').checked) missing.push('de twee toestemmingen van je ouder');
    if(!document.getElementById('consent-3').checked) missing.push('het akkoord met de algemene voorwaarden');
    if(missing.length){err.textContent='Vul nog in: '+missing.join(', ')+'.';err.hidden=false;return;}
    err.hidden=true;

    var topics=[].slice.call(document.querySelectorAll('#topics input:checked')).map(function(c){return c.value;});
    var lines=[
      'INSCHRIJVING DE THUISSCHOOL PODCAST','',
      'Voornaam: '+v('first-name'),
      'Leeftijd: '+v('age'),
      'Woonplaats: '+v('town'),
      'Thuisonderwijs sinds: '+v('since'),
      'Komt: '+v('guests')+(v('second-guest')?' ('+v('second-guest')+')':''),
      'Wil praten over: '+(topics.length?topics.join(', '):'-'),
      'Over mezelf: '+(v('story')||'-'),'',
      'Ouder: '+v('parent'),
      'Gsm: '+v('phone'),
      'E-mail: '+em,'',
      'Toestemming deelname: ja',
      'Toestemming publicatie geluid, beeld en foto\'s op alle kanalen: ja',
      'Algemene voorwaarden en privacyverklaring (versie 7 oktober 2026): gelezen en aanvaard',
      'Datum inschrijving: '+new Date().toLocaleDateString('nl-BE')
    ];
    var text=lines.join('\n');
    document.getElementById('summary').textContent=text;
    document.getElementById('rname').textContent=v('first-name');
    document.getElementById('mailbtn').href='mailto:'+MAIL+'?subject='+encodeURIComponent('Inschrijving De Thuisschool Podcast - '+v('first-name'))+'&body='+encodeURIComponent(text);
    document.getElementById('wabtn').href='https://wa.me/'+WA+'?text='+encodeURIComponent(text);
    var btn=document.getElementById('submitbtn'), st=document.getElementById('sending');
    function fallback(){ st.textContent=''; btn.disabled=false; form.hidden=true; res.hidden=false; res.scrollIntoView({behavior:'smooth',block:'start'}); }
    if(document.getElementById('website').value){ return; }
    btn.disabled=true; st.textContent='Bezig met versturen…';
    var payload={firstName:v('first-name'),age:v('age'),town:v('town'),since:v('since'),guests:v('guests'),secondGuest:v('second-guest'),
      topics:topics.join(', '),story:v('story'),parent:v('parent'),phone:v('phone'),email:em,
      consent1:document.getElementById('consent-1').checked,consent2:document.getElementById('consent-2').checked,consent3:document.getElementById('consent-3').checked,website:''};
    var ctrl=('AbortController' in window)?new AbortController():null, to=setTimeout(function(){ if(ctrl) ctrl.abort(); },15000);
    fetch('/api/podcast-signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl?ctrl.signal:undefined})
      .then(function(r){ return r.json().catch(function(){return {ok:false};}); })
      .then(function(d){
        clearTimeout(to);
        if(d&&d.ok){ var s=document.getElementById('sent'); document.getElementById('sname').textContent=v('first-name'); st.textContent=''; form.hidden=true; s.hidden=false; s.scrollIntoView({behavior:'smooth',block:'start'}); s.focus({preventScroll:true}); }
        else fallback();
      })
      .catch(function(){ clearTimeout(to); fallback(); });
  });


  // stamp: starts on the edge between the first two blocks, slides into its fixed spot at the bottom while scrolling
  (function(){
    var w=document.getElementById('stampWrap'), hero=document.querySelector('header.hero');
    if(!w||!hero) return;
    w.classList.add('is-js');
    var ticking=false;
    function place(){
      ticking=false;
      var size=w.offsetHeight, vh=window.innerHeight, m=window.innerWidth<=600?12:16;
      var slot=vh-m-size;
      var start=hero.offsetTop+hero.offsetHeight-size/2;
      var sy=window.pageYOffset||0, y, t;
      if(start<=slot){
        var D=Math.max(260,(slot-start)*1.6);
        var p=Math.min(1,sy/D); t=1-p*p*(3-2*p);
        y=slot-(slot-start)*t;
      }else{
        y=Math.max(start-sy,slot);
        t=Math.min(1,(y-slot)/160);
      }
      w.style.transform='translate3d(0,'+y.toFixed(1)+'px,0) scale('+(1+0.3*t).toFixed(3)+')';
    }
    function req(){ if(!ticking){ticking=true;requestAnimationFrame(place);} }
    window.addEventListener('scroll',req,{passive:true});
    window.addEventListener('resize',req);
    window.addEventListener('load',req);
    place();
  })();
  document.getElementById('terms-link').addEventListener('click',function(){document.getElementById('terms').open=true;});
  document.getElementById('edit').addEventListener('click',function(){res.hidden=true;form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'start'});});

  document.getElementById('copy').addEventListener('click',function(){
    var pre=document.getElementById('summary'), msg=document.getElementById('copied');
    function sel(){var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);msg.textContent='Tekst geselecteerd, kopieer met Ctrl+C of lang drukken.';}
    try{navigator.clipboard.writeText(pre.textContent).then(function(){msg.textContent='Gekopieerd!';},sel);}catch(e){sel();}
  });
})();
