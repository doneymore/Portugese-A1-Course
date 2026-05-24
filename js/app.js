// app.js – Bootstrap and route registration
(function () {
  // Register all routes
  Router.add('/', HomeView.render);
  Router.add('/review', AllReviewView.render);
  Router.add('/unit/:id', UnitView.render);
  Router.add('/unit/:id/lesson', LessonView.render);
  Router.add('/unit/:id/flashcards', FlashcardsView.render);
  Router.add('/unit/:id/quiz', QuizView.render);
  Router.add('/unit/:id/conversations', ConversationsView.render);
  Router.add('/progress', ProgressView.render);

  Router.notFound((path) => {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗺️</div>
        <h3>Page not found</h3>
        <p>Path: ${path}</p>
        <a href="#/" class="btn btn-primary mt-2">Go Home</a>
      </div>`;
  });

  // Sync active state on all [data-nav] links and update the due badge
  function syncNav() {
    const path = Router.getPath();

    document.querySelectorAll('[data-nav]').forEach(el => {
      const nav = el.dataset.nav;
      const active = nav === '/' ? path === '/' : path.startsWith(nav);
      el.classList.toggle('active', active);
    });

    const badge = document.getElementById('bnav-due');
    if (badge) {
      const due = SRS.getTotalDueCount();
      badge.textContent = due;
      badge.style.display = due > 0 ? '' : 'none';
    }
  }

  window.addEventListener('hashchange', syncNav);

  // Init header stats
  XP.updateHeaderStats();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Init router (triggers first render)
  Router.init();
  syncNav();

  // Init morning flashcard + notification permission
  Notifications.init();
})();
