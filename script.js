const header=document.querySelector('.site-header');
const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const setMenuState=open=>{
  nav?.classList.toggle('open',open);
  menuBtn?.setAttribute('aria-expanded',String(open));
  menuBtn?.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  if(menuBtn) menuBtn.textContent=open?'Close':'Menu';
};
menuBtn?.addEventListener('click',()=>{
  const opening=!nav?.classList.contains('open');
  setMenuState(opening);
  if(opening&&window.matchMedia('(max-width:980px)').matches){
    requestAnimationFrame(()=>nav?.querySelector('a')?.focus());
  }
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuState(false)));
document.addEventListener('pointerdown',e=>{
  if(!nav?.classList.contains('open'))return;
  if(nav.contains(e.target)||menuBtn?.contains(e.target))return;
  setMenuState(false);
});
window.addEventListener('resize',()=>{
  if(window.innerWidth>980&&nav?.classList.contains('open'))setMenuState(false);
},{passive:true});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&nav?.classList.contains('open')){
    setMenuState(false);
    menuBtn?.focus();
  }
});
const revealElements=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
  revealElements.forEach(el=>observer.observe(el));
}else{
  revealElements.forEach(el=>el.classList.add('visible'));
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const contactForm=document.querySelector('[data-contact-form]');
if(contactForm){
  const topicSelect=contactForm.querySelector('select[name="topic"]');
  const requestedTopic=new URLSearchParams(window.location.search).get('topic');
  if(topicSelect&&requestedTopic){
    const matchingOption=Array.from(topicSelect.options).find(option=>option.value===requestedTopic);
    if(matchingOption) topicSelect.value=requestedTopic;
  }

  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(!contactForm.checkValidity()){contactForm.reportValidity();return;}

    const formData=new FormData(contactForm);
    const name=(formData.get('name')||'').toString().trim();
    const email=(formData.get('email')||'').toString().trim();
    const company=(formData.get('company')||'').toString().trim();
    const topic=(formData.get('topic')||'General').toString().trim();
    const message=(formData.get('message')||'').toString().trim();
    const subject=`${topic} - Enquiry`;
    const body=[
      'The following enquiry comes from the Qiji Website:',
      '',
      `Name: ${name||'Not provided'}`,
      `Email: ${email||'Not provided'}`,
      `Company: ${company||'Not provided'}`,
      `Topic: ${topic}`,
      '',
      'Message:',
      `"${message}"`
    ].join('\n');
    const recipient='fabiule@qijisg.com';
    const cc='rodrigo@qijisg.com';
    window.location.href=`mailto:${recipient}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const quoteCarousel=document.querySelector('[data-quote-carousel]');
if(quoteCarousel){
  const slides=Array.from(quoteCarousel.querySelectorAll('[data-quote-slide]'));
  const slidesContainer=quoteCarousel.querySelector('.home-team-quote-slides');
  const prevButton=quoteCarousel.querySelector('[data-quote-prev]');
  const nextButton=quoteCarousel.querySelector('[data-quote-next]');
  let activeQuote=0;
  let touchStartX=0;
  let touchStartY=0;
  const setStableQuoteHeight=()=>{
    if(!slidesContainer||!slides.length) return;
    slidesContainer.style.height='auto';
    const width=slidesContainer.clientWidth;
    let tallest=0;
    slides.forEach(slide=>{
      const wasHidden=slide.hidden;
      slide.hidden=false;
      slide.style.position='absolute';
      slide.style.visibility='hidden';
      slide.style.pointerEvents='none';
      slide.style.width=`${width}px`;
      tallest=Math.max(tallest,slide.offsetHeight);
      slide.style.position='';
      slide.style.visibility='';
      slide.style.pointerEvents='';
      slide.style.width='';
      slide.hidden=wasHidden;
    });
    slidesContainer.style.height=`${Math.ceil(tallest)}px`;
  };
  const showQuote=index=>{
    activeQuote=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.hidden=i!==activeQuote);
  };
  showQuote(0);
  setStableQuoteHeight();
  if(document.fonts?.ready) document.fonts.ready.then(setStableQuoteHeight);
  window.addEventListener('resize',setStableQuoteHeight,{passive:true});
  prevButton?.addEventListener('click',()=>showQuote(activeQuote-1));
  nextButton?.addEventListener('click',()=>showQuote(activeQuote+1));
  quoteCarousel.addEventListener('touchstart',e=>{
    const touch=e.changedTouches[0];
    touchStartX=touch.clientX;
    touchStartY=touch.clientY;
  },{passive:true});
  quoteCarousel.addEventListener('touchend',e=>{
    const touch=e.changedTouches[0];
    const deltaX=touch.clientX-touchStartX;
    const deltaY=touch.clientY-touchStartY;
    if(Math.abs(deltaX)<45||Math.abs(deltaX)<=Math.abs(deltaY)) return;
    showQuote(deltaX<0?activeQuote+1:activeQuote-1);
  },{passive:true});
}



const clientTestimonialCarousel=document.querySelector('[data-client-testimonial-carousel]');
if(clientTestimonialCarousel){
  const slides=Array.from(clientTestimonialCarousel.querySelectorAll('[data-client-testimonial-slide]'));
  const slidesContainer=clientTestimonialCarousel.querySelector('.client-testimonials-slides');
  const prevButton=clientTestimonialCarousel.querySelector('[data-client-testimonial-prev]');
  const nextButton=clientTestimonialCarousel.querySelector('[data-client-testimonial-next]');
  let activeTestimonial=0;
  let touchStartX=0;
  let touchStartY=0;
  const setStableTestimonialHeight=()=>{
    if(!slidesContainer||!slides.length) return;
    slidesContainer.style.height='';
    slidesContainer.style.removeProperty('--testimonial-stable-height');
    const width=slidesContainer.clientWidth;
    let tallest=0;
    slides.forEach(slide=>{
      const wasHidden=slide.hidden;
      slide.hidden=false;
      slide.style.position='absolute';
      slide.style.visibility='hidden';
      slide.style.pointerEvents='none';
      slide.style.width=`${width}px`;
      tallest=Math.max(tallest,slide.scrollHeight,slide.offsetHeight);
      slide.style.position='';
      slide.style.visibility='';
      slide.style.pointerEvents='';
      slide.style.width='';
      slide.hidden=wasHidden;
    });
    slidesContainer.style.setProperty('--testimonial-stable-height',`${Math.ceil(tallest+8)}px`);
  };
  const showTestimonial=index=>{
    if(!slides.length) return;
    activeTestimonial=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{
      const active=i===activeTestimonial;
      slide.hidden=!active;
      slide.setAttribute('aria-hidden',String(!active));
      if(active) slide.classList.add('visible');
    });
  };
  showTestimonial(0);
  setStableTestimonialHeight();
  if(document.fonts?.ready) document.fonts.ready.then(setStableTestimonialHeight);
  window.addEventListener('load',setStableTestimonialHeight,{once:true});
  slides.forEach(slide=>{
    slide.querySelectorAll('img').forEach(img=>{
      if(!img.complete) img.addEventListener('load',setStableTestimonialHeight,{once:true});
    });
  });
  window.addEventListener('resize',setStableTestimonialHeight,{passive:true});
  prevButton?.addEventListener('click',()=>showTestimonial(activeTestimonial-1));
  nextButton?.addEventListener('click',()=>showTestimonial(activeTestimonial+1));
  clientTestimonialCarousel.addEventListener('touchstart',e=>{
    const touch=e.changedTouches[0];
    touchStartX=touch.clientX;
    touchStartY=touch.clientY;
  },{passive:true});
  clientTestimonialCarousel.addEventListener('touchend',e=>{
    const touch=e.changedTouches[0];
    const deltaX=touch.clientX-touchStartX;
    const deltaY=touch.clientY-touchStartY;
    if(Math.abs(deltaX)<45||Math.abs(deltaX)<=Math.abs(deltaY)) return;
    showTestimonial(deltaX<0?activeTestimonial+1:activeTestimonial-1);
  },{passive:true});
}

// Services tab navigation. Runs only on the Services page.
(()=>{
  const tabs=[...document.querySelectorAll('[data-service-tab]')];
  const panels=[...document.querySelectorAll('[data-service-panel]')];
  if(!tabs.length)return;
  const select=index=>{
    tabs.forEach((tab,i)=>{const active=i===index;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    panels.forEach((panel,i)=>{const active=i===index;panel.classList.toggle('active',active);panel.hidden=!active;});
  };
  tabs.forEach((tab,index)=>{
    tab.tabIndex=index===0?0:-1;
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
      event.preventDefault();
      let next=index;
      if(event.key==='ArrowDown')next=(index+1)%tabs.length;
      if(event.key==='ArrowUp')next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      select(next);tabs[next].focus();
    });
  });
  const hashMap={'#regulatory-compliance':0,'#engineering-services':1,'#human-factors-assessments':2,'#inspections':3};
  const serviceMap={'regulatory-compliance':0,'engineering':1,'engineering-services':1,'human-factors-assessments':2,'inspections':3};
  const mobileCards=[
    document.getElementById('mobile-regulatory-compliance'),
    document.getElementById('mobile-engineering-services'),
    document.getElementById('mobile-human-factors-assessments'),
    document.getElementById('mobile-inspections')
  ];
  const openMobileCard=index=>{
    mobileCards.forEach((card,i)=>{if(card)card.open=i===index;});
  };
  const selectRequestedService=()=>{
    const requestedService=new URLSearchParams(location.search).get('service');
    if(requestedService&&Object.prototype.hasOwnProperty.call(serviceMap,requestedService)){
      const index=serviceMap[requestedService];
      select(index);
      openMobileCard(index);
      return true;
    }
    return false;
  };
  const selectFromHash=()=>{if(Object.prototype.hasOwnProperty.call(hashMap,location.hash))select(hashMap[location.hash]);};
  if(!selectRequestedService())selectFromHash();
  window.addEventListener('hashchange',selectFromHash);
})();
