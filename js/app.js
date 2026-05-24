// app.js – Bootstrap and route registration
(function () {
  // Register all routes
  Router.add('/', HomeView.render);
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

  // Init XP header stats on load
  XP.updateHeaderStats();

  // Init router
  Router.init();
})();
