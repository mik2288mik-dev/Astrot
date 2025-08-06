export const ApiService = {
  async postNatal(payload: unknown) {
    const res = await fetch('https://<твой-бэк>/api/natal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
