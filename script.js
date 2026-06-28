// ===== QUIZ ANSWERS =====
const quizAnswers = {
    '1-1': 'b', // Cell
    '1-2': 'c', // ตัวอักษรภาษาอังกฤษ
    '1-3': 'a', // Ctrl + S
    '2-1': 'b', // ตัวเลข (Number)
    '2-2': 'b', // Tab
    '2-3': 'b', // Merge & Center
    '3-1': 'b', // = (เท่ากับ)
    '3-2': 'b', // หาค่าเฉลี่ย
    '3-3': 'b', // พอใช้
    '4-1': 'b', // กราฟเส้น (Line Chart)
    '4-2': 'b', // เลือกข้อมูลที่ต้องการ
    '4-3': 'c', // สัดส่วนของข้อมูลรวม
    '5-1': 'b', // B
    '5-2': 'b', // รวมค่าตามเงื่อนไข
    '5-3': 'b'  // จำกัดข้อมูลที่สามารถป้อนได้
};

const quizExplanations = {
    '1-1': 'Cell (เซลล์) คือจุดตัดระหว่างแถว (Row) และคอลัมน์ (Column)',
    '1-2': 'คอลัมน์ใน Excel ใช้ตัวอักษรภาษาอังกฤษ A, B, C, ... Z, AA, AB, ...',
    '1-3': 'Ctrl + S เป็นปุ่มลัดสำหรับบันทึกไฟล์ (Save)',
    '2-1': 'ข้อมูลตัวเลขจะถูกจัดชิดขวาอัตโนมัติ ส่วนข้อความจะชิดซ้าย',
    '2-2': 'Tab ใช้ยืนยันข้อมูลและเลื่อนไปคอลัมน์ถัดไป ส่วน Enter จะเลื่อนลงแถวถัดไป',
    '2-3': 'Merge & Center ใช้รวมเซลล์หลายเซลล์เข้าด้วยกันและจัดกลาง',
    '3-1': 'สูตรทุกสูตรใน Excel ต้องขึ้นต้นด้วยเครื่องหมาย = เสมอ',
    '3-2': 'AVERAGE ใช้หาค่าเฉลี่ยของข้อมูล ส่วน SUM หาผลรวม',
    '3-3': 'เพราะ 75 < 80 ดังนั้นเงื่อนไข A1>=80 เป็นเท็จ จึงแสดง "พอใช้"',
    '4-1': 'กราฟเส้น (Line Chart) เหมาะสำหรับแสดงแนวโน้มการเปลี่ยนแปลงตามเวลา',
    '4-2': 'ต้องเลือก (Select) ข้อมูลที่ต้องการก่อน แล้วจึงไปที่ Insert → Chart',
    '4-3': 'กราฟวงกลม (Pie Chart) แสดงสัดส่วนของแต่ละส่วนเทียบกับทั้งหมด',
    '5-1': '73 >= 70 เป็นจริง ดังนั้นผลลัพธ์คือ "B"',
    '5-2': 'SUMIF ใช้รวมค่าเฉพาะที่ตรงตามเงื่อนไขที่กำหนด',
    '5-3': 'Data Validation ใช้จำกัดชนิดหรือค่าของข้อมูลที่สามารถป้อนลงในเซลล์ได้'
};

// ===== STATE MANAGEMENT =====
let currentLesson = 'home';
let completedLessons = new Set();
let quizScores = {};


// ===== NAVIGATION =====
function navigateToLesson(lessonId) {
    // Hide all sections
    document.querySelectorAll('.lesson-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetId = lessonId === 'home' ? 'home' : `lesson${lessonId}`;
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lesson === lessonId) {
            btn.classList.add('active');
        }
    });

    // Mark previous lesson as completed
    if (currentLesson !== 'home' && lessonId !== currentLesson) {
        completedLessons.add(currentLesson);
    }

    currentLesson = lessonId;
    updateProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PROGRESS BAR =====
function updateProgress() {
    const totalLessons = 5;
    const completed = completedLessons.size;
    const percentage = Math.round((completed / totalLessons) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = `ความคืบหน้า: ${percentage}% (${completed}/${totalLessons} บท)`;
    }
}


// ===== QUIZ CHECKING =====
function checkQuiz(lessonNum) {
    let correct = 0;
    let total = 3;
    
    for (let i = 1; i <= total; i++) {
        const quizKey = `${lessonNum}-${i}`;
        const selectedOption = document.querySelector(`input[name="q${quizKey}"]:checked`);
        const feedbackEl = document.getElementById(`feedback-${quizKey}`);
        
        if (!feedbackEl) continue;
        
        if (!selectedOption) {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = '⚠️ กรุณาเลือกคำตอบ';
            feedbackEl.style.display = 'block';
            continue;
        }
        
        const isCorrect = selectedOption.value === quizAnswers[quizKey];
        
        if (isCorrect) {
            correct++;
            feedbackEl.className = 'quiz-feedback correct';
            feedbackEl.textContent = `✅ ถูกต้อง! ${quizExplanations[quizKey]}`;
        } else {
            feedbackEl.className = 'quiz-feedback incorrect';
            feedbackEl.textContent = `❌ ไม่ถูกต้อง — ${quizExplanations[quizKey]}`;
        }
        feedbackEl.style.display = 'block';
        
        // Highlight options
        const options = document.querySelectorAll(`input[name="q${quizKey}"]`);
        options.forEach(opt => {
            const label = opt.parentElement;
            label.style.borderColor = '';
            label.style.background = '';
            
            if (opt.value === quizAnswers[quizKey]) {
                label.style.borderColor = '#38a169';
                label.style.background = '#f0fff4';
            } else if (opt.checked && !isCorrect) {
                label.style.borderColor = '#e53e3e';
                label.style.background = '#fff5f5';
            }
        });
    }
    
    // Store score
    quizScores[lessonNum] = correct;
    
    // Show result
    const resultEl = document.getElementById(`result-${lessonNum}`);
    if (resultEl) {
        resultEl.classList.add('show');
        
        if (correct === total) {
            resultEl.className = 'quiz-result show good';
            resultEl.textContent = `🎉 ยอดเยี่ยม! คุณตอบถูกทั้ง ${total} ข้อ!`;
        } else if (correct >= 2) {
            resultEl.className = 'quiz-result show average';
            resultEl.textContent = `👍 ดีมาก! คุณตอบถูก ${correct}/${total} ข้อ`;
        } else {
            resultEl.className = 'quiz-result show poor';
            resultEl.textContent = `📖 คุณตอบถูก ${correct}/${total} ข้อ — ลองทบทวนเนื้อหาอีกครั้งนะ`;
        }
    }
    
    // Mark lesson as completed when quiz is done
    completedLessons.add(String(lessonNum));
    updateProgress();
}


// ===== COMPLETION MODAL =====
function showCompletion() {
    // Mark lesson 5 as completed
    completedLessons.add('5');
    updateProgress();
    
    // Calculate total score
    let totalCorrect = 0;
    for (let key in quizScores) {
        totalCorrect += quizScores[key];
    }
    
    const totalQuestions = 15;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    
    document.getElementById('totalCorrect').textContent = totalCorrect;
    document.getElementById('scorePercent').textContent = percentage + '%';
    
    // Show modal
    document.getElementById('completionModal').classList.add('show');
}

function closeModal() {
    document.getElementById('completionModal').classList.remove('show');
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Nav button clicks
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            navigateToLesson(this.dataset.lesson);
        });
    });
    
    // Close modal on overlay click
    document.getElementById('completionModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Initialize progress
    updateProgress();
});

// ===== SMOOTH SCROLL FOR INTERNAL NAVIGATION =====
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
