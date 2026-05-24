// views/lesson.js – Lesson renderer
const LessonView = (() => {
  function render({ id }) {
    const unitId = parseInt(id);
    const unit = (window.ALL_UNITS || []).find(u => u.id === unitId);
    const app = document.getElementById('app');

    if (!unit) {
      app.innerHTML = `<div class="empty-state"><h3>Unit not found</h3><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>`;
      return;
    }

    const lesson = unit.lesson;

    const sectionsHtml = lesson.sections.map(section => {
      const examplesHtml = section.examples && section.examples.length
        ? `<table class="example-table">
            <thead><tr><th>Portuguese</th><th>English</th>${section.examples.some(e => e.note) ? '<th>Note</th>' : ''}</tr></thead>
            <tbody>
              ${section.examples.map(ex => `
                <tr>
                  <td>
                    <span class="example-pt">
                      ${ex.pt}
                      <button class="btn-icon" onclick="Speech.speak('${ex.pt.replace(/'/g, "\\'")}')">🔊</button>
                    </span>
                    ${ex.phonetic ? `<div class="example-phonetic">[${ex.phonetic}]</div>` : ''}
                  </td>
                  <td>${ex.en}</td>
                  ${section.examples.some(e => e.note) ? `<td class="example-note">${ex.note || ''}</td>` : ''}
                </tr>`).join('')}
            </tbody>
          </table>`
        : '';

      return `
        <div class="lesson-section">
          <h2>${section.heading}</h2>
          ${section.body ? `<div class="lesson-body">${section.body}</div>` : ''}
          ${examplesHtml}
        </div>`;
    }).join('');

    const prevUnit = unitId > 1 ? unitId - 1 : null;
    const nextUnit = unitId < (window.ALL_UNITS || []).length ? unitId + 1 : null;

    app.innerHTML = `
      <div class="lesson-container">
        <div class="breadcrumb">
          <a href="#/">Home</a> › <a href="#/unit/${unitId}">Unit ${unitId}</a> › Lesson
        </div>
        <div class="page-header">
          <h1>📖 ${lesson.title}</h1>
        </div>

        ${sectionsHtml}

        <div class="lesson-nav">
          <a href="#/unit/${unitId}" class="btn btn-ghost">← Back to Unit</a>
          <div class="flex gap-1 flex-wrap">
            <button class="btn btn-primary" id="complete-lesson-btn">
              Mark Lesson Complete ✓
            </button>
            <a href="#/unit/${unitId}/flashcards" class="btn btn-outline">
              Practice Flashcards →
            </a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('complete-lesson-btn').addEventListener('click', () => {
      XP.awardLessonXP(unitId);
      document.getElementById('complete-lesson-btn').disabled = true;
      document.getElementById('complete-lesson-btn').textContent = '✅ Completed!';
    });
  }

  return { render };
})();
