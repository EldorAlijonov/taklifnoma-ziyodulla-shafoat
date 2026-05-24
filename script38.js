document.querySelector('.scroll-hint').addEventListener('click', function() {
  const target = document.getElementById('section11');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

const video = document.getElementById('heroVideo');
const canvas = document.getElementById('bokehCanvas');
function spawnOrbs() {
    const colors = ['rgba(220,220,220,VAR)','rgba(240,240,240,VAR)','rgba(200,200,200,VAR)','rgba(255,255,255,VAR)','rgba(230,230,230,VAR)'];
    for (let i = 0; i < 18; i++) {
        const orb = document.createElement('div'); orb.className = 'bokeh-orb';
        const size = 60 + Math.random() * 180, op = (.15 + Math.random() * .25).toFixed(2);
        const color = colors[Math.floor(Math.random() * colors.length)].replace('VAR', op);
        orb.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${10+Math.random()*80}%;background:${color};--dur:${7+Math.random()*8}s;--delay:${-Math.random()*10}s;--op:${op};`;
        if (canvas) canvas.appendChild(orb);
    }
}
spawnOrbs();
if (video && canvas) {
    video.addEventListener('error', () => { canvas.style.opacity = '1'; });
    video.addEventListener('playing', () => { canvas.style.opacity = '0'; canvas.style.transition = 'opacity 1s'; });
}

const unlockScreen = document.getElementById('unlock-screen');
const unlockBtn = document.getElementById('unlockBtn');
const musicToggleUnlock = document.getElementById('musicToggleUnlock');
const langBtns = document.querySelectorAll('.lang-btn');


// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР ==========
// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР С ПОДДЕРЖКОЙ СМЕНЫ ЯЗЫКА ==========
(function() {
    // Создаём аудио элемент
    const musicFile = 'music/toylar-muborak.mp3';
    const bgMusic = new Audio(musicFile);
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    let isMusicPlaying = false;
    let currentLanguage = 'uz';
    
    const musicFiles = {
        ru: musicFile,
        uz: musicFile,
        uzk: musicFile,
        en: musicFile
    };
    
    // Делаем функцию доступной глобально
    window.changeMusicByLanguage = function(lang) {
        if (!lang || lang === currentLanguage) return;
        
        currentLanguage = lang;
        const wasPlaying = isMusicPlaying;
        const currentTime = bgMusic.currentTime;
        
        const newMusicFile = musicFiles[lang] || musicFiles.uz;
        if (!newMusicFile) return;
        
        if (bgMusic.src.includes(newMusicFile)) return;
        
        bgMusic.pause();
        bgMusic.src = newMusicFile;
        bgMusic.load();
        
        if (wasPlaying) {
            bgMusic.currentTime = currentTime;
            bgMusic.play().catch(error => {
                console.log('Ошибка воспроизведения после смены языка:', error);
            });
        }
    };    
    // Функция для включения музыки
    function playMusic() {
        if (!bgMusic.src) {
            updateMusicIcon(musicToggleUnlock, false);
            if (musicToggleMain) updateMusicIcon(musicToggleMain, false);
            return;
        }

        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicIcon(musicToggleUnlock, true);
            if (musicToggleMain) updateMusicIcon(musicToggleMain, true);
        }).catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
        });
    }
    
    // Функция для выключения музыки
    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicIcon(musicToggleUnlock, false);
        if (musicToggleMain) updateMusicIcon(musicToggleMain, false);
    }
    
    // Переключение музыки
    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // Функция для обновления иконки
    function updateMusicIcon(button, isPlaying) {
        if (!button) return;
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        if (isPlaying) {
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <path d="M18 8c1.5 1.5 2 3.5 2 6s-0.5 4.5-2 6"/>
                <path d="M21 5c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9"/>
            `;
        } else {
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <line x1="18" y1="8" x2="22" y2="12"/>
                <line x1="22" y1="8" x2="18" y2="12"/>
            `;
        }
    }
    
    // Обработчики кнопок
    const musicToggleUnlock = document.getElementById('musicToggleUnlock');
    const musicToggleMain = document.getElementById('musicToggleMain');
    
    if (musicToggleUnlock) {
        musicToggleUnlock.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }
    
    if (musicToggleMain) {
        musicToggleMain.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    updateMusicIcon(musicToggleUnlock, false);
    if (musicToggleMain) updateMusicIcon(musicToggleMain, false);
    
    // Включаем музыку при разблокировке
    const unlockBtnForMusic = document.getElementById('unlockBtn');
    if (unlockBtnForMusic) {
        unlockBtnForMusic.addEventListener('click', () => {
            setTimeout(() => {
                if (!isMusicPlaying) {
                    playMusic();
                }
            }, 500);
        });
    }
    
    // Первое взаимодействие
    const anyInteraction = () => {
        if (!isMusicPlaying) {
            playMusic();
        }
        document.removeEventListener('click', anyInteraction);
        document.removeEventListener('touchstart', anyInteraction);
    };
    
    document.addEventListener('click', anyInteraction);
    document.addEventListener('touchstart', anyInteraction);
})();


if (unlockBtn && unlockScreen) {
unlockBtn.addEventListener('click', () => {
    unlockBtn.style.transform = "scale(0.92)";
    setTimeout(() => { unlockBtn.style.transform = ""; }, 120);
    unlockScreen.classList.add('opening');
    unlockScreen.querySelector('.unlock-center').classList.add('unlock-opening');
    
    
    setTimeout(() => {
        unlockScreen.classList.add('hidden');
        document.body.classList.remove('overflowH');
        document.body.classList.add('loaded');
        loadGuestsFromDB();
    }, 1200);
});

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ ==========

}

const LOCAL_GUESTS_KEY = 'taklifnomaGuests';

function shouldUseLocalGuests() {
    return ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
}

function getStoredGuests() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_GUESTS_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveStoredGuest(formData) {
    const guests = getStoredGuests();
    const now = new Date();
    const time = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const guest = {
        name: formData.name,
        guest_count: formData.guestCount,
        status: formData.attendance === 'no' ? 'declined' : 'confirmed',
        comment: formData.comment,
        time
    };

    guests.unshift(guest);
    localStorage.setItem(LOCAL_GUESTS_KEY, JSON.stringify(guests));
    return guests;
}

async function loadGuestsFromDB() {
    if (shouldUseLocalGuests()) {
        const storedGuests = getStoredGuests();
        if (storedGuests.length > 0) {
            renderGuestsTable(storedGuests);
            updateStatsFromGuestsData(storedGuests);
        }
        return;
    }

    try {
        const response = await fetch('get_guests');
        if (!response.ok) {
            throw new Error('Guest backend is unavailable');
        }
        const result = await response.json();
        
        if (result.success && result.guests) {
            renderGuestsTable(result.guests);
            updateStatsFromGuestsData(result.guests);
        } else {
            console.error('Failed to load guests:', result.error);
            const tbody = document.getElementById('guestsTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Hech qanday mehmon topilmadi</td></tr>';
                resetStatsToZero();
            }
        }
    } catch (error) {
        const storedGuests = getStoredGuests();
        const tbody = document.getElementById('guestsTableBody');
        if (storedGuests.length > 0) {
            renderGuestsTable(storedGuests);
            updateStatsFromGuestsData(storedGuests);
        } else if (tbody && tbody.querySelector('.empty-row')) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Hozircha mehmonlar ro‘yxati bo‘sh</td></tr>';
            resetStatsToZero();
        }
    }
}

function renderGuestsTable(guests) {
    const tbody = document.getElementById('guestsTableBody');
    if (!tbody) return;
    
    if (!guests || guests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Hech qanday mehmon topilmadi</td></tr>';
        return;
    }
    
    let html = '';
    
    // Добавляем index (0, 1, 2...) в параметры цикла
    guests.forEach((guest, index) => {
        let statusClass = '';
        let statusText = '';
        
        switch(guest.status) {
            case 'confirmed':
                statusText = 'Tasdiqlangan';
                statusClass = 'status-confirmed';
                break;
            case 'declined':
                statusText = 'Kela olmaydi';
                statusClass = 'status-declined';
                break;
            default:
                statusText = 'Kutilmoqda';
                statusClass = 'status-pending';
        }
        
        const statusBadge = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(guest.name)}</strong></td>
                <td>${guest.guest_count}</td>
                <td>${statusBadge}</td>
                <td>${escapeHtml(guest.comment || '—')}</td>
                <td class="time-cell">${guest.time || '—'}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function updateStatsFromGuestsData(guests) {
    let total = 0;
    let confirmed = 0;
    let declined = 0;
    
    guests.forEach(guest => {
        const count = parseInt(guest.guest_count) || 0;
        total += count;
        
        if (guest.status === 'confirmed') {
            confirmed += count;
        } else if (guest.status === 'declined') {
            declined += count;
        }
    });
    
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = total;
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (declinedEl) declinedEl.textContent = declined;
}

function resetStatsToZero() {
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = '0';
    if (confirmedEl) confirmedEl.textContent = '0';
    if (declinedEl) declinedEl.textContent = '0';
}

function escapeHtml(str) {
    if (!str) return "—";
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== GUEST SELECTOR ==========
(function() {
    const guestCountSpan = document.querySelector('.guest-count');
    const minusBtn = document.querySelector('.guest-minus');
    const plusBtn = document.querySelector('.guest-plus');
    let count = 1;
    const max = 5;
    const min = 1;

    if (minusBtn && plusBtn && guestCountSpan) {
        window.setGuestCount = function(nextCount) {
            count = Math.min(max, Math.max(min, nextCount));
            guestCountSpan.textContent = count;
        };

        minusBtn.addEventListener('click', () => {
            if (count > min) {
                count--;
                guestCountSpan.textContent = count;
            }
        });

        plusBtn.addEventListener('click', () => {
            if (count < max) {
                count++;
                guestCountSpan.textContent = count;
            }
        });
    }
})();

// ========== TIMER ==========
function updateLuxuryTimer() {
    const targetDate = new Date(2026, 7, 7, 14, 0, 0);
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').innerHTML = '0';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
}

updateLuxuryTimer();
setInterval(updateLuxuryTimer, 1000);

// ========== SHARE FUNCTIONALITY ==========
(function() {
    const currentUrl = window.location.href;
    
    const telegramBtn = document.getElementById('telegramShare');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`;
            window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    const whatsappBtn = document.getElementById('whatsappShare');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyNote = document.getElementById('copyNote');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUrl);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            } catch (err) {
                console.error('Nusxa olishda xatolik:', err);
                const textarea = document.createElement('textarea');
                textarea.value = currentUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            }
        });
    }
})();

// ========== LANGUAGE TRANSLATIONS ==========
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        
        if (typeof changeMusicByLanguage === 'function') {
            changeMusicByLanguage(lang);
        }
        
        const translations = {
            ru: { 
                title: 'ВЫ ПОЛУЧИЛИ ПРИГЛАШЕНИЕ', 
                instruction: 'Нажмите на замок,', 
                instruction1: 'чтобы открыть приглашение',
                heros1: 'Приглашение на свадьбу',
                heros2: '7 август 2026 | 14:00',
                herodate: '«И Он соединил их сердца» Аль-Анфаль, 63',
                timerlabel: 'ВРЕМЯ ДО СВАДЬБЫ',
                unit11: 'дней',
                unit22: 'часов',
                unit33: 'минут',
                unit44: 'секунд',
                scroll11: 'листайте вниз',
                tag11: 'Дорогие гости!',
                quote11: 'Мы хотим отпраздновать этот дорогой для нас день вместе с вами. Будем искренне рады, если вы разделите с нами нашу радость.',
                cal11: 'СЧИТАННЫЕ ДНИ',
                cal22: 'Свадебный календарь',
                cal33: 'АВГУСТ 2026',
                cale1: 'Пн',
                cale2: 'Вт',
                cale3: 'Ср',
                cale4: 'Чт',
                cale5: 'Пт',
                cale6: 'Сб',
                cale7: 'Вс',
                notetext1: 'сердце — день свадьбы',
                detcd1: 'Кратко о нашей свадьбе',
                detcd2: 'Детали мероприятия',
                detcd3: 'Место проведения',
                detcd4: 'Ресторан «NURU-DUR», Ферганская область, Багдадский район, городской посёлок Дорманча, улица Буюк Ипак Йули',
                detcd5: 'Открыть на карте →',
                detcd6: 'Время',
                detcd7: '7 август 2026 года, 14:00',
                detcd8: 'Двери открыты с 13:30',
                detcd9: 'Дресс-код',
                detcd10: 'Официальный, предпочтительны светлые тона',
                detcd11: 'Формат',
                detcd12: 'Халяль. Торжественное мероприятие проводится без алкогольных напитков',
                detcd13: 'Символ уважения и чистоты',
                detcd14: 'Ваша улыбка — наше главное украшение. Заранее благодарим за вклад в создание атмосферы уважения и тепла.',
                galler1: 'АДРЕС РЕСТОРАНА', 
                galler2: 'Фотографии ресторана',
                galler3: 'Внешний вид', 
                galler4: 'Ресторан «NURU-DUR»',
                galler5: 'Ферганская область, Багдадский район, городской посёлок Дорманча, улица Буюк Ипак Йули',
                galler6: 'Интерьер', 
                galler7: 'Роскошный интерьер',
                galler8: 'Светлые и просторные залы, уютная атмосфера для гостей',
                locat1: 'РАСПОЛОЖЕНИЕ И МАРШРУТ', 
                locat2: 'Найдите нас',
                locat3: 'Ресторан «NURU-DUR»',
                locat4: 'Ферганская область, Багдадский район, городской посёлок Дорманча, улица Буюк Ипак Йули', 
                locat5: 'Создать маршрут', 
                guest11: 'от 1 до 5',
                gift11: 'Подарки',
                gift22: 'Просьбы к гостям',
                gift33: 'Самый ценный подарок для нас — это ваше присутствие на нашем свадебном торжестве и возможность разделить с нами нашу радость. Мы искренне ценим ваше внимание и ваш визит. Для нас большая честь и счастье начинать эту новую и волнительную главу нашей жизни в кругу таких близких людей, как вы!',
                gift44: 'Если вы хотите порадовать нас ещё больше, будем очень признательны, если вы выразите своё внимание к нашей молодой семье в виде конверта.',
                gift55: 'Уважаемые гости!',
                gift66: 'Просим вас не дарить деньги во время танцев. Ваша искренняя улыбка и добрые пожелания — самый ценный подарок для нас.',
                gift77: 'Для нашего праздника создан специальный Telegram-группа. Там вы сможете ознакомиться с дополнительной информацией, а также делиться радостными моментами свадебного дня через фото и видео.',
                gift88: 'Перейти в Telegram',
                clos11: 'Добро пожаловать на свадьбу!',
                clos22: 'Выражаем искреннюю благодарность за то,',
                clos33: 'что вы с нами в этот счастливый день.',
                clos44: 'С уважением,',
                share11: 'ПОДЕЛИТЕСЬ ПРИГЛАШЕНИЕМ',
                share22: 'Расскажите своим друзьям',
                share33: 'Поделитесь приглашением с близкими — они тоже приглашены на наш праздник!',
                share44: 'Копировать',
                share55: 'Ссылка скопирована!',
                date11: '7 август 2026 | 14:00',
                date22: 'Спасибо за то, что были с нами в этот самый прекрасный день!'
            },
            uz: { 
                title: 'SIZGA TAKLIFNOMA KELDI', 
                instruction: 'Qulfchani bosib,', 
                instruction1: 'taklifnomani oching',
                heros1: 'To‘yga taklifnoma',
                heros2: '7-avgust 2026 | 14:00',
                herodate: '«Va U ularning qalblarini birlashtirdi» Al-Anfol, 63',
                timerlabel: 'TO‘YGACHA QOLGAN VAQT',
                unit11: 'kun',
                unit22: 'soat',
                unit33: 'daqiqa',
                unit44: 'soniya',
                scroll11: 'Pastga aylantirin',
                tag11: 'Hurmatli mehmonlar',
                quote11: 'Biz uchun aziz bo‘lgan ushbu kunni siz bilan birga nishonlashni istaymiz. Quvonchimizga sherik bo‘lishingizdan mamnun bo‘lamiz.',
                cal11: 'SANALGAN KUNLAR',
                cal22: 'To‘y kalendari',
                cal33: 'AVGUST 2026',
                cale1: 'Du',
                cale2: 'Se',
                cale3: 'Ch',
                cale4: 'Pa',
                cale5: 'Ju',
                cale6: 'Sh',
                cale7: 'Ya',
                notetext1: 'yurak — to‘y kuni',
                detcd1: 'To‘yimiz haqida qisqacha',
                detcd2: 'Tadbir tafsilotlari',
                detcd3: 'Manzil',
                detcd4: '«NURU-DUR» restorani, Fargʻona viloyati, Bagʻdod tumani, Dormancha shaharchasi, Buyuk ipak yoʻli koʻchasi',
                detcd5: 'Xaritada ochish →',
                detcd6: 'Vaqt',
                detcd7: '2026-yil 7-avgust, soat 14:00',
                detcd8: 'Eshiklar 13:30 dan ochiq',
                detcd9: 'Kiyinish kodi',
                detcd10: 'Rasmiy, afzal ko‘rang yorug‘ ranglar',
                detcd11: 'Format',
                detcd12: 'Halol. Tantanali tadbir alkogolsiz ichimliklarsiz o‘tkaziladi',
                detcd13: 'Hurmat va poklik ramzi',
                detcd14: 'Sizning tabassumingiz — bizning eng katta bezakimiz. Hurmat va mehr muhitini yaratishga qo‘shilgan hissangiz uchun oldindan rahmat.',
                galler1: 'RESTORAN MANZILI', 
                galler2: 'Restoran fotosuratlari',
                galler3: 'Tashqi ko‘rinish', 
                galler4: '“NURU-DUR” restorani',
                galler5: 'Fargʻona viloyati, Bagʻdod tumani, Dormancha shaharchasi, Buyuk ipak yoʻli koʻchasi',
                galler6: 'Ichki makon', 
                galler7: 'Hashamatli ichki makon',
                galler8: 'Yorug‘ va keng zallar, mehmonlar uchun qulay muhit',
                locat1: 'JOYLASHUV VA YO‘NALISH', 
                locat2: 'Bizni toping',
                locat3: '«NURU-DUR» restorani',
                locat4: 'Fargʻona viloyati, Bagʻdod tumani, Dormancha shaharchasi, Buyuk ipak yoʻli koʻchasi', 
                locat5: 'Marshrut yaratish', 
                guest11: '1 dan 5 gacha',
                gift11: 'Sovg‘alar',
                gift22: 'Mehmonlarga iltimoslar',
                gift33: 'Biz uchun dunyodagi eng qimmatli sovg‘a — bu sizning to‘yimiz oqshomida yonimizda bo‘lishingiz va quvonchimizga sherik bo‘lishingizdir. Sizning e’tiboringiz va tashrifingizni chin qalbimizdan qadrlaymiz. Hayotimizning ushbu yangi va hayajonli sahifasini aynan siz kabi yaqin insonlarimiz davrasida boshlash biz uchun katta sharaf va baxtdir!',
                gift44: 'Agar bizni yanada xursand qilmoqchi bo‘lsangiz, yosh oilamizga ko‘rsatgan e’tiboringizni konvert shaklida bildirsangiz, bundan benihoya mamnun bo‘lamiz.',
                gift55: 'Hurmatli mehmonlar!',
                gift66: 'Raqs vaqtida pul qistirmasligingizni iltimos qilamiz. Sizning samimiy tabassumingiz va ezgu tilaklaringiz biz uchun eng qimmatli hadyadir.',
                gift77: 'Bayramimiz uchun maxsus Telegram guruhi tashkil etilgan. U yerda qo‘shimcha ma’lumotlar bilan tanishishingiz hamda to‘y kunidagi quvonchli lahzalarni foto va videolar orqali ulashishingiz mumkin.',
                gift88: 'Telegramga o‘tish',
                clos11: 'To‘yga xush kelibsiz!',
                clos22: 'Bu baxtli kunda biz bilan birga bo‘lganingiz uchun',
                clos33: 'samimiy minnatdorchilik bildiramiz.',
                clos44: 'Hurmat bilan,',
                share11: 'TAKLIFNOMANI ULASHING',
                share22: 'Do‘stlaringizga yetkazing',
                share33: 'Taklifnomani yaqinlaringizga ham ulashing — ular ham bizning bayramimizga taklif qilingan!',
                share44: 'Nusxa olish',
                share55: 'Havola nusxalandi!',
                date11: '7-avgust 2026 | 14:00',
                date22: 'Eng go‘zal kunda biz bilan birga bo‘lganingiz uchun tashakkur!'
            },
            uzk: { 
                title: 'СИЗГА ТАКЛИФНОМА КЕЛДИ', 
                instruction: 'Қулфчани босиб,', 
                instruction1: 'таклифномани очинг',
                heros1: 'Тўйга таклифнома',
                heros2: '7 август 2026 | 14:00',
                herodate: '«Ва У уларнинг қалбларини бирлаштирди» Ал-Анфал, 63',
                timerlabel: 'ТЎЙГАЧА ҚОЛГАН ВАҚТ',
                unit11: 'кун',
                unit22: 'соат',
                unit33: 'дақиқа',
                unit44: 'сония',
                scroll11: 'пастга айлантиринг',
                tag11: 'Ҳурматли меҳмонлар!',
                quote11: 'Биз учун азиз бўлган ушбу кунни сиз билан бирга нишонлашни истаймиз. Қувончимизга шерик бўлишингиздан мамнун бўламиз.',
                cal11: 'САНОҚЛИ КУНЛАР',
                cal22: 'Тўй календари',
                cal33: 'АВГУСТ 2026',
                cale1: 'Ду',
                cale2: 'Се',
                cale3: 'Чо',
                cale4: 'Па',
                cale5: 'Жу',
                cale6: 'Ша',
                cale7: 'Як',
                notetext1: 'юрак — тўй куни',
                detcd1: 'Тўйимиз ҳақида қисқача',
                detcd2: 'Тадбир тафсилотлари',
                detcd3: 'Манзил',
                detcd4: '«NURU-DUR» ресторани, Фарғона вилояти, Бағдод тумани, Дорманча шаҳарчаси, Буюк ипак йўли кўчаси',
                detcd5: 'Харитада очиш →',
                detcd6: 'Вақт',
                detcd7: '2026-йил 7-август, соат 14:00',
                detcd8: 'Эшиклар 13:30 дан очиқ',
                detcd9: 'Кийиниш коди',
                detcd10: 'Расмий, ёруғ ранглар афзал',
                detcd11: 'Формат',
                detcd12: 'Ҳалол. Тантанали тадбир алкоголсиз ўтказилади',
                detcd13: 'Ҳурмат ва поклик рамзи',
                detcd14: 'Сизнинг табассумингиз — бизнинг энг катта безагимиз. Ҳурмат ва меҳр муҳитини яратишга қўшган ҳиссангиз учун олдиндан раҳмат.',
                galler1: 'РЕСТОРАН МАНЗИЛИ', 
                galler2: 'Ресторан фотосуратлари',
                galler3: 'Ташқи кўриниш', 
                galler4: '«NURU-DUR» ресторани',
                galler5: 'Фарғона вилояти, Бағдод тумани, Дорманча шаҳарчаси, Буюк ипак йўли кўчаси',
                galler6: 'Ички макон', 
                galler7: 'Ҳашаматли ички макон',
                galler8: 'Ёруғ ва кенг заллар, меҳмонлар учун қулай муҳит',
                locat1: 'ЖОЙЛАШУВ ВА ЙЎНАЛИШ', 
                locat2: 'Бизни топинг',
                locat3: '«NURU-DUR» ресторани',
                locat4: 'Фарғона вилояти, Бағдод тумани, Дорманча шаҳарчаси, Буюк ипак йўли кўчаси', 
                locat5: 'Маршрут яратиш', 
                guest11: '1 дан 5 гача',
                gift11: 'Совғалар',
                gift22: 'Меҳмонларга илтимослар',
                gift33: 'Биз учун дунёдаги энг қимматли совға — бу сизнинг тўйимиз оқшомида ёнимизда бўлишингиз ва қувончимизга шерик бўлишингиздир. Сизнинг эътиборингиз ва ташрифингизни чин қалбимиздан қадрлаймиз. Ҳаётимизнинг ушбу янги ва ҳаяжонли саҳифасини айнан сиз каби яқин инсонларимиз даврасида бошлаш биз учун катта шараф ва бахтдир!',
                gift44: 'Агар бизни янада хурсанд қилмоқчи бўлсангиз, ёш оиламизга кўрсатган эътиборингизни конверт шаклида билдирсангиз, бундан беҳад мамнун бўламиз.',
                gift55: 'Ҳурматли меҳмонлар!',
                gift66: 'Рақс вақтида пул қистирмаслигингизни илтимос қиламиз. Сизнинг самимий табассумингиз ва эзгу тилакларингиз биз учун энг қимматли ҳадядир.',
                gift77: 'Байрамимиз учун махсус Telegram гуруҳи ташкил этилган. У ерда қўшимча маълумотлар билан танишишингиз ҳамда тўй кунидаги қувончли лаҳзаларни фото ва видеолар орқали улашишингиз мумкин.',
                gift88: 'Telegramга ўтиш',
                clos11: 'Тўйга хуш келибсиз!',
                clos22: 'Бу бахтли кунда биз билан бирга бўлганингиз учун',
                clos33: 'самимий миннатдорчилик билдирамиз.',
                clos44: 'Ҳурмат билан,',
                share11: 'ТАКЛИФНОМАНИ УЛАШИНГ',
                share22: 'Дўстларингизга етказинг',
                share33: 'Таклифномани яқинларингизга ҳам улашинг — улар ҳам бизнинг байрамимизга таклиф қилинган!',
                share44: 'Нусха олиш',
                share55: 'Ҳавола нусхаланди!',
                date11: '7 август 2026 | 14:00',
                date22: 'Энг гўзал кунда биз билан бирга бўлганингиз учун ташаккур!'
            },
            en: { 
                title: 'YOU HAVE RECEIVED AN INVITATION', 
                instruction: 'Click the lock', 
                instruction1: 'to open the invitation',
                heros1: 'Wedding Invitation',
                heros2: 'August 7, 2026 | 14:00',
                herodate: '«And He united their hearts» Al-Anfal, 63',
                timerlabel: 'TIME REMAINING UNTIL THE WEDDING',
                unit11: 'days',
                unit22: 'hours',
                unit33: 'minutes',
                unit44: 'seconds',
                scroll11: 'scroll down',
                tag11: 'Dear Guests',
                quote11: 'We wish to celebrate this day, which is so dear to us, together with you. We would be delighted to have you share in our joy.',
                cal11: 'COUNTING DAYS',
                cal22: 'Wedding Calendar',
                cal33: 'AUGUST 2026',
                cale1: 'Mon',
                cale2: 'Tue',
                cale3: 'Wed',
                cale4: 'Thu',
                cale5: 'Fri',
                cale6: 'Sat',
                cale7: 'Sun',
                notetext1: 'heart — wedding day',
                detcd1: 'About Our Wedding',
                detcd2: 'Event Details',
                detcd3: 'Location',
                detcd4: '«NURU-DUR» Restaurant, Fergana region, Baghdad district, Dormancha town, Buyuk Ipak Yoli street',
                detcd5: 'Open on map →',
                detcd6: 'Time',
                detcd7: 'August 7, 2026, 14:00',
                detcd8: 'Doors open from 13:30',
                detcd9: 'Dress Code',
                detcd10: 'Formal, preferably light colors',
                detcd11: 'Format',
                detcd12: 'Halal. The event will be held without alcoholic beverages',
                detcd13: 'Symbol of Respect and Purity',
                detcd14: 'Your smile is our greatest decoration. Thank you in advance for contributing to an atmosphere of respect and warmth.',
                galler1: 'RESTAURANT ADDRESS', 
                galler2: 'Restaurant photos',
                galler3: 'Exterior', 
                galler4: '«NURU-DUR» restaurant',
                galler5: 'Fergana region, Baghdad district, Dormancha town, Buyuk Ipak Yoli street',
                galler6: 'Interior', 
                galler7: 'Luxurious interior',
                galler8: 'Bright and spacious halls, comfortable atmosphere for guests',
                locat1: 'LOCATION AND DIRECTIONS', 
                locat2: 'Find us',
                locat3: '«NURU-DUR» restaurant',
                locat4: 'Fergana region, Baghdad district, Dormancha town, Buyuk Ipak Yoli street', 
                locat5: 'Get directions', 
                guest11: 'from 1 to 5',
                gift11: 'Gifts',
                gift22: 'Requests to Guests',
                gift33: 'The most precious gift for us is your presence on our wedding night and sharing our joy. We sincerely cherish your attention and your visit. It is a great honor and happiness for us to begin this new and exciting chapter of our lives surrounded by close people like you!',
                gift44: 'If you would like to make us even happier, we would be sincerely grateful if you present your gift to our young family in the form of an envelope.',
                gift55: 'Dear guests!',
                gift66: 'We kindly ask you not to give money during the dances. Your sincere smiles and warm wishes are the most valuable gift for us.',
                gift77: 'A special Telegram group has been created for our celebration. There you can find additional information and share joyful moments from the wedding day through photos and videos.',
                gift88: 'Go to Telegram',
                clos11: 'Welcome to the wedding!',
                clos22: 'We express our sincere gratitude for',
                clos33: 'being with us on this happy day.',
                clos44: 'Sincerely,',
                share11: 'SHARE THE INVITATION',
                share22: 'Tell your friends',
                share33: 'Share the invitation with your loved ones — they are also invited to our celebration!',
                share44: 'Copy',
                share55: 'Link copied!',
                date11: 'August 7, 2026 | 14:00',
                date22: 'Thank you for being with us on this most beautiful day!'
            }
        };
        
        if (translations[lang]) {
            const t = translations[lang];
            document.querySelector('.unlock-title').textContent = t.title;
            document.querySelector('.unlock-instruction').textContent = t.instruction;
            document.querySelector('.unlock1-instruction1').textContent = t.instruction1;
            document.querySelector('.heros1').textContent = t.heros1;
            document.querySelector('.heros2').textContent = t.heros2;
            document.querySelector('.hero-date').textContent = t.herodate;
            document.querySelector('.timer-label').textContent = t.timerlabel;
            document.querySelector('.unit11').textContent = t.unit11;
            document.querySelector('.unit22').textContent = t.unit22;
            document.querySelector('.unit33').textContent = t.unit33;
            document.querySelector('.unit44').textContent = t.unit44;
            document.querySelector('.scroll11').textContent = t.scroll11;
            document.querySelector('.tag11').textContent = t.tag11;
            document.querySelector('.quote11').textContent = t.quote11;
            document.querySelector('.cal11').textContent = t.cal11;
            document.querySelector('.cal22').textContent = t.cal22;
            document.querySelector('.cal33').textContent = t.cal33;
            document.querySelector('.cale1').textContent = t.cale1;
            document.querySelector('.cale2').textContent = t.cale2;
            document.querySelector('.cale3').textContent = t.cale3;
            document.querySelector('.cale4').textContent = t.cale4;
            document.querySelector('.cale5').textContent = t.cale5;
            document.querySelector('.cale6').textContent = t.cale6;
            document.querySelector('.cale7').textContent = t.cale7;
            document.querySelector('.notetext1').textContent = t.notetext1;
            document.querySelector('.detcd1').textContent = t.detcd1;
            document.querySelector('.detcd2').textContent = t.detcd2;
            document.querySelector('.detcd3').textContent = t.detcd3;
            document.querySelector('.detcd4').textContent = t.detcd4;
            document.querySelector('.detcd5').textContent = t.detcd5;
            document.querySelector('.detcd6').textContent = t.detcd6;
            document.querySelector('.detcd7').textContent = t.detcd7;
            document.querySelector('.detcd8').textContent = t.detcd8;
            document.querySelector('.detcd9').textContent = t.detcd9;
            document.querySelector('.detcd10').textContent = t.detcd10;
            document.querySelector('.detcd11').textContent = t.detcd11;
            document.querySelector('.detcd12').textContent = t.detcd12;
            document.querySelector('.detcd13').textContent = t.detcd13;
            document.querySelector('.detcd14').textContent = t.detcd14;
            document.querySelector('.galler1').textContent = t.galler1;
            document.querySelector('.galler2').textContent = t.galler2;
            document.querySelector('.galler3').textContent = t.galler3;
            document.querySelector('.galler4').textContent = t.galler4;
            document.querySelector('.galler5').textContent = t.galler5;
            document.querySelector('.galler6').textContent = t.galler6;
            document.querySelector('.galler7').textContent = t.galler7;
            document.querySelector('.galler8').textContent = t.galler8;
            document.querySelector('.locat1').textContent = t.locat1;
            document.querySelector('.locat2').textContent = t.locat2;
            document.querySelector('.locat3').textContent = t.locat3;
            document.querySelector('.locat4').textContent = t.locat4;
            document.querySelector('.locat5').textContent = t.locat5;
            document.querySelector('.guest11').textContent = t.guest11;
            document.querySelector('.gift11').textContent = t.gift11;
            document.querySelector('.gift22').textContent = t.gift22;
            document.querySelector('.gift33').textContent = t.gift33;
            
            document.querySelector('.clos11').textContent = t.clos11;
            document.querySelector('.clos22').textContent = t.clos22;
            document.querySelector('.clos33').textContent = t.clos33;
            document.querySelector('.clos44').textContent = t.clos44;
            
            document.querySelector('.date11').textContent = t.date11;
            document.querySelector('.date22').textContent = t.date22;
        }
        translateRsvpSection(lang);
    });
});

document.querySelector('.lang-btn[data-lang="uz"]').classList.add('active');

function translateRsvpSection(lang) {
    const translations = {
        ru: {
            tag: 'ПОДТВЕРДИТЕ СВОЕ ПРИСУТСТВИЕ',
            title: 'Будьте с нами',
            nameLabel: 'Имя гостя',
            namePlaceholder: 'Введите ваше имя',
            guestsLabel: 'Количество гостей',
            attendanceLabel: 'Вы придете на свадьбу?',
            attendanceYes: 'Да, с удовольствием',
            attendanceNo: 'К сожалению, не смогу прийти',
            commentLabel: 'Комментарий (необязательно)',
            commentPlaceholder: 'Ваши пожелания или вопросы',
            submitBtn: 'Отправить',
            noteText: 'Обязательные поля',
            toastMessage: 'Спасибо! Ваш ответ успешно сохранен'
        },
        uz: {
            tag: 'ISHTIROKINGIZNI TASDIQLANG',
            title: 'Biz bilan bo‘ling',
            nameLabel: 'Mehmon ismi',
            namePlaceholder: 'Ismingizni kiriting',
            guestsLabel: 'Mehmonlar soni',
            attendanceLabel: "To'yga kelasizmi?",
            attendanceYes: 'Ha, mamnuniyat bilan',
            attendanceNo: 'Afsuski, kela olmayman',
            commentLabel: 'Sharh (ixtiyoriy)',
            commentPlaceholder: 'Sizning tilaklaringiz yoki savollaringiz',
            submitBtn: 'Yuborish',
            noteText: 'Majburiy maydonlar',
            toastMessage: 'Rahmat! Javobingiz muvaffaqiyatli saqlandi'
        },
        uzk: {
            tag: 'ИШТИРОКИНГИЗНИ ТАСДИҚЛАНГ',
            title: 'Биз билан бўлинг',
            nameLabel: 'Меҳмон исми',
            namePlaceholder: 'Исмингизни киритинг',
            guestsLabel: 'Меҳмонлар сони',
            attendanceLabel: "Тўйга келасизми?",
            attendanceYes: 'Ҳа, мамнуният билан',
            attendanceNo: 'Афсуски, кела олмайман',
            commentLabel: 'Шарҳ (ихтиёрий)',
            commentPlaceholder: 'Сизнинг тилакларингиз ёки саволларингиз',
            submitBtn: 'Юбориш',
            noteText: 'Мажбурий майдонлар',
            toastMessage: 'Раҳмат! Жавобингиз муваффақиятли сақланди'
        },
        en: {
            tag: 'CONFIRM YOUR ATTENDANCE',
            title: 'Be with us',
            nameLabel: 'Guest name',
            namePlaceholder: 'Enter your name',
            guestsLabel: 'Number of guests',
            attendanceLabel: 'Will you attend the wedding?',
            attendanceYes: 'Yes, with pleasure',
            attendanceNo: 'Unfortunately, I cannot come',
            commentLabel: 'Comment (optional)',
            commentPlaceholder: 'Your wishes or questions',
            submitBtn: 'Submit',
            noteText: 'Required fields',
            toastMessage: 'Thank you! Your response has been successfully saved'
        }
    };

    const t = translations[lang] || translations.uz;
    const rsvpSection = document.querySelector('.rsvp-section');
    if (!rsvpSection) return;

    const tag = rsvpSection.querySelector('.tag');
    if (tag) tag.textContent = t.tag;

    const title = rsvpSection.querySelector('.sec-title');
    if (title) title.innerHTML = t.title;

    const formLabels = rsvpSection.querySelectorAll('.form-label .label-text');
    if (formLabels[0]) formLabels[0].textContent = t.nameLabel;
    if (formLabels[1]) formLabels[1].textContent = t.guestsLabel;
    if (formLabels[2]) formLabels[2].textContent = t.attendanceLabel;
    if (formLabels[3]) formLabels[3].textContent = t.commentLabel;

    const nameInput = rsvpSection.querySelector('.form-input');
    if (nameInput) nameInput.placeholder = t.namePlaceholder;

    const textarea = rsvpSection.querySelector('.form-textarea');
    if (textarea) textarea.placeholder = t.commentPlaceholder;

    const radioTexts = rsvpSection.querySelectorAll('.radio-text');
    if (radioTexts[0]) radioTexts[0].textContent = t.attendanceYes;
    if (radioTexts[1]) radioTexts[1].textContent = t.attendanceNo;

    const submitBtn = rsvpSection.querySelector('.submit-btn .btn-text');
    if (submitBtn) submitBtn.textContent = t.submitBtn;

    const noteText = rsvpSection.querySelector('.form-note .note-text');
    if (noteText) noteText.textContent = t.noteText;

    const toastSpan = document.querySelector('#toastMessage span');
    if (toastSpan) toastSpan.textContent = t.toastMessage;
}

// ========== AJAX FORM SUBMISSION ==========
(function() {
    const form = document.getElementById('rsvpForm');
    const toast = document.getElementById('toastMessage');
    
    function getFormData() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
        const textarea = form.querySelector('.form-textarea');
        
        return {
            name: nameInput ? nameInput.value.trim() : '',
            guestCount: guestCountSpan ? parseInt(guestCountSpan.textContent) : 1,
            attendance: attendanceRadio ? attendanceRadio.value : 'yes',
            comment: textarea ? textarea.value.trim() : ''
        };
    }
    
    function resetForm() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const textarea = form.querySelector('.form-textarea');
        const yesRadio = form.querySelector('input[value="yes"]');
        
        if (nameInput) nameInput.value = '';
        if (guestCountSpan) guestCountSpan.textContent = '1';
        if (textarea) textarea.value = '';
        if (yesRadio) yesRadio.checked = true;
        
        const minusBtn = document.querySelector('.guest-minus');
        const plusBtn = document.querySelector('.guest-plus');
        if (window.setGuestCount) window.setGuestCount(1);
    }
    
    function showToast(message) {
        if (!toast) return;
        
        const toastSpan = toast.querySelector('span');
        if (toastSpan && message) {
            toastSpan.textContent = message;
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    function validateForm(data) {
        if (!data.name) {
            const nameInput = form.querySelector('.form-input');
            if (nameInput) {
                nameInput.style.borderColor = '#363636';
                nameInput.focus();
            }
            return false;
        }
        return true;
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = getFormData();
            
            if (!validateForm(formData)) {
                return;
            }
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn?.querySelector('.btn-text')?.textContent || 'Yuborish';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.btn-text');
                if (btnText) btnText.textContent = 'Yuborilmoqda...';
            }
            
            try {
                if (shouldUseLocalGuests()) {
                    const guests = saveStoredGuest(formData);
                    renderGuestsTable(guests);
                    updateStatsFromGuestsData(guests);
                    resetForm();
                    showToast('Rahmat! Javobingiz saqlandi.');
                    return;
                }

                const response = await fetch('save_rsvp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('RSVP backend is unavailable');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    await loadGuestsFromDB();
                    resetForm();
                    showToast();
                } else {
                    console.error('Server error:', result.error);
                    showToast('Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
                }
            } catch (error) {
                const guests = saveStoredGuest(formData);
                renderGuestsTable(guests);
                updateStatsFromGuestsData(guests);
                resetForm();
                showToast('Rahmat! Javobingiz saqlandi.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.btn-text');
                    if (btnText) btnText.textContent = originalBtnText;
                }
            }
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const footerTrigger = document.querySelector('.footer-names');
    const guestSection = document.getElementById('guests123');
    
    let clickCount = 0;
    let lastClickTime = 0;

    const PASSWORD = "0706"; // ← задай свой пароль

    if (footerTrigger && guestSection) {
        footerTrigger.addEventListener('click', () => {
            const currentTime = new Date().getTime();
            
            if (currentTime - lastClickTime > 1500) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = currentTime;

            if (clickCount === 3) {
                
                const userPassword = prompt("Parolni kiriting:");

                if (userPassword === PASSWORD) {
                    // переключение видимости
                    if (guestSection.style.display === 'block') {
                        guestSection.style.display = 'none';
                    } else {
                        guestSection.style.display = 'block';
                    }
                } else {
                    alert("Parol noto‘g‘ri ❌");
                }

                clickCount = 0;
            }
        });
    }
});
