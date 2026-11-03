(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const invitation = $('invitation');
  const flight = $('cardFlight');
  const card = $('card');
  const openButton = $('openEnvelope');
  const viewer = $('imageViewer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let back = false;
  let opening = false;
  let flipping = false;
  let sequence = 0;
  let focusBeforeViewer;
  const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms));
  const state = value => { invitation.dataset.state = value; };
  const source = () => `assets/card-${back ? 'back' : 'front'}.jpg`;

  function fitCard() {
    const envelopeWidth = $('envelope').getBoundingClientRect().width;
    const cardWidth = card.offsetWidth;
    if (cardWidth) invitation.style.setProperty('--rest-scale', String(envelopeWidth * .88 / (cardWidth * 1.4)));
  }
  function updateSide() {
    card.classList.toggle('is-back', back);
    $('flipLabel').textContent = back ? 'ดูด้านหน้า' : 'ดูด้านหลัง';
    $('sideName').textContent = back ? 'ด้านหลัง' : 'ด้านหน้า';
    card.setAttribute('aria-label', back ? 'พลิกการ์ดเพื่อดูด้านหน้า' : 'พลิกการ์ดเพื่อดูด้านหลัง');
    document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === Number(back)));
    document.querySelector('.card-front').setAttribute('aria-hidden', String(back));
    document.querySelector('.card-back').setAttribute('aria-hidden', String(!back));
  }
  async function openEnvelope() {
    if (opening || invitation.dataset.state !== 'closed') return;
    opening = true;
    const currentSequence = ++sequence;
    fitCard();
    openButton.disabled = true;
    $('closedHint').style.opacity = '0';
    $('status').textContent = 'กำลังเปิดซองคำเชิญ';
    state('unsealing');
    await wait(320);
    if (currentSequence !== sequence) return;
    state('opening');
    await wait(950);
    if (currentSequence !== sequence) return;
    state('extracting');
    await wait(1050);
    if (currentSequence !== sequence) return;
    state('presenting');
    await wait(1250);
    if (currentSequence !== sequence) return;
    state('open');
    $('closedHint').hidden = true;
    $('closedHint').style.display = 'none';
    $('cardControls').hidden = false;
    flight.inert = false;
    flight.setAttribute('aria-hidden', 'false');
    opening = false;
    $('status').textContent = 'เปิดการ์ดแล้ว แตะการ์ดเพื่อพลิกดูอีกด้าน หรือกดขยายดูเพื่ออ่านข้อความ';
    card.focus({ preventScroll: true });
  }
  async function flipCard() {
    if (opening || flipping || invitation.dataset.state !== 'open') return;
    flipping = true;
    back = !back;
    updateSide();
    $('status').textContent = back ? 'กำลังแสดงการ์ดด้านหลัง' : 'กำลังแสดงการ์ดด้านหน้า';
    await wait(850);
    flipping = false;
  }
  function resetEnvelope() {
    sequence++;
    opening = false;
    flipping = false;
    back = false;
    flight.inert = true;
    flight.setAttribute('aria-hidden', 'true');
    $('cardControls').hidden = true;
    $('closedHint').hidden = false;
    $('closedHint').style.display = '';
    $('closedHint').style.opacity = '';
    openButton.disabled = false;
    updateSide();
    state('closed');
    $('status').textContent = 'เก็บการ์ดแล้ว แตะซองเพื่อเปิดอีกครั้ง';
    openButton.focus({ preventScroll: true });
  }
  function updateViewer() {
    $('zoomImage').src = source();
    $('zoomImage').alt = `ภาพต้นฉบับของการ์ด${back ? 'ด้านหลัง' : 'ด้านหน้า'}`;
    $('originalLink').href = source();
    $('viewerTitle').textContent = `การ์ด${back ? 'ด้านหลัง' : 'ด้านหน้า'}`;
    viewer.querySelector('.viewer-scroll').scrollTop = 0;
  }
  openButton.addEventListener('click', openEnvelope);
  card.addEventListener('click', flipCard);
  $('flipButton').addEventListener('click', flipCard);
  $('resetButton').addEventListener('click', resetEnvelope);
  $('zoomButton').addEventListener('click', () => {
    focusBeforeViewer = document.activeElement;
    updateViewer();
    viewer.showModal();
    $('closeViewer').focus();
  });
  $('viewerFlip').addEventListener('click', () => { back = !back; updateSide(); updateViewer(); });
  $('closeViewer').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => focusBeforeViewer?.focus());
  document.addEventListener('keydown', event => {
    if (viewer.open || invitation.dataset.state !== 'open' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); flipCard(); }
  });
  window.addEventListener('resize', () => { if (invitation.dataset.state === 'closed') fitCard(); });
  updateSide();
  fitCard();
})();
