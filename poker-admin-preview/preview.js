// Read-only static preview adapter. All displayed records are synthetic.
(() => {
  const originalFetch = window.fetch.bind(window);
  let dataPromise;
  const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

  window.fetch = async (input, init = {}) => {
    const rawUrl = typeof input === 'string' ? input : input.url;
    const url = new URL(rawUrl, location.href);
    if (!url.pathname.startsWith('/api/admin/')) return originalFetch(input, init);

    const method = (init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase();
    if (method !== 'GET') return json({ error: '閲覧用プレビューのため、変更は保存されません。' }, 403);
    if (url.pathname === '/api/admin/data') {
      dataPromise ||= originalFetch('./demo-data.json').then(response => {
        if (!response.ok) throw new Error('サンプルデータを読み込めませんでした。');
        return response.json();
      });
      return json(await dataPromise);
    }
    if (url.pathname === '/api/admin/line/followers') return json({ status: 'unconfigured' });
    if (url.pathname === '/api/admin/conversations') return json({ conversations: [] });
    if (url.pathname.startsWith('/api/admin/conversations/')) return json({ conversation: null });
    return json({ error: '閲覧用プレビューではこの機能を利用できません。' }, 403);
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="/api/admin/"]');
    if (!link) return;
    event.preventDefault();
    window.alert('閲覧用プレビューではダウンロードできません。');
  });
})();
