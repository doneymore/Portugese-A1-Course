// views/conversations.js – Scripted dialogue with line-by-line playback
const ConversationsView = (() => {
  let currentConv = 0;
  let currentLine = -1;
  let playing = false;
  let unitId = null;

  function render({ id }) {
    unitId = parseInt(id);
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const app = document.getElementById('app');

    if (!unit || !unit.conversations || unit.conversations.length === 0) {
      app.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <h3>No conversations yet</h3>
          <a href="#/unit/${unitId}" class="btn btn-primary mt-2">Back to Unit</a>
        </div>`;
      return;
    }

    const conversations = unit.conversations;

    const tabs = conversations.map((c, i) => `
      <button class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'} btn-sm"
        id="conv-tab-${i}" onclick="ConversationsView._switchConv(${i})">${c.title}</button>
    `).join('');

    app.innerHTML = `
      <div class="max-width-800">
        <div class="breadcrumb">
          <a href="#/">Home</a> › <a href="#/unit/${unitId}">Unit ${unitId}</a> › Conversations
        </div>
        <div class="page-header">
          <h1>💬 Conversations – ${unit.lesson.title}</h1>
        </div>
        <div class="flex gap-1 flex-wrap mb-2">${tabs}</div>
        <div id="conv-display"></div>
        <div class="mt-2">
          <button class="btn btn-primary" onclick="ConversationsView._markDone()">
            ✅ Mark Complete
          </button>
          <a href="#/unit/${unitId}" class="btn btn-ghost" style="margin-left:0.5rem">← Back to Unit</a>
        </div>
      </div>
    `;

    _switchConv(0);
  }

  function _switchConv(idx) {
    currentConv = idx;
    currentLine = -1;
    playing = false;
    Speech.cancel();

    // Update tabs
    document.querySelectorAll('[id^="conv-tab-"]').forEach((btn, i) => {
      btn.className = `btn ${i === idx ? 'btn-primary' : 'btn-ghost'} btn-sm`;
    });

    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const conv = unit.conversations[idx];
    const display = document.getElementById('conv-display');
    if (!display) return;

    const speakers = [...new Set(conv.lines.map(l => l.speaker))];
    const speakerClass = (sp) => speakers.indexOf(sp) === 0 ? '' : 'speaker-b';

    const linesHtml = conv.lines.map((line, i) => `
      <div class="dialogue-line ${speakerClass(line.speaker)}" id="line-${i}">
        <div class="speaker-avatar">${line.speaker.slice(0, 2).toUpperCase()}</div>
        <div class="line-content">
          <div class="line-text">${line.text}
            <button class="btn-icon" onclick="event.stopPropagation(); Speech.speak('${line.text.replace(/'/g, "\\'")}')">🔊</button>
          </div>
          <div class="line-translation">${line.en}</div>
        </div>
      </div>
    `).join('');

    display.innerHTML = `
      <div class="conversation-card">
        <div class="conv-header">
          <h2>${conv.title}</h2>
          <p>${conv.subtitle || ''}</p>
        </div>
        <div class="conv-controls">
          <button class="btn btn-primary btn-sm" onclick="ConversationsView._playAll()">▶ Play All</button>
          <button class="btn btn-ghost btn-sm" onclick="ConversationsView._stopPlay()">⏹ Stop</button>
          <button class="btn btn-ghost btn-sm" onclick="ConversationsView._resetLines()">↺ Reset</button>
        </div>
        <div class="conv-body">
          ${linesHtml}
        </div>
      </div>
    `;
  }

  function _playAll() {
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const conv = unit.conversations[currentConv];
    playing = true;
    currentLine = -1;
    _resetLines();
    _playLine(conv.lines, 0);
  }

  function _playLine(lines, idx) {
    if (!playing || idx >= lines.length) {
      playing = false;
      return;
    }
    currentLine = idx;
    _highlightLine(idx, lines.length);
    Speech.speak(lines[idx].text, () => {
      if (playing) {
        setTimeout(() => _playLine(lines, idx + 1), 500);
      }
    });
  }

  function _highlightLine(idx, total) {
    for (let i = 0; i < total; i++) {
      const el = document.getElementById(`line-${i}`);
      if (!el) continue;
      el.className = el.className.replace(/\bactive\b|\bplayed\b/g, '').trim();
      if (i < idx) el.className += ' played';
      else if (i === idx) el.className += ' active';
    }
  }

  function _stopPlay() {
    playing = false;
    Speech.cancel();
  }

  function _resetLines() {
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const conv = unit.conversations[currentConv];
    conv.lines.forEach((_, i) => {
      const el = document.getElementById(`line-${i}`);
      if (el) el.className = el.className.replace(/\bactive\b|\bplayed\b/g, '').trim();
    });
    currentLine = -1;
  }

  function _markDone() {
    Store.update('unit_progress', p => { if (!p[unitId]) p[unitId] = {}; p[unitId].conversations = true; return p; }, {});
    XP.addXP(15, 'Conversation complete!');
    Toast.show('Conversations complete! +15 XP', 'xp');
  }

  return { render, _switchConv, _playAll, _stopPlay, _resetLines, _markDone };
})();
