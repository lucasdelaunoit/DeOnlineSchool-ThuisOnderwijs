(function(){

  var MAIL='paulhenri@pauldepierre.com', WA='32472609200';
  var form=document.getElementById('form'), err=document.getElementById('err'), res=document.getElementById('result');
  function v(id){return document.getElementById(id).value.trim();}

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var missing=[];
    [['voornaam','je voornaam'],['leeftijd','je leeftijd'],['woonplaats','je woonplaats'],['sinds','sinds wanneer je thuisonderwijs volgt'],['ouder','de naam van je ouder'],['gsm','een gsm-nummer'],['email','een e-mailadres']].forEach(function(f){if(!v(f[0]))missing.push(f[1]);});
    var em=v('email'); if(em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) missing.push('een geldig e-mailadres');
    if(!document.getElementById('ok1').checked||!document.getElementById('ok2').checked) missing.push('de twee toestemmingen van je ouder');
    if(!document.getElementById('ok3').checked) missing.push('het akkoord met de algemene voorwaarden');
    if(missing.length){err.textContent='Vul nog in: '+missing.join(', ')+'.';err.hidden=false;return;}
    err.hidden=true;

    var topics=[].slice.call(document.querySelectorAll('#onderwerpen input:checked')).map(function(c){return c.value;});
    var lines=[
      'INSCHRIJVING DE THUISSCHOOL PODCAST','',
      'Voornaam: '+v('voornaam'),
      'Leeftijd: '+v('leeftijd'),
      'Woonplaats: '+v('woonplaats'),
      'Thuisonderwijs sinds: '+v('sinds'),
      'Komt: '+v('gasten')+(v('tweede')?' ('+v('tweede')+')':''),
      'Wil praten over: '+(topics.length?topics.join(', '):'-'),
      'Over mezelf: '+(v('verhaal')||'-'),'',
      'Ouder: '+v('ouder'),
      'Gsm: '+v('gsm'),
      'E-mail: '+em,'',
      'Toestemming deelname: ja',
      'Toestemming publicatie geluid, beeld en foto\'s op alle kanalen: ja',
      'Algemene voorwaarden en privacyverklaring (versie 7 oktober 2026): gelezen en aanvaard',
      'Datum inschrijving: '+new Date().toLocaleDateString('nl-BE')
    ];
    var text=lines.join('\n');
    document.getElementById('summary').textContent=text;
    document.getElementById('rname').textContent=v('voornaam');
    document.getElementById('mailbtn').href='mailto:'+MAIL+'?subject='+encodeURIComponent('Inschrijving De Thuisschool Podcast - '+v('voornaam'))+'&body='+encodeURIComponent(text);
    document.getElementById('wabtn').href='https://wa.me/'+WA+'?text='+encodeURIComponent(text);
    var btn=document.getElementById('submitbtn'), st=document.getElementById('sending');
    function fallback(){ st.textContent=''; btn.disabled=false; form.hidden=true; res.hidden=false; res.scrollIntoView({behavior:'smooth',block:'start'}); }
    if(document.getElementById('website').value){ return; }
    btn.disabled=true; st.textContent='Bezig met versturen…';
    var payload={voornaam:v('voornaam'),leeftijd:v('leeftijd'),woonplaats:v('woonplaats'),sinds:v('sinds'),gasten:v('gasten'),tweede:v('tweede'),
      onderwerpen:topics.join(', '),verhaal:v('verhaal'),ouder:v('ouder'),gsm:v('gsm'),email:em,
      ok1:document.getElementById('ok1').checked,ok2:document.getElementById('ok2').checked,ok3:document.getElementById('ok3').checked,website:''};
    var ctrl=('AbortController' in window)?new AbortController():null, to=setTimeout(function(){ if(ctrl) ctrl.abort(); },15000);
    fetch('/api/inschrijven',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctrl?ctrl.signal:undefined})
      .then(function(r){ return r.json().catch(function(){return {ok:false};}); })
      .then(function(d){
        clearTimeout(to);
        if(d&&d.ok){ var s=document.getElementById('sent'); document.getElementById('sname').textContent=v('voornaam'); st.textContent=''; form.hidden=true; s.hidden=false; s.scrollIntoView({behavior:'smooth',block:'start'}); s.focus({preventScroll:true}); }
        else fallback();
      })
      .catch(function(){ clearTimeout(to); fallback(); });
  });


  // stempel: start op de grens tussen de eerste twee blokken, schuift bij scrollen naar zijn vaste plek onderaan
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
  document.getElementById('vlinkfoot').addEventListener('click',function(){document.getElementById('voorwaarden').open=true;});
  document.getElementById('edit').addEventListener('click',function(){res.hidden=true;form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'start'});});

  document.getElementById('copy').addEventListener('click',function(){
    var pre=document.getElementById('summary'), msg=document.getElementById('copied');
    function sel(){var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r);msg.textContent='Tekst geselecteerd, kopieer met Ctrl+C of lang drukken.';}
    try{navigator.clipboard.writeText(pre.textContent).then(function(){msg.textContent='Gekopieerd!';},sel);}catch(e){sel();}
  });
})();
