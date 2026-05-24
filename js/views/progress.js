// views/progress.js – Progress & badges
const ProgressView = (() => {
  function render() {
    const app = document.getElementById('app');
    const xpData = XP.getData();
    const levelInfo = XP.getLevelInfo(xpData.totalXP);
    const units = window.ALL_UNITS || [];
    const srsAll = SRS.loadAll();

    // Count reviewed cards
    const reviewedCards = Object.keys(srsAll).length;
    const totalCards = units.reduce((s, u) => s + (u.flashcards || []).length, 0);

    // Build badges grid
    const badgesHtml = XP.BADGES.map(badge => {
      const earned = (xpData.badges || []).includes(badge.id);
      return `
        <div class="badge-item ${earned ? 'earned' : ''}">
          <span class="badge-emoji">${badge.emoji}</span>
          <div class="badge-name">${badge.name}</div>
          ${earned ? '<div style="font-size:0.72rem;color:#059669;font-weight:700">Earned!</div>' : ''}
        </div>`;
    }).join('');

    // Build unit progress list
    const unitListHtml = units.map(unit => {
      const pct = XP.getUnitProgressPercent(unit);
      const prog = XP.getUnitProgress(unit.id);
      const dueCount = SRS.getDueCount(unit.flashcards || []);
      const activities = ['lesson', 'quiz', 'flashcards', 'conversations'];
      const done = activities.filter(a => prog[a]).map(a => a).join(', ');
      return `
        <div class="unit-progress-item">
          <div class="unit-prog-header">
            <span class="unit-prog-name">Unit ${unit.id}: ${unit.lesson.title}</span>
            <span class="unit-prog-pct">${pct}%${dueCount > 0 ? ` · <span class="due-badge">${dueCount} due</span>` : ''}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          ${done ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.3rem">Completed: ${done}</div>` : ''}
        </div>`;
    }).join('');

    app.innerHTML = `
      <div class="progress-container">
        <div class="page-header">
          <h1>📊 Your Progress</h1>
        </div>

        <!-- XP Level Card -->
        <div class="xp-bar-card">
          <div class="xp-level-header">
            <div>
              <strong>Level ${levelInfo.level} – ${levelInfo.title}</strong>
              <div style="font-size:0.85rem;color:var(--text-muted)">${xpData.totalXP} XP total</div>
            </div>
            <div class="xp-level-badge">Lv. ${levelInfo.level}</div>
          </div>
          ${levelInfo.nextMin ? `
            <div class="xp-bar-outer">
              <div class="xp-bar-inner" style="width:${levelInfo.progress}%"></div>
            </div>
            <div class="xp-bar-label">${xpData.totalXP} / ${levelInfo.nextMin} XP to level ${levelInfo.level + 1}</div>
          ` : `<div class="xp-bar-label">🏆 Max level reached!</div>`}
        </div>

        <!-- Stats Row -->
        <div class="stats-row" style="margin-bottom:1.5rem">
          <div class="stat-card">
            <div class="stat-emoji">🔥</div>
            <div class="stat-value">${xpData.streak || 0}</div>
            <div class="stat-label">Day Streak</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">🃏</div>
            <div class="stat-value">${reviewedCards}</div>
            <div class="stat-label">Cards Reviewed</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">📚</div>
            <div class="stat-value">${totalCards}</div>
            <div class="stat-label">Total Cards</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">🏅</div>
            <div class="stat-value">${(xpData.badges || []).length} / ${XP.BADGES.length}</div>
            <div class="stat-label">Badges Earned</div>
          </div>
        </div>

        <!-- Badges -->
        <div class="card mb-2">
          <div class="section-header">
            <h2 class="section-title">Badges</h2>
          </div>
          <div class="badges-grid">${badgesHtml}</div>
        </div>

        <!-- Unit Progress -->
        <div class="card mb-2">
          <div class="section-header">
            <h2 class="section-title">Unit Progress</h2>
          </div>
          <div class="unit-progress-list">${unitListHtml}</div>
        </div>

        <!-- Settings -->
        <div class="card mb-2">
          <h2 class="section-title" style="margin-bottom:1rem">Settings</h2>
          <div class="flex gap-1 flex-wrap items-center">
            <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.92rem">
              <input type="checkbox" id="speech-toggle" ${Speech.isEnabled() ? 'checked' : ''}>
              Enable speech (pt-PT)
            </label>
            <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.92rem">
              Speed:
              <select id="speech-rate" style="border:1px solid var(--border);border-radius:4px;padding:2px 6px">
                <option value="0.7" ${Store.get('settings', {speechRate:0.85}).speechRate == 0.7 ? 'selected' : ''}>Slow</option>
                <option value="0.85" ${Store.get('settings', {speechRate:0.85}).speechRate == 0.85 ? 'selected' : ''}>Normal</option>
                <option value="1.0" ${Store.get('settings', {speechRate:0.85}).speechRate == 1.0 ? 'selected' : ''}>Fast</option>
              </select>
            </label>
          </div>
          <div class="mt-2">
            <button class="btn btn-danger btn-sm" id="reset-btn">Reset All Progress</button>
          </div>
        </div>
      </div>
    `;

    // Settings handlers
    document.getElementById('speech-toggle').addEventListener('change', e => {
      Speech.setEnabled(e.target.checked);
    });

    document.getElementById('speech-rate').addEventListener('change', e => {
      Speech.setRate(parseFloat(e.target.value));
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
      if (confirm('Reset ALL progress? This cannot be undone.')) {
        XP.resetAll();
        Toast.show('Progress reset!', 'info');
        render();
      }
    });
  }

  return { render };
})();
