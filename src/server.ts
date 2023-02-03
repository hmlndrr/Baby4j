import 'dotenv'
import { serve } from 'http'
import {
  getClient,
  getAllPersons,
  getWhoThatPersonKnows,
  getTemplate,
} from 'utils'

async function handler(req: Request) {
  console.log(req.url)
  const [_url, query] = req.url.split('?')
  let result = ''
  const client = await getClient()
  console.log(query)

  if (query) {
    const params = new URLSearchParams(query)
    const q = params.get('q')
    result = await getWhoThatPersonKnows(client, q)
  } else {
    result = await getAllPersons(client)
  }

  const template = await getTemplate({
    names: result,
  })

  const res = new Response(template, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

  return res
}

serve(handler, {
  port: 8000,
})
