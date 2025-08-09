export async function GET() {
  return Response.json({
    status: 'ok',
    date: new Date().toISOString().slice(0, 10),
    sign: 'Gemini',
    daily: 'Сегодня благоприятный день для планирования и общения. Сохраняйте открытость к новым идеям.'
  });
}