import { serve } from 'https://deno.land/std/http/server.ts'
import { getClient } from './client.ts'

async function getAllPersons(client) {
  const q = `match (x:Person) return x`
  const results = await client.run(q)
  return results.records.map(record => record.get('x').properties.name)
}

async function getWhoThatPersonKnows(client, person) {
  try {
    const q = `
    match (x:Person)-[:KNOWS]->(y:Person where y.name = '${person}') return x
    `
    console.log(q);
    
    const results = await client.run(q)
    return results.records.map(record => record.get('x').properties.name)
  } catch (e: any) {
    return "Error: " + e.message
  }
}

async function handler(req: Request) {
  const [_url, query] = req.url.split('?')
  let result = ''
  const client = await getClient()

  if (query) {
    const params = new URLSearchParams(query)
    const q = params.get('q')
    result = await getWhoThatPersonKnows(client, q)
  } else {
    result = await getAllPersons(client)
  }

  const res = new Response(result, {
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
