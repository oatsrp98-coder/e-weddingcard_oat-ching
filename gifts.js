(() => {
  'use strict';
  const details = window.weddingGiftDetails || {};
  const fields = [
    ['bankName', 'giftBankName'],
    ['accountNumber', 'giftAccountNumber'],
    ['accountName', 'giftAccountName']
  ];
  const text = key => typeof details[key] === 'string' ? details[key].trim() : '';
  let completedFields = 0;
  fields.forEach(([key, id]) => {
    if (!text(key)) return;
    const element = document.getElementById(id);
    element.textContent = text(key);
    element.classList.remove('awaiting-details');
    completedFields++;
  });
  const pending = document.getElementById('giftPending');
  if (completedFields === fields.length) pending.hidden = true;
  const qr = text('qrImage');
  if (!qr) return;
  const image = document.getElementById('giftQrImage');
  const placeholder = document.getElementById('giftQrPlaceholder');
  image.addEventListener('load', () => {
    image.hidden = false;
    placeholder.hidden = true;
  });
  image.addEventListener('error', () => {
    image.hidden = true;
    placeholder.hidden = false;
  });
  image.src = qr;
})();
