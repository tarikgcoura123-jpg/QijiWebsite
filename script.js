const header=document.querySelector('.site-header');
const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>24);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});
const setMenuState=open=>{
  nav?.classList.toggle('open',open);
  menuBtn?.setAttribute('aria-expanded',String(open));
  menuBtn?.setAttribute('aria-label',open?'Close navigation':'Open navigation');
};
menuBtn?.addEventListener('click',()=>setMenuState(!nav?.classList.contains('open')));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuState(false)));
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
