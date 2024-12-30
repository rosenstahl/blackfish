import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/*', () => {
    // Return a mocked response
    return new HttpResponse('Mocked response');
  })
]

export default handlers;