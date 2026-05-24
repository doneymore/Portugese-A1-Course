// views/flashcards.js – SRS flashcard session
const FlashcardsView = (() => {
  let cards = [];
  let queue = [];
  let currentIndex = 0;
  let flipped = false;
  let sessionCorrect = 0;
  let unitId = null;

  function render({ id }) {
    unitId = parseInt(id);
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const app = document.getElementById('app');

    if (!unit) {
      app.innerHTML = `<div class="empty-state"><h3>Unit not found</h3><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>`;
      return;
    }

    cards = unit.flashcards || [];
    // Get due cards; if none due, use all cards
    let due = SRS.getDueCards(cards);
    if (due.length === 0) due = cards;
    queue = [...due];
    currentIndex = 0;
    flipped = false;
    sessionCorrect = 0;

    renderSession(app, unit);
  }

  function renderSession(app, unit) {
    if (!unit) unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    app.innerHTML = `
      <div class="flashcard-session">
        <div class="breadcrumb">
          <a href="#/">Home</a> › <a href="#/unit/${unitId}">Unit ${unitId}</a> › Flashcards
        </div>
        <div class="page-header">
          <h1>🃏 Flashcards – ${unit ? unit.lesson.title : ''}</h1>
        </div>
        <div class="fc-progress">
          <div class="fc-progress-text">
            <span id="fc-progress-label">Card 1 of ${queue.length}</span>
            <span id="fc-correct-count">Correct: 0</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" id="fc-progress-bar" style="width:0%"></div>
          </div>
        </div>
        <div id="fc-card-area"></div>
        <div id="fc-rating-area" style="display:none">
          <p class="text-center mb-1" style="font-size:0.85rem;color:var(--text-muted)">How well did you know this?</p>
          <div class="fc-rating">
            <button class="btn-rating rating-0" onclick="FlashcardsView._rate(0)">
              <span>😫</span><span class="rating-label">Again</span>
            </button>
            <button class="btn-rating rating-1" onclick="FlashcardsView._rate(1)">
              <span>😕</span><span class="rating-label">Hard</span>
            </button>
            <button class="btn-rating rating-3" onclick="FlashcardsView._rate(3)">
              <span>🙂</span><span class="rating-label">Good</span>
            </button>
            <button class="btn-rating rating-5" onclick="FlashcardsView._rate(5)">
              <span>😄</span><span class="rating-label">Easy</span>
            </button>
          </div>
        </div>
      </div>
    `;
    showCard();
  }

  function showCard() {
    if (currentIndex >= queue.length) {
      showDone();
      return;
    }
    const card = queue[currentIndex];
    flipped = false;
    const cardArea = document.getElementById('fc-card-area');
    const ratingArea = document.getElementById('fc-rating-area');
    if (ratingArea) ratingArea.style.display = 'none';

    cardArea.innerHTML = `
      <div class="flashcard-scene" id="flashcard" onclick="FlashcardsView._flip()">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="fc-word">${card.front}</div>
            ${card.phonetic ? `<div class="fc-phonetic">[${card.phonetic}]</div>` : ''}
            <div class="fc-hint">Click to reveal answer</div>
            <button class="btn btn-outline btn-sm" style="margin-top:0.5rem" onclick="event.stopPropagation(); Speech.speak('${card.front.replace(/'/g, "\\'")}')">🔊 Listen</button>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="fc-translation">${card.back}</div>
            <div class="fc-word" style="font-size:1.4rem">${card.front}</div>
            ${card.phonetic ? `<div class="fc-phonetic">[${card.phonetic}]</div>` : ''}
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); Speech.speak('${card.front.replace(/'/g, "\\'")}')">🔊 Listen</button>
          </div>
        </div>
      </div>
    `;

    // Update progress bar
    updateProgress();
  }

  function updateProgress() {
    const label = document.getElementById('fc-progress-label');
    const bar = document.getElementById('fc-progress-bar');
    const correct = document.getElementById('fc-correct-count');
    const total = queue.length;
    if (label) label.textContent = `Card ${currentIndex + 1} of ${total}`;
    if (bar) bar.style.width = `${Math.round((currentIndex / total) * 100)}%`;
    if (correct) correct.textContent = `Correct: ${sessionCorrect}`;
  }

  function _flip() {
    if (flipped) return;
    flipped = true;
    const card = document.getElementById('flashcard');
    if (card) card.classList.add('flipped');
    const ratingArea = document.getElementById('fc-rating-area');
    if (ratingArea) ratingArea.style.display = 'block';
    // Auto-speak back
    Speech.speak(queue[currentIndex].front);
  }

  function _rate(quality) {
    const card = queue[currentIndex];
    SRS.saveReview(card.id, quality);
    XP.awardCardXP(quality);

    if (quality >= 3) sessionCorrect++;

    // If failed, re-queue at end
    if (quality < 3) {
      queue.push(card);
    }

    currentIndex++;
    showCard();
  }

  function showDone() {
    // Mark flashcards progress
    Store.update('unit_progress', p => { if (!p[unitId]) p[unitId] = {}; p[unitId].flashcards = true; return p; }, {});

    const session = document.querySelector('.flashcard-session');
    if (session) {
      session.innerHTML = `
        <div class="fc-done">
          <div style="font-size:3rem">🎉</div>
          <h2>Session Complete!</h2>
          <p style="color:var(--text-muted)">You reviewed ${currentIndex} cards</p>
          <div style="font-size:2rem; font-weight:800; color:var(--green-dark); margin:1rem 0">${sessionCorrect} correct</div>
          <div class="flex gap-1 justify-between flex-wrap mt-2">
            <a href="#/unit/${unitId}" class="btn btn-ghost">← Back to Unit</a>
            <a href="#/unit/${unitId}/quiz" class="btn btn-primary">Take Quiz →</a>
          </div>
        </div>
      `;
    }
  }

  return { render, _flip, _rate };
})();

// AllReviewView – aggregates due cards from every unit
const AllReviewView = (() => {
  let queue = [];
  let currentIndex = 0;
  let flipped = false;
  let sessionCorrect = 0;

  function render() {
    const app = document.getElementById('app');
    const units = window.ALL_UNITS || [];

    const dueCards = [];
    units.forEach(unit =>
      SRS.getDueCards(unit.flashcards || []).forEach(c =>
        dueCards.push({ ...c, _unit: unit })
      )
    );

    let cards = dueCards.length ? dueCards : [];
    if (!cards.length) {
      units.forEach(unit =>
        (unit.flashcards || []).forEach(c => cards.push({ ...c, _unit: unit }))
      );
      cards = cards.sort(() => Math.random() - 0.5).slice(0, 15);
    } else {
      cards = cards.sort(() => Math.random() - 0.5);
    }

    queue = cards;
    currentIndex = 0;
    flipped = false;
    sessionCorrect = 0;

    const subtitle = dueCards.length
      ? `${dueCards.length} card${dueCards.length !== 1 ? 's' : ''} due for review`
      : 'No cards due – practice mode';

    app.innerHTML = `
      <div class="flashcard-session">
        <div class="breadcrumb"><a href="#/">Home</a> › Review</div>
        <div class="page-header">
          <h1>🃏 Daily Review</h1>
          <p>${subtitle}</p>
        </div>
        <div class="fc-progress">
          <div class="fc-progress-text">
            <span id="fc-progress-label">Card 1 of ${queue.length}</span>
            <span id="fc-correct-count">Correct: 0</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" id="fc-progress-bar" style="width:0%"></div>
          </div>
        </div>
        <div id="fc-card-area"></div>
        <div id="fc-rating-area" style="display:none">
          <p class="text-center mb-1" style="font-size:0.85rem;color:var(--text-muted)">How well did you know this?</p>
          <div class="fc-rating">
            <button class="btn-rating rating-0" onclick="AllReviewView._rate(0)"><span>😫</span><span class="rating-label">Again</span></button>
            <button class="btn-rating rating-1" onclick="AllReviewView._rate(1)"><span>😕</span><span class="rating-label">Hard</span></button>
            <button class="btn-rating rating-3" onclick="AllReviewView._rate(3)"><span>🙂</span><span class="rating-label">Good</span></button>
            <button class="btn-rating rating-5" onclick="AllReviewView._rate(5)"><span>😄</span><span class="rating-label">Easy</span></button>
          </div>
        </div>
      </div>
    `;
    _showCard();
  }

  function _showCard() {
    if (currentIndex >= queue.length) { _showDone(); return; }
    const card = queue[currentIndex];
    flipped = false;
    const cardArea = document.getElementById('fc-card-area');
    const ratingArea = document.getElementById('fc-rating-area');
    if (ratingArea) ratingArea.style.display = 'none';

    const safeFront = card.front.replace(/'/g, "\\'");
    cardArea.innerHTML = `
      <div class="flashcard-scene" id="flashcard" onclick="AllReviewView._flip()">
        <div class="flashcard-inner">
          <div class="flashcard-face flashcard-front">
            <div class="fc-word">${card.front}</div>
            ${card.phonetic ? `<div class="fc-phonetic">[${card.phonetic}]</div>` : ''}
            <div class="fc-hint">Click to reveal answer</div>
            <button class="btn btn-outline btn-sm" style="margin-top:0.5rem"
              onclick="event.stopPropagation(); Speech.speak('${safeFront}')">🔊 Listen</button>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="fc-translation">${card.back}</div>
            <div class="fc-word" style="font-size:1.4rem">${card.front}</div>
            ${card.phonetic ? `<div class="fc-phonetic">[${card.phonetic}]</div>` : ''}
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">
              Unit ${card._unit.id}: ${card._unit.lesson.title}
            </div>
            <button class="btn btn-outline btn-sm"
              onclick="event.stopPropagation(); Speech.speak('${safeFront}')">🔊 Listen</button>
          </div>
        </div>
      </div>
    `;

    const label = document.getElementById('fc-progress-label');
    const bar = document.getElementById('fc-progress-bar');
    const correct = document.getElementById('fc-correct-count');
    if (label) label.textContent = `Card ${currentIndex + 1} of ${queue.length}`;
    if (bar) bar.style.width = `${Math.round((currentIndex / queue.length) * 100)}%`;
    if (correct) correct.textContent = `Correct: ${sessionCorrect}`;
  }

  function _flip() {
    if (flipped) return;
    flipped = true;
    const card = document.getElementById('flashcard');
    if (card) card.classList.add('flipped');
    const ratingArea = document.getElementById('fc-rating-area');
    if (ratingArea) ratingArea.style.display = 'block';
    Speech.speak(queue[currentIndex].front);
  }

  function _rate(quality) {
    const card = queue[currentIndex];
    SRS.saveReview(card.id, quality);
    XP.awardCardXP(quality);
    if (quality >= 3) sessionCorrect++;
    if (quality < 3) queue.push(card);
    currentIndex++;
    _showCard();
  }

  function _showDone() {
    const session = document.querySelector('.flashcard-session');
    if (session) {
      session.innerHTML = `
        <div class="fc-done">
          <div style="font-size:3rem">🎉</div>
          <h2>Review Complete!</h2>
          <p style="color:var(--text-muted)">You reviewed ${currentIndex} cards</p>
          <div style="font-size:2rem;font-weight:800;color:var(--green-dark);margin:1rem 0">${sessionCorrect} correct</div>
          <div class="flex gap-1 justify-between flex-wrap mt-2">
            <a href="#/" class="btn btn-ghost">← Home</a>
            <a href="#/progress" class="btn btn-primary">View Progress →</a>
          </div>
        </div>
      `;
    }
  }

  return { render, _flip, _rate };
})();
