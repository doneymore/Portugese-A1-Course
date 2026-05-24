// views/quiz.js – Quiz engine (mc, fill, match)
const QuizView = (() => {
  let questions = [];
  let current = 0;
  let score = 0;
  let unitId = null;
  let answered = false;

  // Match state
  let matchSelected = null;

  function render({ id }) {
    unitId = parseInt(id);
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const app = document.getElementById('app');

    if (!unit) {
      app.innerHTML = `<div class="empty-state"><h3>Unit not found</h3><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>`;
      return;
    }

    questions = unit.quiz || [];
    current = 0;
    score = 0;
    answered = false;

    app.innerHTML = `
      <div class="quiz-container">
        <div class="breadcrumb">
          <a href="#/">Home</a> › <a href="#/unit/${unitId}">Unit ${unitId}</a> › Quiz
        </div>
        <div class="page-header">
          <h1>✏️ Quiz – ${unit.lesson.title}</h1>
        </div>
        <div class="quiz-header">
          <div class="fc-progress-text">
            <span id="quiz-progress">Question 1 of ${questions.length}</span>
            <span id="quiz-score">Score: 0</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" id="quiz-bar" style="width:0%"></div>
          </div>
        </div>
        <div id="quiz-content"></div>
      </div>
    `;

    showQuestion();
  }

  function updateHeader() {
    const prog = document.getElementById('quiz-progress');
    const sc = document.getElementById('quiz-score');
    const bar = document.getElementById('quiz-bar');
    if (prog) prog.textContent = `Question ${current + 1} of ${questions.length}`;
    if (sc) sc.textContent = `Score: ${score}`;
    if (bar) bar.style.width = `${Math.round((current / questions.length) * 100)}%`;
  }

  function showQuestion() {
    if (current >= questions.length) { showResults(); return; }
    const q = questions[current];
    answered = false;
    updateHeader();

    const content = document.getElementById('quiz-content');
    if (!content) return;

    let questionHtml = '';
    if (q.type === 'mc') questionHtml = renderMC(q);
    else if (q.type === 'fill') questionHtml = renderFill(q);
    else if (q.type === 'match') questionHtml = renderMatch(q);

    content.innerHTML = `
      <div class="quiz-question-card">
        <div class="quiz-q-text">${q.question}</div>
        ${questionHtml}
      </div>
      <div id="quiz-feedback" style="display:none"></div>
      <div id="quiz-next-wrap" style="display:none">
        <button class="btn btn-primary" id="quiz-next-btn">
          ${current + 1 < questions.length ? 'Next Question →' : 'See Results →'}
        </button>
      </div>
    `;

    // Bind next
    document.getElementById('quiz-next-btn').addEventListener('click', () => {
      current++;
      showQuestion();
    });

    // Bind fill submit on Enter
    if (q.type === 'fill') {
      const input = document.getElementById('fill-input');
      if (input) {
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !answered) submitFill(q); });
      }
    }
  }

  function renderMC(q) {
    const opts = q.options.map((opt, i) => `
      <button class="quiz-option" data-index="${i}" onclick="QuizView._selectMC(this, ${i}, '${q.correct.replace(/'/g, "\\'")}')">${opt}</button>
    `).join('');
    return `<div class="quiz-options">${opts}</div>`;
  }

  function _selectMC(btn, index, correct) {
    if (answered) return;
    answered = true;
    const q = questions[current];
    const allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(b => { b.disabled = true; });

    const isCorrect = q.options[index] === correct;
    btn.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
      allBtns.forEach(b => {
        if (b.textContent.trim() === correct) b.classList.add('correct');
      });
    }

    showFeedback(isCorrect, correct);
    if (isCorrect) score += (q.xp || 10);
    showNext();
  }

  function renderFill(q) {
    return `
      <div class="fill-input-wrap">
        <input type="text" id="fill-input" class="fill-input" placeholder="Type your answer..." autocomplete="off" spellcheck="false">
        <button class="btn btn-primary" onclick="QuizView._submitFill()">Check</button>
      </div>
    `;
  }

  function _submitFill() {
    if (answered) return;
    const q = questions[current];
    const input = document.getElementById('fill-input');
    if (!input) return;
    submitFill(q);
  }

  function submitFill(q) {
    answered = true;
    const input = document.getElementById('fill-input');
    if (!input) return;
    input.disabled = true;

    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswers = Array.isArray(q.answer)
      ? q.answer.map(a => a.toLowerCase())
      : [q.answer.toLowerCase()];
    const isCorrect = correctAnswers.includes(userAnswer);

    input.classList.add(isCorrect ? 'correct' : 'incorrect');
    showFeedback(isCorrect, Array.isArray(q.answer) ? q.answer[0] : q.answer);
    if (isCorrect) score += (q.xp || 10);
    showNext();
  }

  function renderMatch(q) {
    // q.pairs: [{pt, en}]
    matchSelected = null;
    const shuffledEn = [...q.pairs].sort(() => Math.random() - 0.5);

    const ptCols = q.pairs.map((p, i) =>
      `<div class="match-item" data-side="pt" data-index="${i}" data-value="${p.pt.replace(/"/g, '&quot;')}" onclick="QuizView._selectMatch(this)">${p.pt}</div>`
    ).join('');

    const enCols = shuffledEn.map((p, i) =>
      `<div class="match-item" data-side="en" data-index="${i}" data-value="${p.en.replace(/"/g, '&quot;')}" data-pt="${p.pt.replace(/"/g, '&quot;')}" onclick="QuizView._selectMatch(this)">${p.en}</div>`
    ).join('');

    return `
      <div class="match-grid">
        <div class="match-column">
          <h3>Portuguese</h3>
          ${ptCols}
        </div>
        <div class="match-column">
          <h3>English</h3>
          ${enCols}
        </div>
      </div>
    `;
  }

  function _selectMatch(el) {
    if (answered) return;
    if (el.classList.contains('matched')) return;

    const side = el.dataset.side;

    if (!matchSelected) {
      // Clear any previous non-matched selection
      document.querySelectorAll('.match-item.selected').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      matchSelected = el;
      return;
    }

    // If same side, just switch selection
    if (matchSelected.dataset.side === side) {
      document.querySelectorAll('.match-item.selected').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      matchSelected = el;
      return;
    }

    // Different side – check match
    let ptEl = side === 'pt' ? el : matchSelected;
    let enEl = side === 'en' ? el : matchSelected;

    // Find the expected pt for this en
    const ptValue = ptEl.dataset.value;
    const enPt = enEl.dataset.pt;

    if (ptValue === enPt) {
      // Correct match
      ptEl.classList.remove('selected');
      enEl.classList.remove('selected');
      ptEl.classList.add('matched');
      enEl.classList.add('matched');
      matchSelected = null;

      // Check if all matched
      const q = questions[current];
      const allMatched = document.querySelectorAll('.match-item.matched').length === q.pairs.length * 2;
      if (allMatched) {
        answered = true;
        score += (q.xp || 20);
        showFeedback(true, null, 'All pairs matched!');
        showNext();
      }
    } else {
      // Wrong match
      ptEl.classList.add('match-wrong');
      enEl.classList.add('match-wrong');
      setTimeout(() => {
        ptEl.classList.remove('match-wrong', 'selected');
        enEl.classList.remove('match-wrong', 'selected');
        matchSelected = null;
      }, 600);
    }
  }

  function showFeedback(isCorrect, correctAnswer, customMsg) {
    const fb = document.getElementById('quiz-feedback');
    if (!fb) return;
    fb.style.display = 'block';
    fb.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    if (customMsg) {
      fb.textContent = customMsg;
    } else if (isCorrect) {
      fb.textContent = '✅ Correct!';
    } else {
      fb.textContent = `❌ Incorrect. The answer is: ${correctAnswer}`;
    }
  }

  function showNext() {
    const wrap = document.getElementById('quiz-next-wrap');
    if (wrap) wrap.style.display = 'block';
  }

  function showResults() {
    const total = questions.length;
    XP.awardQuizXP(score > 0 ? Math.min(score / 10, total) : 0, total);
    Store.update('unit_progress', p => { if (!p[unitId]) p[unitId] = {}; p[unitId].quiz = true; return p; }, {});

    const content = document.getElementById('quiz-content');
    const header = document.querySelector('.quiz-header');
    if (header) header.style.display = 'none';

    const maxScore = questions.reduce((s, q) => s + (q.xp || 10), 0);
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    let emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';

    content.innerHTML = `
      <div class="quiz-done">
        <div style="font-size:3rem">${emoji}</div>
        <h2>Quiz Complete!</h2>
        <div class="quiz-score">${pct}%</div>
        <p style="color:var(--text-muted)">${score} / ${maxScore} points</p>
        <div class="flex gap-1 justify-between flex-wrap mt-3">
          <a href="#/unit/${unitId}" class="btn btn-ghost">← Back to Unit</a>
          <a href="#/unit/${unitId}/conversations" class="btn btn-primary">Conversations →</a>
        </div>
      </div>
    `;
  }

  return { render, _selectMC, _submitFill, _selectMatch };
})();
