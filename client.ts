import "https://deno.land/x/dotenv/load.ts"
import neo4j from "https://deno.land/x/neo4j_lite_client@4.4.1-preview2/mod.ts"

export function getClient() {
    const username = Deno.env.get('N4J_USER')
    const password = Deno.env.get('N4J_PASS')
    const host = Deno.env.get('N4J_HOST')
    const URI = 'neo4j+s://' + host
    const driver: neo4j.Driver = neo4j.driver(URI, neo4j.auth.basic(username, password))
    const session = driver.session();


    return {
        run: (cipher: string) => session.run(cipher),
        bye: async () => {
            await session.close();
            await driver.close();
        }
    }
}