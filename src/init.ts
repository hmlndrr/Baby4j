import 'dotenv'
import { getClient } from 'utils'

async function init() {
  const client = await getClient()

  async function relate(x, y, relationship) {
    const q = `
        MATCH (x:Person), (y:Person)
        WHERE x.name = '${x}' AND y.name = '${y}'
        CREATE (x)-[:${relationship}]->(y)
        CREATE (y)-[:${relationship}]->(x)
        `
    await client.run(q)
    console.log(`Added ${relationship} relationship between ${x} and ${y}`)
  }

  async function add(name) {
    const q = `CREATE (x:Person {name: '${name}'})`
    await client.run(q)
    console.log(`Added ${name}`)
  }

  async function clear() {
    await client.run('MATCH (n) DETACH DELETE n')
    console.log('Database cleared')
  }

  async function hideFlag() {
    const flag = Deno.env.get('FLAG')
    await client.run(`
            MATCH (x:Person) WHERE x.name = 'Petar'
            CREATE (x)-[:IS_HIDING]->(:Secret { name: '${flag}' })
        `)

    console.log('Flag hidden')
  }

  await clear()

  const persons = [
    'Alice',
    'Bob',
    'Carol',
    'Dave',
    'Eve',
    'Frank',
    'Grace',
    'Hank',
    'Iris',
    'John',
    'Kathy',
    'Linda',
    'Mike',
    'Nancy',
    'Oscar',
    'Peggy',
    'Quinn',
    'Ralph',
    'Sally',
    'Petar',
  ]

  const pingRelationship = [
    ['Alice', 'Bob'],
    ['Alice', 'Carol'],
    ['Alice', 'Dave'],
    ['Oscar', 'Peggy'],
    ['Oscar', 'Quinn'],
    ['Oscar', 'Ralph'],
    ['Oscar', 'Sally'],
    ['Oscar', 'Petar'],
    ['Peggy', 'Quinn'],
    ['Peggy', 'Ralph'],
    ['Iris', 'John'],
    ['Iris', 'Kathy'],
    ['Iris', 'Linda'],
    ['Hank', 'Iris'],
  ]

  for await (const name of persons) {
    await add(name)
  }

  for await (const [x, y] of pingRelationship) {
    await relate(x, y, 'KNOWS')
  }

  await hideFlag()
}

init()
