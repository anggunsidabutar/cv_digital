/* ============ DATA KEAHLIAN: ubah nama dan deskripsinya ============ */
const SKILLS = [
  { id: 'teknologi',  name: 'Teknologi',  color: '#6b4e71', desc: 'Microsoft Office, Microsoft Excel, Powerpoint, HTML, CSS, Xampp, Github, Canva, Visual Studio Code, Cmd dan dasar pemograman.' },
  { id: 'komunikasi', name: 'Komunikasi', color: '#e9dbc6', desc: 'Berbicara didepan umum, kerja sama tim, dan komunikasi antarpribadi.' }
];

/* ============ DATA PROYEK TETAP ============
   skill = id keahlian di atas. image = alamat gambar (opsional), mis. "img/proyek1.jpg" */
const PROJECTS = [
  {
    title: 'Website Profile Jasa MUA',
    desc: 'Rancangan website untuk salon dan jasa makeup artist, dibuat dengan HTML,CSS DAN aplikasi VISUAL STUDIO CODE.',
    link: 'https://anggunsidabutar.github.io/website-mua/',
    skill: 'teknologi',
    image: 'foto/foto projek1.png'
  },
  {
    title: 'Cv-Digital',
    desc: 'CV digital interaktif yang merangkum rekam jejak profesional, keahlian utama, serta portofolio karya saya secara terstruktur untuk memudahkan proses rekrutmen dan kolaborasi.',
    link: 'https://anggunsidabutar.github.io/cv_digital/',
    skill: 'teknologi',
    image: 'foto/foto projek2.png'
  },
];

/* ============ MESIN HALAMAN  ============ */
const KEY = 'cv_proyek_tambahan_v1';
const $ = id => document.getElementById(id);
let active = 'semua';

function loadStored() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function saveStored(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
}
const skillById = id => SKILLS.find(s => s.id === id);
function safeUrl(u) {
  u = (u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch (e) { return ''; }
}

function renderTabs() {
  const tabs = $('tabs'); tabs.innerHTML = '';
  [{ id: 'semua', name: 'Semua' }, ...SKILLS].forEach(s => {
    const b = document.createElement('button');
    b.className = 'tab'; b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', s.id === active);
    b.textContent = s.name;
    b.onclick = () => { active = s.id; render(); };
    tabs.appendChild(b);
  });
  const sel = $('fSkill'); sel.innerHTML = '';
  SKILLS.forEach(s => { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; sel.appendChild(o); });
}

function render() {
  renderTabs();
  const info = $('skillInfo'); info.innerHTML = '';
  const h = document.createElement('h3'); const p = document.createElement('p');
  if (active === 'semua') {
    h.textContent = 'Semua keahlian';
    p.textContent = 'Seluruh proyek dari semua keahlian ditampilkan di sini.';
    info.style.borderLeftColor = '#2e2a33';
  } else {
    const s = skillById(active);
    h.textContent = s.name; p.textContent = s.desc; info.style.borderLeftColor = s.color;
  }
  info.append(h, p);

  const stored = loadStored().map((x, i) => ({ ...x, _stored: i }));
  const all = [...PROJECTS, ...stored].filter(x => active === 'semua' || x.skill === active);
  $('count').textContent = all.length + ' proyek';

  const wrap = $('projects'); wrap.innerHTML = '';
  if (!all.length) return;
  all.forEach(x => {
    const s = skillById(x.skill) || { name: 'Lainnya', color: '#cddbe5' };
    const card = document.createElement('article'); card.className = 'proj';
    const th = document.createElement('div'); th.className = 'thumb'; th.style.setProperty('--c', s.color);
      if (s.color === '#6b4e71') th.style.color = '#fff';
    if (x.image) {
      const im = document.createElement('img'); im.src = x.image; im.alt = 'Gambar ' + x.title;
      im.onerror = () => { im.remove(); th.textContent = (x.title || '?').charAt(0).toUpperCase(); };
      th.appendChild(im);
    }
    else { th.textContent = (x.title || '?').charAt(0).toUpperCase(); }
    const body = document.createElement('div'); body.className = 'proj-body';
    const tag = document.createElement('span'); tag.className = 'tag'; tag.style.setProperty('--c', s.color); tag.textContent = s.name;
    if (s.color === '#6b4e71') tag.style.color = '#fff';
    const t = document.createElement('h4'); t.textContent = x.title;
    const d = document.createElement('p'); d.textContent = x.desc;
    const act = document.createElement('div'); act.className = 'proj-act';
    const url = safeUrl(x.link);
    if (url) {
      const a = document.createElement('a'); a.className = 'btn dark small'; a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Buka proyek';
      act.appendChild(a);
    }
    if (x._stored !== undefined) {
      const del = document.createElement('button'); del.className = 'del'; del.type = 'button'; del.textContent = 'Hapus';
      del.onclick = () => {
        if (!confirm('Hapus proyek "' + x.title + '"?')) return;
        const list = loadStored(); list.splice(x._stored, 1); saveStored(list); render();
      };
      act.appendChild(del);
    }
    body.append(tag, t, d, act);
    card.append(th, body); wrap.appendChild(card);
  });
}

// Perkecil gambar agar muat di penyimpanan browser
function shrink(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const w = Math.min(640, img.width), h = Math.round(img.height * (w / img.width));
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', 0.75));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

const dlg = $('dlg');
$('openAdd').onclick = () => {
  $('addForm').reset(); $('err').textContent = '';
  if (active !== 'semua') $('fSkill').value = active;
  dlg.showModal();
};
$('cancelAdd').onclick = () => dlg.close();
$('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const link = $('fLink').value.trim();
  if (link && !safeUrl(link)) { $('err').textContent = 'Tautan tidak valid. Gunakan alamat yang diawali https://'; return; }
  let image = '';
  const f = $('fImg').files[0];
  if (f) { try { image = await shrink(f); } catch (x) { $('err').textContent = 'Gambar tidak bisa dibaca. Coba file lain.'; return; } }
  const list = loadStored();
  list.push({ title: $('fTitle').value.trim(), desc: $('fDesc').value.trim(), link: safeUrl(link), skill: $('fSkill').value, image });
  if (!saveStored(list)) { $('err').textContent = 'Penyimpanan penuh. Coba gambar yang lebih kecil atau tanpa gambar.'; return; }
  active = $('fSkill').value; dlg.close(); render();
  $('keahlian').scrollIntoView();
});

$('copyData').onclick = async () => {
  const text = JSON.stringify(loadStored(), null, 2);
  try { await navigator.clipboard.writeText(text); alert('Data proyek tambahan sudah disalin. Tempel ke dalam daftar PROJECTS di kode.'); }
  catch (e) { prompt('Salin data di bawah ini:', text); }
};

/* ============ Menu aktif & tahun ============ */
$('tahun').textContent = new Date().getFullYear();
const links = [...document.querySelectorAll('#nav a')];
const io = new IntersectionObserver(es => {
  es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)); });
}, { rootMargin: '-40% 0px -55% 0px' });
links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });

render();
