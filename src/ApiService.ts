export const ApiService = {
  postNatal: async (data: Record<string, unknown>) => {
    const res = await fetch('https://YOUR_BACKEND/api/natal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
