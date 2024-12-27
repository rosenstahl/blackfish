import { http } from 'msw'

export const handlers = [
  http.get('/api/*', ({ request }) => {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
]