// ===== QUIZ DATA =====
const quizAnswers = {
    '1-1':'b','1-2':'c','1-3':'a',
    '2-1':'b','2-2':'b','2-3':'b',
    '3-1':'b','3-2':'b','3-3':'b',
    '4-1':'b','4-2':'b','4-3':'c',
    '5-1':'b','5-2':'b','5-3':'b'
};
const quizExplanations = {
    '1-1':'Cell (เซลล์) คือจุดตัดระหว่าง Row และ Column',
    '1-2':'คอลัมน์ใช้ตัวอักษรภาษาอังกฤษ A, B, C... Z, AA, AB...',
    '1-3':'Ctrl + S เป็นปุ่มลัดบันทึกไฟล์ (Save)',
    '2-1':'ข้อมูลตัวเลขจะจัดชิดขวาอัตโนมัติ ส่วนข้อความชิดซ้าย',
    '2-2':'Tab ยืนยันข้อมูลแล้วเลื่อนไปคอลัมน์ถัดไป (ขวา)',
    '2-3':'Merge & Center รวมหลายเซลล์เข้าด้วยกันและจัดกลาง',
    '3-1':'สูตรทุกสูตรต้องขึ้นต้นด้วย = เสมอ',
    '3-2':'AVERAGE หาค่าเฉลี่ย, SUM หาผลรวม',
    '3-3':'75 < 80 เงื่อนไขเป็นเท็จ จึงแสดง "พอใช้"',
    '4-1':'Line Chart แสดงแนวโน้มการเปลี่ยนแปลงตามเวลาได้ดีที่สุด',
    '4-2':'ต้อง Select ข้อมูลก่อน แล้วจึง Insert Chart',
    '4-3':'Pie Chart แสดงสัดส่วนของแต่ละส่วนเทียบกับทั้งหมด',
    '5-1':'73 >= 70 เป็นจริง ดังนั้นผลลัพธ์คือ "B"',
    '5-2':'SUMIF รวมค่าเฉพาะที่ตรงตามเงื่อนไข',
    '5-3':'Data Validation จำกัดชนิด/ค่าข้อมูลที่ป้อนในเซลล์ได้'
};

// ===== STATE =====
let currentLesson = 'home';
let completedLessons = new Set();
let quizScores = {};

// ===== NAVIGATION =====
function navigateToLesson(id) {
    document.querySelectorAll('.lesson-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id === 'home' ? 'home' : 'lesson' + id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lesson === id);
    });

    if (currentLesson !== 'home' && id !== currentLesson) {
        completedLessons.add(currentLesson);
    }
    currentLesson = id;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PROGRESS =====
function updateProgress() {
    const pct = Math.round((completedLessons.size / 5) * 100);
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = completedLessons.size + ' / 5 บท';
}

// ===== QUIZ =====
function checkQuiz(lessonNum) {
    let correct = 0;
    for (let i = 1; i <= 3; i++) {
        const key = lessonNum + '-' + i;
        const sel = document.querySelector('input[name="q' + key + '"]:checked');
        const fb = document.getElementById('feedback-' + key);
        if (!fb) continue;
        if (!sel) {
            fb.className = 'quiz-feedback incorrect';
            fb.textContent = '⚠️ กรุณาเลือกคำตอบ';
            fb.style.display = 'block';
            continue;
        }
        const ok = sel.value === quizAnswers[key];
        if (ok) {
            correct++;
            fb.className = 'quiz-feedback correct';
            fb.textContent = '✅ ถูกต้อง! ' + quizExplanations[key];
        } else {
            fb.className = 'quiz-feedback incorrect';
            fb.textContent = '❌ ไม่ถูก — ' + quizExplanations[key];
        }
        fb.style.display = 'block';
        document.querySelectorAll('input[name="q' + key + '"]').forEach(opt => {
            const lbl = opt.parentElement;
            lbl.style.borderColor = '';
            lbl.style.background = '';
            if (opt.value === quizAnswers[key]) { lbl.style.borderColor = '#38a169'; lbl.style.background = '#f0fff4'; }
            else if (opt.checked && !ok) { lbl.style.borderColor = '#e53e3e'; lbl.style.background = '#fff5f5'; }
        });
    }
    quizScores[lessonNum] = correct;
    const res = document.getElementById('result-' + lessonNum);
    if (res) {
        res.classList.add('show');
        if (correct === 3) { res.className = 'quiz-result show good'; res.textContent = '🎉 ยอดเยี่ยม! ถูกทั้ง 3 ข้อ!'; }
        else if (correct >= 2) { res.className = 'quiz-result show average'; res.textContent = '👍 ดีมาก! ถูก ' + correct + '/3 ข้อ'; }
        else { res.className = 'quiz-result show poor'; res.textContent = '📖 ถูก ' + correct + '/3 — ลองทบทวนอีกครั้ง'; }
    }
    completedLessons.add(String(lessonNum));
    updateProgress();
}

// ===== COMPLETION =====
function showCompletion() {
    completedLessons.add('5');
    updateProgress();
    let total = 0;
    for (let k in quizScores) total += quizScores[k];
    document.getElementById('totalCorrect').textContent = total;
    document.getElementById('scorePercent').textContent = Math.round(total / 15 * 100) + '%';
    document.getElementById('completionModal').classList.add('show');
}
function closeModal() {
    document.getElementById('completionModal').classList.remove('show');
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('dark');
    const btn = document.querySelector('.theme-toggle');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Nav clicks
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() { navigateToLesson(this.dataset.lesson); });
    });
    // Modal close
    document.getElementById('completionModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
    // Theme restore
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
    updateProgress();
});
