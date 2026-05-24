// router.js – Hash-based router with :param support
const Router = (() => {
  const routes = [];
  let notFoundHandler = null;

  function add(pattern, handler) {
    // Convert :param segments to named capture groups
    const regexStr = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)');
    routes.push({ pattern, regex: new RegExp(`^${regexStr}$`), handler });
  }

  function notFound(handler) {
    notFoundHandler = handler;
  }

  function resolve(path) {
    for (const route of routes) {
      const match = path.match(route.regex);
      if (match) {
        route.handler(match.groups || {});
        return true;
      }
    }
    if (notFoundHandler) notFoundHandler(path);
    return false;
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  function getPath() {
    const hash = window.location.hash;
    return hash.startsWith('#') ? hash.slice(1) : hash || '/';
  }

  function init() {
    function onHashChange() {
      const path = getPath();
      resolve(path);
    }

    window.addEventListener('hashchange', onHashChange);
    // Initial load
    onHashChange();
  }

  return { add, notFound, navigate, getPath, init };
})();
