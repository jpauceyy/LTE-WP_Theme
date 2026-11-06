(function(){
  var root=document.documentElement;
  root.classList.remove('no-js');root.classList.add('js');
  // the site animates for every visitor, regardless of the OS 'reduce motion' setting (owner's choice)
  var reduce=false;
  if(!reduce) root.classList.add('motion');
  var clamp=function(v){return Math.max(0,Math.min(1,v))};
  var NS='http://www.w3.org/2000/svg';

  // hero headline: wrap each line (split at <br>) so the lines animate in one after another
  (function(){
    var h=document.querySelector('.hero h1');if(!h) return;
    var parts=h.innerHTML.split(/<br\s*\/?>/i);if(parts.length<2) return;
    var label=h.textContent.replace(/\s+/g,' ').trim();
    h.innerHTML=parts.map(function(t,i){return '<span class="ln" style="--l:'+i+'">'+t.trim()+'</span>'}).join(' ');
    h.setAttribute('aria-label',label);
  })();

  // split statement into words for the scroll fill
  var big=document.querySelector('.lime-panel .big'),words=0;
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(!part) return;
          if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part));return}
          var s=document.createElement('span');s.className='w';s.textContent=part;s.dataset.k=words++;f.appendChild(s);
        });
        n.parentNode.replaceChild(f,n);
      } else if(n.nodeType===1) walk(n);
    });
  })(big||document.createElement('p'));
  (big?big.querySelectorAll('.w'):[]).forEach(function(s){s.style.setProperty('--k',(s.dataset.k/words).toFixed(3))});

  // when the splash is showing, hold the page's own entrance until it lifts
  var introDelay=root.classList.contains('has-splash')?1750:0;
  function afterIntro(fn){introDelay?setTimeout(fn,introDelay):fn()}
  if(introDelay) setTimeout(function(){var s=document.getElementById('splash');s&&s.remove()},3000);
  // logo animations play when each mark comes into view
  var marks=document.querySelectorAll('.lte-mark');
  if('IntersectionObserver' in window && !reduce){var mio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('go');mio.unobserve(e.target)}})},{threshold:.3});afterIntro(function(){marks.forEach(function(m){mio.observe(m)})})}
  // reveals
  var targets=document.querySelectorAll('.rise');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    afterIntro(function(){targets.forEach(function(t){io.observe(t)})});
  } else targets.forEach(function(t){t.classList.add('in')});



  // footer marquee: autoplays in CSS; scrolling briefly speeds it up and steers its direction
  (function(){
    var tr=document.getElementById('mqTrack');if(!tr||reduce||!tr.getAnimations) return;
    var anim=tr.getAnimations()[0];if(!anim) return;
    var dir=1,boost=0,last=scrollY,raf=0;
    function ease(){boost*=0.92;if(boost<0.02) boost=0;anim.playbackRate=dir*(1+boost);raf=boost?requestAnimationFrame(ease):0}
    addEventListener('scroll',function(){var d=scrollY-last;last=scrollY;if(d) dir=d>0?1:-1;boost=Math.min(5,boost+Math.abs(d)*0.03);if(!raf) raf=requestAnimationFrame(ease)},{passive:true});
  })();
  // slider
  var acct=document.getElementById('acct'),fmt=function(n){return '$'+Math.round(n).toLocaleString('en-GB')};
  function slide(){var v=+acct.value;document.getElementById('acctOut').textContent=fmt(v);document.getElementById('acctEcho').textContent=fmt(v);if(reduce) document.getElementById('riskOut').textContent='$'+(v/100).toLocaleString('en-GB',{maximumFractionDigits:2})}
  if(acct){acct.addEventListener('input',slide);slide();}
  // ===== site-wide motion layer =====
  if(!reduce){
    // split section headings into masked words
    document.querySelectorAll('.head h2, .finale h2').forEach(function(h){
      var i=0;(function walk(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(n){
          if(n.nodeType===3){
            var f=document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(part){
              if(!part) return;
              if(/^\s+$/.test(part)){f.appendChild(document.createTextNode(part));return}
              var w=document.createElement('span');w.className='sw';var inner=document.createElement('span');inner.textContent=part;w.style.setProperty('--i',i++);inner.style.setProperty('--i',i);w.appendChild(inner);f.appendChild(w);
            });
            n.parentNode.replaceChild(f,n);
          } else if(n.nodeType===1) walk(n);
        });
      })(h);
      h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());
    });
    // stagger siblings that reveal together
    ['.mk-grid','.bento','.plans','.revs','.gets','.lime-cols','.mk-mini','.prin-grid','.focus','.steps3','.stat-row','.story'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(g){var k=0;Array.prototype.forEach.call(g.children,function(c){if(c.classList.contains('rise')) c.style.setProperty('--d',k++)})});
    });
    var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if(fine){
      // card tilt + highlight
      document.querySelectorAll('.tilt').forEach(function(el){
        el.addEventListener('pointermove',function(e){
          var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
          el.style.setProperty('--mx',(x*100).toFixed(1)+'%');el.style.setProperty('--my',(y*100).toFixed(1)+'%');
          if(!el.classList.contains('in')&&el.classList.contains('rise')) return;
          el.style.transition='transform .15s ease-out';
          el.style.transform='perspective(1000px) rotateX('+((0.5-y)*5).toFixed(2)+'deg) rotateY('+((x-0.5)*6).toFixed(2)+'deg) translateZ(0)';
        });
        el.addEventListener('pointerleave',function(){el.style.transition='transform .6s cubic-bezier(.2,.8,.2,1)';el.style.transform=''});
      });
      // magnetic buttons
      document.querySelectorAll('.btn,.wp-block-button__link').forEach(function(b){
        b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*0.12).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*0.2).toFixed(1)+'px)'});
        b.addEventListener('pointerleave',function(){b.style.transform=''});
      });
    }
    // gauge counts up when it appears
    var gauge=document.querySelector('.gauge b span');
    if(gauge&&'IntersectionObserver' in window){
      var small=gauge.querySelector('small'),txt=gauge.firstChild;
      var gio=new IntersectionObserver(function(es){if(es[0].isIntersecting){gio.disconnect();var t0=performance.now();(function step(t){var k=Math.min(1,(t-t0)/1300),e=1-Math.pow(1-k,3);txt.textContent=(e*1).toFixed(k<1?1:0)+'%';if(k<1) requestAnimationFrame(step)})(t0)}},{threshold:.5});
      gio.observe(gauge);
    }
    // risk amount tweens and bumps when the slider moves
    var ro=document.getElementById('riskOut'),shown=10,target=10,raf=0;
    if(acct&&ro) acct.addEventListener('input',function(){
      target=+acct.value/100;ro.classList.add('bump');clearTimeout(ro._t);ro._t=setTimeout(function(){ro.classList.remove('bump')},180);
      cancelAnimationFrame(raf);(function tw(){shown+=(target-shown)*0.25;if(Math.abs(target-shown)<0.01) shown=target;ro.textContent='$'+shown.toLocaleString('en-GB',{maximumFractionDigits:shown<100?2:0});if(shown!==target) raf=requestAnimationFrame(tw)})();
    });
  }


  // background orbs: follow the cursor with an easy lag (the second orb trails further behind).
  // Moves the two elements with transforms only (no :root variables) and sleeps once they settle.
  var scrollPhase=0,scrollProg=0;
  var orbEls=document.querySelectorAll('.orbs i');
  var o1={x:innerWidth*0.62,y:innerHeight*0.32},o2={x:innerWidth*0.2,y:innerHeight*0.7},tgt={x:o1.x,y:o1.y};
  var orbRaf=0;
  function place(el,p){el.style.transform='translate3d('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px,0) translate(-50%,-50%)'}
  function orbStep(){
    o1.x+=(tgt.x-o1.x)*0.08;o1.y+=(tgt.y-o1.y)*0.08;
    o2.x+=(o1.x-o2.x)*0.035;o2.y+=(o1.y-o2.y)*0.035;
    place(orbEls[0],o1);place(orbEls[1],o2);
    var moving=Math.abs(tgt.x-o1.x)+Math.abs(tgt.y-o1.y)+Math.abs(o1.x-o2.x)+Math.abs(o1.y-o2.y)>1.5;
    orbRaf=moving&&!document.hidden?requestAnimationFrame(orbStep):0;
  }
  function wakeOrbs(){if(!orbRaf) orbRaf=requestAnimationFrame(orbStep)}
  if(orbEls.length===2&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    addEventListener('pointermove',function(e){tgt.x=e.clientX;tgt.y=e.clientY;wakeOrbs()},{passive:true});
  }

  // scroll: echo headline, aurora visibility, scrubs, mobile bar
  var heroEl=document.querySelector('.hero,.page-hero'),h1=document.querySelector('.hero h1,.page-hero h1'),lastY=scrollY,vel=0,scrubs=document.querySelectorAll('.scrub'),lines=document.querySelectorAll('.story-line'),lime=document.querySelector('.lime-panel'),mbar=document.querySelector('.mbar'),fin=document.querySelector('.finale h2');
  var hdrEl=document.querySelector('.hdr'),scrollRaf=0,idle=0;
  function frame(){
    var y=scrollY,vh=innerHeight;
    if(!reduce){
      vel+=((y-lastY)-vel)*0.25;lastY=y;
      h1&&h1.style.setProperty('--v',Math.max(-14,Math.min(14,vel)).toFixed(2));
      scrollPhase=y*0.0009;
      scrollProg=y/Math.max(1,document.documentElement.scrollHeight-vh);hdrEl&&hdrEl.style.setProperty('--sp',scrollProg.toFixed(4));
      scrubs.forEach(function(el){var r=el.getBoundingClientRect();el.style.setProperty('--p',clamp((vh*0.95-r.top)/(vh*0.65)).toFixed(3))});
      lines.forEach(function(el){var r=el.getBoundingClientRect();el.style.setProperty('--p',clamp((vh*0.62-r.top)/r.height).toFixed(3))});
      if(lime){var lr=lime.getBoundingClientRect();lime.style.setProperty('--p',clamp((vh*0.85-lr.top)/(lr.height*0.75)).toFixed(3));}
    }
    if(heroEl){var hr=heroEl.getBoundingClientRect();heroEl.style.setProperty('--hp',clamp(-hr.top/(hr.height*0.8)).toFixed(3));}
    mbar&&mbar.classList.toggle('show',y>vh*0.85&&(!fin||fin.getBoundingClientRect().top>vh*0.5));
    // keep ticking only while the page moves or the headline echo is still settling
    if(y===lastStill&&Math.abs(vel)<0.05){if(++idle>2){scrollRaf=0;return}} else idle=0;
    lastStill=y;scrollRaf=requestAnimationFrame(frame);
  }
  var lastStill=-1;
  function wake(){if(!scrollRaf){idle=0;scrollRaf=requestAnimationFrame(frame)}}
  addEventListener('scroll',wake,{passive:true});addEventListener('resize',wake);
  wake();
})();


/* contact form (Custom HTML block on the Contact page) */
(function(){
  var form=document.getElementById('contactForm');if(!form) return;
  var sent=document.getElementById('formSent'),err=document.getElementById('formErr'),btn=document.getElementById('cSubmit');
  if(form._next) form._next.value=location.origin+location.pathname+'?sent=1';
  function showSent(name){
    form.hidden=true;sent.hidden=false;
    if(name) document.getElementById('sentText').textContent='Thanks, '+name+'. We\u2019ve emailed you a confirmation, and Luke will reply within 2 working days.';
    sent.focus();
  }
  if(/[?&]sent=1/.test(location.search)) showSent();
  form.addEventListener('submit',function(e){
    e.preventDefault();err.hidden=true;
    if(!form.checkValidity()){
      var bad=form.querySelector(':invalid');
      err.textContent=bad&&bad.type==='checkbox'?'Please tick the box so we can reply to you.':bad&&bad.type==='email'?'Please enter a valid email address.':'Please fill in your name, email and message.';
      err.hidden=false;bad&&bad.focus();return;
    }
    if(form._honey.value) return showSent();
    btn.disabled=true;btn.textContent='Sending\u2026';
    var data={};new FormData(form).forEach(function(v,k){if(k!=='_next') data[k]=v});
    var ctl=window.AbortController?new AbortController():null,timer=ctl&&setTimeout(function(){ctl.abort()},15000);
    fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',signal:ctl&&ctl.signal,headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)!=='true') throw new Error(j.message||'Send failed');})})
      .then(function(){clearTimeout(timer);showSent(data.name.split(' ')[0])})
      .catch(function(){clearTimeout(timer);
        err.textContent='Sorry, your message didn\u2019t send. Please try again, or message us on Telegram.';
        err.hidden=false;btn.disabled=false;btn.textContent='Send message';
      });
  });
})();
