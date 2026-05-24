// store.js – LocalStorage abstraction with ptlingo_ namespace
const Store = (() => {
  const PREFIX = 'ptlingo_';

  function key(name) { return PREFIX + name; }

  function get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  }

  function set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
    } catch (e) {
      console.warn('Store.set failed:', e);
    }
  }

  function remove(name) {
    localStorage.removeItem(key(name));
  }

  function update(name, updater, fallback = {}) {
    const current = get(name, fallback);
    const next = updater(current);
    set(name, next);
    return next;
  }

  function clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  return { get, set, remove, update, clearAll };
})();
