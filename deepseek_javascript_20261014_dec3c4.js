// ===== Matrix Efekti =====
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\{}[]$#@!';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  // Siyah yarı saydam arka plan (iz bırakma efekti)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);

// Pencere boyutu değişince yeniden boyutlandır
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ===== Terminal Yazma Efekti =====
const terminalBody = document.getElementById('terminalBody');

// Yazılacak komutlar
const lines = [
  { text: 'root@hacker:~$ nmap -sS hedef.site', type: 'cmd' },
  { text: '> Tarama başlatıldı... 3 port açık bulundu.', type: 'out' },
  { text: 'root@hacker:~$ echo "Erişim sağlandı ✓"', type: 'cmd' },
  { text: '> Erişim sağlandı ✓', type: 'out' },
  { text: 'root@hacker:~$ ./sistem_bilgisi.sh', type: 'cmd' },
  { text: '> OS: Linux 6.6.1 | Uptime: 1337 gün | Status: ONLINE', type: 'out' },
];

let currentLine = 0;
let currentChar = 0;
let currentEl = null;

// Mevcut imleci kaldır, yeniden başlat
function startTyping() {
  // Temizle ve yeniden başlat
  const initialHTML = terminalBody.innerHTML;
  // İlk statik kısmı koru, dinamik kısmı ekle
  typeNext();
}

function typeNext() {
  if (currentLine >= lines.length) {
    // Sonsuz döngü: baştan başlat
    const dynamicPart = terminalBody.querySelectorAll('.dynamic-line');
    dynamicPart.forEach(el => el.remove());
    currentLine = 0;
    currentChar = 0;
    setTimeout(typeNext, 1500);
    return;
  }

  const line = lines[currentLine];

  if (!currentEl) {
    currentEl = document.createElement('p');
    currentEl.classList.add('dynamic-line');
    terminalBody.appendChild(currentEl);

    if (line.type === 'cmd') {
      currentEl.innerHTML = '<span class="prompt">root@hacker</span>:<span class="path">~</span>$ <span class="typing-text"></span><span class="cursor">█</span>';
    } else {
      currentEl.classList.add('output');
      currentEl.innerHTML = '<span class="typing-text"></span>';
    }
  }

  const textSpan = currentEl.querySelector('.typing-text');

  if (currentChar < line.text.length) {
    textSpan.textContent += line.text[currentChar];
    currentChar++;
    setTimeout(typeNext, line.type === 'cmd' ? 50 : 20);
  } else {
    // Satır bitti
    if (line.type === 'cmd') {
      const cursor = currentEl.querySelector('.cursor');
      if (cursor) cursor.remove();
    }
    currentEl = null;
    currentChar = 0;
    currentLine++;
    setTimeout(typeNext, 400);
  }
}

// Sayfa yüklendiğinde yazmaya başla
window.addEventListener('load', () => {
  setTimeout(startTyping, 1000);
});