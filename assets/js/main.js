/**
 * ram Blog - Funcionalidades interactivas
 * - Buscador global de publicaciones
 * - Cambio de vista: lista / cuadrícula
 * - Menú móvil del sidebar
 */

(function () {
  'use strict';

  /* =========================================================
     Utilidades
     ========================================================= */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function debounce(fn, wait) {
    var timeout;
    return function () {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  /* =========================================================
     Menú móvil
     ========================================================= */
  var menuToggle = $('[data-menu-toggle]');
  var sidebar = $('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar sidebar al hacer clic en un enlace (móvil)
    sidebar.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================================================
     Cambio de vista: lista / cuadrícula
     ========================================================= */
  var postList = $('[data-post-list]');
  var viewButtons = $$('[data-view]');

  function setView(view) {
    if (!postList) return;

    if (view === 'list') {
      postList.classList.remove('post-list--grid');
      postList.classList.add('post-list--list');
    } else {
      postList.classList.remove('post-list--list');
      postList.classList.add('post-list--grid');
    }

    viewButtons.forEach(function (button) {
      var isActive = button.dataset.view === view;
      button.classList.toggle('view-toggle__btn--active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    try {
      localStorage.setItem('gio-blog-view', view);
    } catch (e) {
      // localStorage no disponible (modo privado, etc.)
    }
  }

  if (postList && viewButtons.length) {
    var savedView = null;
    try {
      savedView = localStorage.getItem('gio-blog-view');
    } catch (e) {
      savedView = null;
    }

    // Por defecto siempre lista; solo se aplica la preferencia guardada
    // si el usuario la cambió explicitamente.
    if (savedView === 'list' || savedView === 'grid') {
      setView(savedView);
    } else {
      setView('list');
    }

    viewButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setView(button.dataset.view);
      });
    });
  }

  /* =========================================================
     Buscador global
     ========================================================= */
  var searchOverlay = $('#search-overlay');
  var searchToggleButtons = $$('[data-search-toggle]');
  var searchCloseButtons = $$('[data-search-close]');
  var searchInput = $('#search-input');
  var searchResults = $('#search-results');
  var searchDataUrl = (window.GIO_SEARCH_URL || '/search.json');

  var postsIndex = [];
  var indexLoaded = false;

  function loadSearchIndex() {
    if (indexLoaded) return Promise.resolve(postsIndex);

    return fetch(searchDataUrl, {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('No se pudo cargar el índice de búsqueda');
        return response.json();
      })
      .then(function (data) {
        postsIndex = Array.isArray(data) ? data : [];
        indexLoaded = true;
        return postsIndex;
      })
      .catch(function (error) {
        console.error('Error cargando índice de búsqueda:', error);
        searchResults.innerHTML = '<p class="search-results__empty">Error al cargar el buscador. Inténtalo más tarde.</p>';
        return [];
      });
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    loadSearchIndex().then(function () {
      if (searchInput) {
        searchInput.focus();
      }
    });
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.hidden = true;
    document.body.style.overflow = '';
    if (searchInput) {
      searchInput.value = '';
    }
    if (searchResults) {
      searchResults.innerHTML = '<p class="search-results__hint">Escribe para buscar en títulos, contenido y etiquetas.</p>';
    }
  }

  searchToggleButtons.forEach(function (btn) {
    btn.addEventListener('click', openSearch);
  });

  searchCloseButtons.forEach(function (btn) {
    btn.addEventListener('click', closeSearch);
  });

  if (searchOverlay) {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !searchOverlay.hidden) {
        closeSearch();
      }
    });
  }

  function highlightText(text, query) {
    if (!query) return text;
    var safeQuery = escapeRegExp(query);
    var regex = new RegExp('(' + safeQuery + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function renderResults(results, query) {
    if (!searchResults) return;

    if (!query.trim()) {
      searchResults.innerHTML = '<p class="search-results__hint">Escribe para buscar en títulos, contenido y etiquetas.</p>';
      return;
    }

    if (!results.length) {
      searchResults.innerHTML = '<p class="search-results__empty">No se encontraron artículos que coincidan con tu búsqueda.</p>';
      return;
    }

    var html = '';
    results.forEach(function (post) {
      var excerpt = post.description || post.content || '';
      if (excerpt.length > 160) {
        excerpt = excerpt.substring(0, 160) + '…';
      }

      html += '<a class="search-result" href="' + post.url + '">' +
        '<h3 class="search-result__title">' + highlightText(post.title, query) + '</h3>' +
        '<p class="search-result__meta">' + (post.formatted_date || post.date) +
        (post.category ? ' · ' + post.category : '') + '</p>' +
        '<p class="search-result__excerpt">' + highlightText(excerpt, query) + '</p>' +
        '</a>';
    });

    searchResults.innerHTML = html;
  }

  function performSearch(query) {
    var normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      renderResults([], query);
      return;
    }

    var terms = normalizedQuery.split(/\s+/).filter(Boolean);

    var results = postsIndex.filter(function (post) {
      var searchText = [
        post.title || '',
        post.description || '',
        post.content || '',
        (post.tags || []).join(' '),
        post.category || ''
      ].join(' ').toLowerCase();

      return terms.every(function (term) {
        return searchText.indexOf(term) !== -1;
      });
    });

    // Ordenar por relevancia: título primero, luego etiquetas, luego contenido
    results.sort(function (a, b) {
      function score(post) {
        var title = (post.title || '').toLowerCase();
        var tags = (post.tags || []).join(' ').toLowerCase();
        var content = (post.content || '').toLowerCase();
        var s = 0;
        terms.forEach(function (term) {
          if (title.indexOf(term) !== -1) s += 3;
          if (tags.indexOf(term) !== -1) s += 2;
          if (content.indexOf(term) !== -1) s += 1;
        });
        return s;
      }
      return score(b) - score(a);
    });

    renderResults(results.slice(0, 10), query);
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce(function (event) {
      performSearch(event.target.value);
    }, 200));
  }

  /* =========================================================
     Atajo de teclado Cmd/Ctrl + K para abrir búsqueda
     ========================================================= */
  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
  });

  /* =========================================================
     Contador de vistas por post (CounterAPI v1)
     ========================================================= */
  var viewCounter = $('[data-view-counter]');

  function formatViewCount(count) {
    if (typeof count !== 'number' || isNaN(count)) return '—';
    return count.toLocaleString('es-ES');
  }

  function setViewCounterText(count, suffix) {
    if (!viewCounter) return;
    var countEl = viewCounter.querySelector('[data-view-count]');
    if (!countEl) return;
    countEl.textContent = formatViewCount(count);
    if (suffix) countEl.setAttribute('title', suffix);
  }

  function deriveCounterName() {
    var name = viewCounter && viewCounter.dataset.name;
    if (name) return name;
    name = window.location.pathname
      .replace(/\/$/, '')
      .replace(/^\//, '')
      .replace(/\/+/g, '-')
      .replace(/\./g, '-');
    return name || 'home';
  }

  function localViewCountKey(name) {
    return 'gio:views:' + name;
  }

  function bumpLocalViewCount(name) {
    try {
      var key = localViewCountKey(name);
      var value = parseInt(localStorage.getItem(key) || '0', 10) || 0;
      value += 1;
      localStorage.setItem(key, String(value));
      return value;
    } catch (e) {
      return null;
    }
  }

  function getLocalViewCount(name) {
    try {
      var value = parseInt(localStorage.getItem(localViewCountKey(name)) || '0', 10);
      return isNaN(value) ? null : value;
    } catch (e) {
      return null;
    }
  }

  function initViewCounter() {
    if (!viewCounter) {
      console.log('[view-counter] No hay elemento [data-view-counter] en la página.');
      return;
    }

    var namespace = viewCounter.dataset.namespace || 'ramarak-blog';
    var name = deriveCounterName();
    console.log('[view-counter] Inicializando contador:', namespace + '/' + name);

    var endpoint = 'https://api.counterapi.dev/v1/' +
      encodeURIComponent(namespace) + '/' +
      encodeURIComponent(name) + '/up';

    fetch(endpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      referrerPolicy: 'no-referrer'
    })
      .then(function (response) {
        console.log('[view-counter] Respuesta HTTP:', response.status);
        if (!response.ok) throw new Error('CounterAPI responded with ' + response.status);
        return response.json();
      })
      .then(function (data) {
        console.log('[view-counter] Datos recibidos:', data);
        var count = null;
        if (data && typeof data.count === 'number') count = data.count;
        else if (data && typeof data.value === 'number') count = data.value;

        if (count !== null) {
          setViewCounterText(count, 'Contador global');
          try { localStorage.setItem(localViewCountKey(name), String(count)); } catch (e) {}
        } else {
          throw new Error('La respuesta no contiene un contador válido');
        }
      })
      .catch(function (error) {
        console.error('[view-counter] Error al contactar CounterAPI:', error);
        // Fallback: contador local basado en localStorage
        var localCount = bumpLocalViewCount(name);
        if (localCount !== null) {
          console.log('[view-counter] Usando contador local:', localCount);
          setViewCounterText(localCount, 'Contador local (fallback)');
        } else {
          setViewCounterText(null, 'No se pudo cargar el contador');
        }
      });
  }

  initViewCounter();
})();
