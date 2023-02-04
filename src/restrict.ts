import 'dotenv'
import { getClient } from 'utils'

async function restrict() {
  const client = await getClient()

  // const cmd = 'DENY CREATE ON GRAPH neo4j ELEMENTS * TO public'
  const cmd = "CALL dbms.setConfigValue('server.databases.read_only', 'neo4j')"

  const r = await client.run(cmd)
  console.log(r)

  // const cmd2 = "CALL db.addUserToRole('neo4j', 'readOnlyRole')"
  // await client.run(cmd2)

  console.log('Restricted access to read only')

  // try to add something

  const cmd3 = 'CREATE (n:Person {name: "John"})'
  await client.run(cmd3)
}

restrict()

//
