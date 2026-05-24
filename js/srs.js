// srs.js – SM-2 spaced repetition algorithm (pure functions)
const SRS = (() => {
  const FAIL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

  function defaultCard(id) {
    return { id, interval: 0, repetitions: 0, efactor: 2.5, nextReview: Date.now() };
  }

  function loadAll() {
    return Store.get('srs_cards', {});
  }

  function saveAll(cards) {
    Store.set('srs_cards', cards);
  }

  function getCard(id) {
    const all = loadAll();
    return all[id] || defaultCard(id);
  }

  // SM-2 review: quality 0-5
  function review(card, quality) {
    const q = Math.max(0, Math.min(5, quality));
    let { interval, repetitions, efactor } = card;

    // Update efactor
    efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    if (q < 3) {
      // Fail: reset repetitions, review soon
      repetitions = 0;
      interval = 0;
      return {
        ...card,
        interval,
        repetitions,
        efactor,
        nextReview: Date.now() + FAIL_INTERVAL_MS,
      };
    }

    // Pass
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetitions += 1;

    return {
      ...card,
      interval,
      repetitions,
      efactor,
      nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
    };
  }

  function saveReview(id, quality) {
    const all = loadAll();
    const card = all[id] || defaultCard(id);
    all[id] = review(card, quality);
    saveAll(all);
    return all[id];
  }

  function getDueCards(unitCards) {
    const all = loadAll();
    const now = Date.now();
    return unitCards.filter(c => {
      const state = all[c.id];
      if (!state) return true; // never reviewed
      return state.nextReview <= now;
    });
  }

  function getDueCount(unitCards) {
    return getDueCards(unitCards).length;
  }

  function getTotalDueCount() {
    const allUnits = window.ALL_UNITS || [];
    let total = 0;
    allUnits.forEach(u => {
      total += getDueCount(u.flashcards || []);
    });
    return total;
  }

  function resetUnit(unitId) {
    const all = loadAll();
    const prefix = `${unitId}-`;
    Object.keys(all).forEach(k => {
      if (k.startsWith(prefix)) delete all[k];
    });
    saveAll(all);
  }

  return { defaultCard, getCard, review, saveReview, getDueCards, getDueCount, getTotalDueCount, resetUnit, loadAll };
})();
