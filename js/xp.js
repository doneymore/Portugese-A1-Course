// xp.js – XP engine, streaks, badges, levels
const XP = (() => {
  const LEVELS = [
    { level: 1, min: 0,    title: 'Iniciante' },
    { level: 2, min: 100,  title: 'Aprendiz' },
    { level: 3, min: 250,  title: 'Estudante' },
    { level: 4, min: 500,  title: 'Intermédio' },
    { level: 5, min: 900,  title: 'Avançado' },
    { level: 6, min: 1400, title: 'Fluente' },
    { level: 7, min: 2000, title: 'Mestre' },
  ];

  const XP_VALUES = {
    CARD_CORRECT:   5,
    CARD_PERFECT:  10,
    LESSON_DONE:   25,
    QUIZ_CORRECT:  10,
    PERFECT_QUIZ:  50,
    DAILY_STREAK:  15,
  };

  const BADGES = [
    { id: 'unit1',  name: 'Saudações',    emoji: '👋', unitId: 1 },
    { id: 'unit2',  name: 'Números',      emoji: '🔢', unitId: 2 },
    { id: 'unit3',  name: 'Cores',        emoji: '🎨', unitId: 3 },
    { id: 'unit4',  name: 'Família',      emoji: '👨‍👩‍👧', unitId: 4 },
    { id: 'unit5',  name: 'Tempo',        emoji: '🕐', unitId: 5 },
    { id: 'unit6',  name: 'Verbos',       emoji: '📝', unitId: 6 },
    { id: 'unit7',  name: 'Comida',       emoji: '🍽️', unitId: 7 },
    { id: 'unit8',  name: 'Lugares',      emoji: '🏙️', unitId: 8 },
    { id: 'unit9',  name: 'Compras',      emoji: '🛍️', unitId: 9 },
    { id: 'unit10', name: 'Conversação',  emoji: '💬', unitId: 10 },
  ];

  function getData() {
    return Store.get('xp_data', {
      totalXP: 0, level: 1, streak: 0,
      lastActivityDate: null, badges: [],
    });
  }

  function saveData(d) {
    Store.set('xp_data', d);
  }

  function getLevelInfo(totalXP) {
    let info = LEVELS[0];
    for (const l of LEVELS) {
      if (totalXP >= l.min) info = l;
    }
    const nextLevel = LEVELS.find(l => l.min > totalXP);
    return {
      ...info,
      nextMin: nextLevel ? nextLevel.min : null,
      progress: nextLevel
        ? Math.round(((totalXP - info.min) / (nextLevel.min - info.min)) * 100)
        : 100,
    };
  }

  function checkStreak() {
    const d = getData();
    const today = new Date().toDateString();
    const last = d.lastActivityDate;

    if (last === today) return d.streak;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = last === yesterday ? d.streak + 1 : 1;

    d.streak = newStreak;
    d.lastActivityDate = today;
    saveData(d);

    if (newStreak > 1) {
      addXP(XP_VALUES.DAILY_STREAK, 'Daily streak! 🔥');
    }
    return newStreak;
  }

  function addXP(amount, label) {
    const d = getData();
    d.totalXP = (d.totalXP || 0) + amount;
    const info = getLevelInfo(d.totalXP);
    const prevLevel = d.level || 1;
    d.level = info.level;
    saveData(d);

    if (label) {
      Toast.show(`+${amount} XP – ${label}`, 'xp');
    }

    if (info.level > prevLevel) {
      Toast.show(`Level up! Now level ${info.level} – ${info.title}! 🎉`, 'xp');
    }

    updateHeaderStats();
    return d;
  }

  function awardCardXP(quality) {
    checkStreak();
    if (quality === 5) {
      addXP(XP_VALUES.CARD_PERFECT, 'Perfect card!');
    } else if (quality >= 3) {
      addXP(XP_VALUES.CARD_CORRECT, 'Card correct');
    }
  }

  function awardLessonXP(unitId) {
    checkStreak();
    addXP(XP_VALUES.LESSON_DONE, 'Lesson complete!');
    markUnitProgress(unitId, 'lesson');
  }

  function awardQuizXP(correct, total) {
    checkStreak();
    addXP(XP_VALUES.QUIZ_CORRECT * correct, `Quiz: ${correct}/${total} correct`);
    if (correct === total && total > 0) {
      addXP(XP_VALUES.PERFECT_QUIZ, 'Perfect quiz!');
    }
    markUnitProgress(null, 'quiz');
  }

  function markUnitProgress(unitId, type) {
    if (!unitId) return;
    Store.update('unit_progress', prog => {
      if (!prog[unitId]) prog[unitId] = {};
      prog[unitId][type] = true;
      return prog;
    }, {});

    checkBadges(unitId);
  }

  function checkBadges(unitId) {
    const prog = Store.get('unit_progress', {});
    const u = prog[unitId] || {};
    const done = u.lesson && u.quiz;
    if (!done) return;

    const d = getData();
    const badge = BADGES.find(b => b.unitId === unitId);
    if (badge && !d.badges.includes(badge.id)) {
      d.badges.push(badge.id);
      saveData(d);
      Toast.show(`Badge earned: ${badge.emoji} ${badge.name}!`, 'xp');
    }
  }

  function getUnitProgress(unitId) {
    const prog = Store.get('unit_progress', {});
    return prog[unitId] || {};
  }

  function getUnitProgressPercent(unit) {
    const prog = getUnitProgress(unit.id);
    const activities = ['lesson', 'quiz', 'flashcards', 'conversations'];
    const done = activities.filter(a => prog[a]).length;
    return Math.round((done / activities.length) * 100);
  }

  function updateHeaderStats() {
    const d = getData();
    const streakEl = document.getElementById('header-streak');
    const xpEl = document.getElementById('header-xp');
    if (streakEl) streakEl.textContent = d.streak || 0;
    if (xpEl) xpEl.textContent = `${d.totalXP || 0} XP`;
  }

  function resetAll() {
    Store.clearAll();
    updateHeaderStats();
  }

  return {
    getData, getLevelInfo, checkStreak, addXP,
    awardCardXP, awardLessonXP, awardQuizXP,
    markUnitProgress, getUnitProgress, getUnitProgressPercent,
    updateHeaderStats, resetAll, BADGES, XP_VALUES,
  };
})();

// ========== Toast ==========
const Toast = (() => {
  function show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }
  return { show };
})();
