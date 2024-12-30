import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/*', async ({ request }) => {
    const response = await handleRequest(request);
    return response;
  })
];

async function handleRequest(request: Request) {
  // Implementierung der Request-Verarbeitung
  return new HttpResponse('Mocked response');
}

export default handlers;