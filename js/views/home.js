// views/home.js – Dashboard
const HomeView = (() => {
  function render() {
    const app = document.getElementById('app');
    const xpData = XP.getData();
    const levelInfo = XP.getLevelInfo(xpData.totalXP);
    const totalDue = SRS.getTotalDueCount();
    const units = window.ALL_UNITS || [];

    const unitCards = units.map(unit => {
      const pct = XP.getUnitProgressPercent(unit);
      const dueCount = SRS.getDueCount(unit.flashcards || []);
      return `
        <a href="#/unit/${unit.id}" class="unit-card">
          <div class="unit-card-header">
            <div class="unit-number">${unit.id}</div>
            <div>
              <div class="unit-title">${unit.lesson.title}</div>
              <div class="unit-subtitle">${unit.subtitle || ''}</div>
            </div>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          <div class="progress-label">
            ${pct}%${dueCount > 0 ? ` <span class="due-badge">${dueCount} due</span>` : ''}
          </div>
        </a>`;
    }).join('');

    app.innerHTML = `
      <div class="page-header">
        <h1>Bem-vindo ao PortugalLingo! 🇵🇹</h1>
        <p>Learn European Portuguese at your own pace</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-emoji">⭐</div>
          <div class="stat-value">${xpData.totalXP}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-card">
          <div class="stat-emoji">🔥</div>
          <div class="stat-value">${xpData.streak || 0}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-emoji">📚</div>
          <div class="stat-value">${totalDue}</div>
          <div class="stat-label">Cards Due</div>
        </div>
        <div class="stat-card">
          <div class="stat-emoji">🏅</div>
          <div class="stat-value">${xpData.badges ? xpData.badges.length : 0}</div>
          <div class="stat-label">Badges</div>
        </div>
      </div>

      ${totalDue > 0 ? `
        <div class="card mb-2" style="background: #fef9c3; border: 2px solid #d4c200;">
          <div class="flex items-center justify-between flex-wrap gap-1">
            <div>
              <strong>📚 ${totalDue} flashcard${totalDue !== 1 ? 's' : ''} due for review!</strong>
              <p style="font-size:0.85rem;color:var(--text-muted)">Keep your streak alive by reviewing today.</p>
            </div>
            <a href="#/unit/1/flashcards" class="btn btn-primary btn-sm">Review Now</a>
          </div>
        </div>` : ''}

      <div class="section-header">
        <h2 class="section-title">Units</h2>
        <a href="#/progress" class="btn btn-ghost btn-sm">View Progress</a>
      </div>

      <div class="unit-grid">
        ${unitCards}
      </div>
    `;
  }

  return { render };
})();

// Unit overview view
const UnitView = (() => {
  function render({ id }) {
    const unitId = parseInt(id);
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const app = document.getElementById('app');

    if (!unit) {
      app.innerHTML = `<div class="empty-state"><div class="empty-icon">❓</div><h3>Unit not found</h3><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>`;
      return;
    }

    const prog = XP.getUnitProgress(unitId);
    const dueCount = SRS.getDueCount(unit.flashcards || []);

    const activities = [
      { key: 'lesson', icon: '📖', name: 'Lesson', desc: 'Learn vocabulary and grammar', href: `#/unit/${unitId}/lesson`, count: `${unit.lesson.sections.length} sections` },
      { key: 'flashcards', icon: '🃏', name: 'Flashcards', desc: 'Spaced repetition practice', href: `#/unit/${unitId}/flashcards`, count: dueCount > 0 ? `${dueCount} due` : `${unit.flashcards.length} cards` },
      { key: 'quiz', icon: '✏️', name: 'Quiz', desc: 'Test your knowledge', href: `#/unit/${unitId}/quiz`, count: `${unit.quiz.length} questions` },
      { key: 'conversations', icon: '💬', name: 'Conversations', desc: 'Practice real dialogues', href: `#/unit/${unitId}/conversations`, count: `${unit.conversations.length} dialogues` },
    ];

    const activityCards = activities.map(a => `
      <a href="${a.href}" class="activity-card">
        <div class="activity-icon">${a.icon}</div>
        <div class="activity-name">${a.name} ${prog[a.key] ? '✅' : ''}</div>
        <div class="activity-desc">${a.desc}</div>
        <div class="activity-count">${a.count}</div>
      </a>`).join('');

    app.innerHTML = `
      <div class="unit-overview">
        <div class="breadcrumb"><a href="#/">Home</a> › Unit ${unitId}</div>
        <div class="page-header">
          <h1>Unit ${unitId}: ${unit.lesson.title}</h1>
          <p>${unit.subtitle || ''}</p>
        </div>

        <div class="activity-grid">
          ${activityCards}
        </div>

        <div class="mt-3">
          <a href="#/" class="btn btn-ghost">← Back to Home</a>
        </div>
      </div>
    `;
  }

  return { render };
})();
