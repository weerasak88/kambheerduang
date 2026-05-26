/**
 * คัมภีร์ดวง — Cookie Consent + Google Analytics
 * =================================================
 * วาง: C:\zkambheer\kambheerduang\js\cookie-consent.js
 * ใส่ใน <head>: <script src="/js/cookie-consent.js"></script>
 */

(function() {
  const GA_ID = 'G-0BRJVKR6BV';
  const CONSENT_KEY = 'kd_cookie_consent';

  // ── โหลด GA4 ──────────────────────────────────────
  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // ── ตรวจสอบ consent เดิม ──────────────────────────
  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); }
    catch(e) { return null; }
  }

  function saveConsent(accepted) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted, date: Date.now() })); }
    catch(e) {}
  }

  // ── แสดง banner ───────────────────────────────────
  function showBanner() {
    const el = document.createElement('div');
    el.id = 'kd-cookie-banner';
    el.innerHTML = `
      <div style="
        position:fixed;bottom:0;left:0;right:0;z-index:99999;
        background:#16161f;
        border-top:1px solid rgba(255,255,255,0.1);
        padding:1rem 1.5rem;
        display:flex;align-items:center;
        justify-content:space-between;
        gap:1rem;flex-wrap:wrap;
        font-family:'Sarabun',sans-serif;
        font-size:13px;color:#9b9aaa;
        box-shadow:0 -4px 24px rgba(0,0,0,0.5);
      ">
        <div style="flex:1;min-width:200px;line-height:1.6">
          <strong style="color:#f0ede6;display:block;margin-bottom:4px">
            🍪 เราใช้คุกกี้เพื่อพัฒนาประสบการณ์ของคุณ
          </strong>
          เราใช้คุกกี้วิเคราะห์เพื่อทำความเข้าใจการใช้งานเว็บไซต์
          ข้อมูลดวงของคุณไม่ถูกเก็บหรือส่งต่อ
          <a href="/privacy.html"
            style="color:#c9a84c;text-decoration:none;margin-left:4px">
            นโยบายความเป็นส่วนตัว
          </a>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button id="kd-cookie-decline" style="
            padding:8px 18px;
            border:1px solid rgba(255,255,255,0.15);
            border-radius:20px;background:transparent;
            color:#9b9aaa;font-size:13px;cursor:pointer;
            font-family:'Sarabun',sans-serif;
          ">ปฏิเสธ</button>
          <button id="kd-cookie-accept" style="
            padding:8px 22px;border:none;
            border-radius:20px;background:#c9a84c;
            color:#0a0a10;font-size:13px;
            font-weight:500;cursor:pointer;
            font-family:'Sarabun',sans-serif;
          ">ยอมรับ</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('kd-cookie-accept').onclick = function() {
      saveConsent(true);
      el.remove();
      loadGA();
    };

    document.getElementById('kd-cookie-decline').onclick = function() {
      saveConsent(false);
      el.remove();
    };
  }

  // ── init ──────────────────────────────────────────
  function init() {
    const consent = getConsent();
    if (consent === null) {
      // ยังไม่เคยเลือก → แสดง banner
      showBanner();
    } else if (consent.accepted) {
      // ยอมรับแล้ว → โหลด GA เลย
      loadGA();
    }
    // ปฏิเสธแล้ว → ไม่ทำอะไร
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
