import * as eta from 'eta'
import neo4j, { type Driver } from 'neo4j'

export function getClient() {
  const username = Deno.env.get('N4J_USER') || 'neo4j'
  const password = Deno.env.get('N4J_PASS') || 'neo4j'
  const host = Deno.env.get('N4J_HOST')
  const URI = 'neo4j+s://' + host
  const driver: Driver = neo4j.driver(URI, neo4j.auth.basic(username, password))
  const session = driver.session()

  return {
    run: (cipher: string) => session.run(cipher),
    bye: async () => {
      await session.close()
      await driver.close()
    },
  }
}

export async function getAllPersons(client) {
  const q = `match (x:Person) return x`
  const results = await client.run(q)
  return results.records.map(record => record.get('x').properties.name)
}

export async function getWhoThatPersonKnows(client, person: string) {
  try {
    if (
      person.toLocaleLowerCase().includes('set') ||
      person.toLocaleLowerCase().includes('modify') ||
      person.toLocaleLowerCase().includes('update')
    ) {
      return []
    }
    const q = `
      match (x:Person)-[:KNOWS]->(y:Person where y.name = '${person}') return x
      `
    const results = await client.run(q)
    return results.records.map(record => record.get('x').properties.name)
  } catch (e) {
    return ['Error: ' + e.message]
  }
}

export async function getTemplate(data) {
  console.log(data)
  const template = await Deno.readTextFile('templates/index.html')
  return new TextEncoder().encode(eta.render(template, data))
}
