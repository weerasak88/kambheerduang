/**
 * คัมภีร์ดวง — Shared Utilities
 * ================================
 * 1. localStorage helper — จำข้อมูลผู้ใช้ระหว่าง tools
 * 2. Cookie consent banner — สำหรับ AdSense/Analytics
 *
 * วิธีใช้: ใส่ใน <head> ของทุก HTML
 * <script src="/js/app.js"></script>
 */

// ── 1. LOCAL STORAGE HELPER ─────────────────────────────────────
const KD = {
  // บันทึกข้อมูล
  save(key, value) {
    try { localStorage.setItem('kd_' + key, JSON.stringify(value)); } catch(e) {}
  },
  // โหลดข้อมูล
  load(key, defaultValue = null) {
    try {
      const v = localStorage.getItem('kd_' + key);
      return v !== null ? JSON.parse(v) : defaultValue;
    } catch(e) { return defaultValue; }
  },
  // ลบข้อมูล
  remove(key) {
    try { localStorage.removeItem('kd_' + key); } catch(e) {}
  },
  // ลบทั้งหมด
  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('kd_'))
        .forEach(k => localStorage.removeItem(k));
    } catch(e) {}
  }
};

// ── 2. AUTO-FILL INPUTS ─────────────────────────────────────────
// เรียก KD.autoFill() เมื่อ page โหลด จะกรอกข้อมูลเดิมให้อัตโนมัติ
KD.autoFill = function(fields) {
  fields.forEach(({ id, storageKey }) => {
    const el = document.getElementById(id);
    if (!el) return;
    // โหลดค่าเดิม
    const saved = KD.load(storageKey);
    if (saved !== null) el.value = saved;
    // บันทึกทุกครั้งที่เปลี่ยน
    el.addEventListener('change', () => KD.save(storageKey, el.value));
    el.addEventListener('input',  () => KD.save(storageKey, el.value));
  });
};

// ── 3. COOKIE CONSENT BANNER ────────────────────────────────────
KD.initCookieBanner = function() {
  // ถ้ายอมรับแล้ว ไม่แสดงอีก
  if (KD.load('cookie_consent')) return;

  const banner = document.createElement('div');
  banner.id = 'kd-cookie-banner';
  banner.innerHTML = `
    <div style="
      position:fixed; bottom:0; left:0; right:0; z-index:9999;
      background:#16161f; border-top:1px solid rgba(255,255,255,0.1);
      padding:1rem 1.5rem; display:flex; align-items:center;
      justify-content:space-between; gap:1rem; flex-wrap:wrap;
      font-family:'Sarabun',sans-serif; font-size:13px; color:#9b9aaa;
      box-shadow:0 -4px 20px rgba(0,0,0,0.4);
    ">
      <div style="flex:1; min-width:200px; line-height:1.6">
        🍪 เราใช้ cookie เพื่อปรับปรุงประสบการณ์การใช้งาน
        และวิเคราะห์สถิติผู้เข้าชม
        <a href="/privacy.html" style="color:#c9a84c; text-decoration:none"> อ่านนโยบายความเป็นส่วนตัว</a>
      </div>
      <div style="display:flex; gap:8px; flex-shrink:0">
        <button id="kd-cookie-decline" style="
          padding:7px 16px; border:1px solid rgba(255,255,255,0.15);
          border-radius:20px; background:transparent; color:#9b9aaa;
          font-size:13px; cursor:pointer; font-family:'Sarabun',sans-serif;
        ">ปฏิเสธ</button>
        <button id="kd-cookie-accept" style="
          padding:7px 20px; border:none; border-radius:20px;
          background:#c9a84c; color:#0a0a10;
          font-size:13px; font-weight:500; cursor:pointer;
          font-family:'Sarabun',sans-serif;
        ">ยอมรับ</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('kd-cookie-accept').onclick = function() {
    KD.save('cookie_consent', { accepted: true, date: Date.now() });
    banner.remove();
    // TODO: โหลด Google Analytics หลังจากยอมรับ
    // KD.loadAnalytics();
  };
  document.getElementById('kd-cookie-decline').onclick = function() {
    KD.save('cookie_consent', { accepted: false, date: Date.now() });
    banner.remove();
  };
};

// ── 4. LOAD ANALYTICS (เรียกหลัง consent) ──────────────────────
KD.loadAnalytics = function(gaId) {
  if (!gaId) return;
  const consent = KD.load('cookie_consent');
  if (!consent?.accepted) return;
  // โหลด GA4 script
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', gaId);
};

// ── 5. AUTO-INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  KD.initCookieBanner();
});
