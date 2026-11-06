(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const invitation = $('invitation');
  const flight = $('cardFlight');
  const card = $('card');
  const openButton = $('openEnvelope');
  const envelopeTurn = $('envelopeTurn');
  const envelopeRotor = $('envelopeRotor');
  const envelopeFlipButton = $('envelopeFlipButton');
  const closedControls = $('closedControls');
  const viewer = $('imageViewer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let back = false;
  let opening = false;
  let flipping = false;
  let sequence = 0;
  let envelopeBack = false;
  let envelopeAngle = 0;
  let drag = null;
  let ignorePointerClickUntil = 0;
  const cancelledPointers = new Set();
  let focusBeforeViewer;
  const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms));
  const state = value => { invitation.dataset.state = value; };
  const source = () => `assets/card-${back ? 'back' : 'front'}.jpg`;
  const canTurnEnvelope = () => !opening && invitation.dataset.state === 'closed';
  const rotateEnvelope = angle => envelopeRotor.style.setProperty('--envelope-angle', `${angle}deg`);

  function fitCard() {
    const envelopeWidth = $('envelope').getBoundingClientRect().width;
    const cardWidth = card.offsetWidth;
    if (cardWidth) invitation.style.setProperty('--rest-scale', String(envelopeWidth * .88 / (cardWidth * 1.4)));
  }
  function updateEnvelopeSide(announce = true) {
    invitation.dataset.envelopeSide = envelopeBack ? 'back' : 'front';
    $('envelopeSide').textContent = envelopeBack ? 'ด้านเรียบ' : 'ด้านผนึก';
    envelopeFlipButton.setAttribute('aria-pressed', String(envelopeBack));
    envelopeFlipButton.setAttribute('aria-label', envelopeBack ? 'พลิกซองไปด้านผนึก' : 'พลิกซองไปด้านเรียบ');
    envelopeTurn.setAttribute('aria-label', `เปิดคำเชิญจาก${envelopeBack ? 'ด้านเรียบ' : 'ด้านผนึก'}ของซอง`);
    if (announce) $('status').textContent = envelopeBack ? 'ด้านเรียบของซอง พร้อมป้ายเรียนเชิญ สามารถกดเปิดคำเชิญได้' : 'ด้านผนึกของซอง สามารถกดเปิดคำเชิญได้';
  }
  function finishDrag() {
    if (!drag) return;
    const pointerId = drag.id;
    drag = null;
    envelopeTurn.classList.remove('is-dragging');
    if (envelopeTurn.hasPointerCapture(pointerId)) envelopeTurn.releasePointerCapture(pointerId);
  }
  function cancelDrag(suppressClick = true) {
    if (!drag) return;
    if (suppressClick) {
      cancelledPointers.add(drag.id);
      ignorePointerClickUntil = Date.now() + 650;
    }
    finishDrag();
    rotateEnvelope(envelopeAngle);
  }
  function flipEnvelope(direction = 1) {
    if (!canTurnEnvelope()) return;
    cancelDrag();
    envelopeAngle += direction * 180;
    envelopeBack = !envelopeBack;
    rotateEnvelope(envelopeAngle);
    updateEnvelopeSide();
  }
  function updateSide() {
    card.classList.toggle('is-back', back);
    $('flipLabel').textContent = back ? 'ดูด้านหน้า' : 'ดูด้านหลัง';
    $('sideName').textContent = back ? 'ด้านหลัง' : 'ด้านหน้า';
    card.setAttribute('aria-label', back ? 'พลิกการ์ดเพื่อดูด้านหน้า' : 'พลิกการ์ดเพื่อดูด้านหลัง');
    document.querySelectorAll('#sideIndicator .dot').forEach((dot, i) => dot.classList.toggle('active', i === Number(back)));
    document.querySelector('.card-front').setAttribute('aria-hidden', String(back));
    document.querySelector('.card-back').setAttribute('aria-hidden', String(!back));
  }
  async function openEnvelope() {
    if (opening || invitation.dataset.state !== 'closed') return;
    cancelDrag();
    opening = true;
    const currentSequence = ++sequence;
    openButton.disabled = true;
    envelopeTurn.disabled = true;
    envelopeFlipButton.disabled = true;
    // Always expose the flap before playing the original opening sequence.
    if (envelopeBack) {
      envelopeBack = false;
      envelopeAngle = Math.round(envelopeAngle / 360) * 360;
      rotateEnvelope(envelopeAngle);
      updateEnvelopeSide(false);
      $('status').textContent = 'กำลังพลิกซองกลับเพื่อเปิดคำเชิญ';
      await wait(650);
      if (currentSequence !== sequence) return;
    }
    fitCard();
    closedControls.style.opacity = '0';
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
    closedControls.hidden = true;
    $('cardControls').hidden = false;
    flight.inert = false;
    flight.setAttribute('aria-hidden', 'false');
    opening = false;
    $('status').textContent = 'เปิดการ์ดแล้ว แตะการ์ดเพื่อพลิกดูอีกด้าน หรือกดขยายดูเพื่ออ่านข้อความ';
    if (!$('photoViewer').open) card.focus({ preventScroll: true });
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
    cancelDrag();
    opening = false;
    flipping = false;
    back = false;
    envelopeBack = false;
    envelopeAngle = 0;
    ignorePointerClickUntil = 0;
    envelopeTurn.classList.add('without-turn-animation');
    rotateEnvelope(0);
    requestAnimationFrame(() => requestAnimationFrame(() => envelopeTurn.classList.remove('without-turn-animation')));
    updateEnvelopeSide(false);
    flight.inert = true;
    flight.setAttribute('aria-hidden', 'true');
    $('cardControls').hidden = true;
    closedControls.hidden = false;
    closedControls.style.opacity = '';
    openButton.disabled = false;
    envelopeTurn.disabled = false;
    envelopeFlipButton.disabled = false;
    updateSide();
    state('closed');
    $('status').textContent = 'เก็บการ์ดแล้ว ลากซองเพื่อพลิก หรือกดเปิดคำเชิญอีกครั้ง';
    openButton.focus({ preventScroll: true });
  }
  function updateViewer() {
    $('zoomImage').src = source();
    $('zoomImage').alt = `ภาพต้นฉบับของการ์ด${back ? 'ด้านหลัง' : 'ด้านหน้า'}`;
    $('originalLink').href = source();
    $('viewerTitle').textContent = `การ์ด${back ? 'ด้านหลัง' : 'ด้านหน้า'}`;
    viewer.querySelector('.viewer-scroll').scrollTop = 0;
  }

  envelopeTurn.addEventListener('pointerdown', event => {
    if (!event.isPrimary) { cancelDrag(); return; }
    if (!canTurnEnvelope() || event.button !== 0) return;
    cancelledPointers.delete(event.pointerId);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, angle: envelopeAngle, width: envelopeTurn.offsetWidth, horizontal: false };
  });
  envelopeTurn.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId || !canTurnEnvelope()) return;
    if (event.pointerType === 'mouse' && event.buttons === 0) { cancelDrag(); return; }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 9) return;
      if (Math.abs(dy) >= Math.abs(dx)) { cancelDrag(); return; }
      drag.horizontal = true;
      envelopeTurn.setPointerCapture(event.pointerId);
      envelopeTurn.classList.add('is-dragging');
    }
    const progress = Math.max(-1, Math.min(1, dx / Math.max(drag.width * .7, 1)));
    rotateEnvelope(drag.angle + progress * 180);
  });
  envelopeTurn.addEventListener('pointerup', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const horizontal = drag.horizontal;
    const threshold = Math.max(28, Math.min(64, drag.width * .14));
    if (horizontal) {
      ignorePointerClickUntil = Date.now() + 650;
      if (Math.abs(dx) >= threshold) {
        envelopeAngle = drag.angle + (dx < 0 ? -180 : 180);
        envelopeBack = !envelopeBack;
        updateEnvelopeSide();
      }
    }
    finishDrag();
    rotateEnvelope(envelopeAngle);
  });
  envelopeTurn.addEventListener('pointercancel', () => cancelDrag());
  envelopeTurn.addEventListener('lostpointercapture', () => cancelDrag());
  // Keep a cancelled contact suppressed until release, even after a long hold.
  // Bubbling runs after the normal in-envelope pointerup handler has finished.
  const releasePointer = event => {
    if (drag && drag.id === event.pointerId) cancelDrag();
    if (cancelledPointers.delete(event.pointerId)) ignorePointerClickUntil = Date.now() + 650;
  };
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  // A second contact may start a pinch outside the envelope; abandon the turn.
  window.addEventListener('pointerdown', event => { if (drag && !event.isPrimary) cancelDrag(); }, true);
  window.addEventListener('blur', () => cancelDrag());
  envelopeTurn.addEventListener('click', event => {
    if (event.detail !== 0 && Date.now() < ignorePointerClickUntil) return;
    openEnvelope();
  });
  envelopeFlipButton.addEventListener('click', () => flipEnvelope());
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
    if (viewer.open || $('photoViewer').open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape' && drag) { cancelDrag(); return; }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (canTurnEnvelope() && [envelopeTurn, envelopeFlipButton, openButton].includes(event.target)) {
      event.preventDefault();
      flipEnvelope(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (invitation.dataset.state === 'open') {
      event.preventDefault();
      flipCard();
    }
  });
  window.addEventListener('resize', () => {
    cancelDrag();
    if (invitation.dataset.state === 'closed') fitCard();
  });
  updateEnvelopeSide(false);
  updateSide();
  fitCard();
})();
