import http from 'node:http'
import { 
    GraphQLServer, 
    JsonLogger 
} from '@dreamit/graphql-server'
import { 
    userSchema, 
    userSchemaResolvers 
} from './ExampleSchemas'

const graphqlServer = new GraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger: new JsonLogger('nodejsCoreServer', 'user-service')
    }
)

const server = http.createServer((request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Array<any> = []
    request.on('error', (error) => {
        console.error(error)
    })
    .on('data', (chunk) => {
        body.push(chunk)
    })
    .on('end', async() => {
        const requestBody = Buffer.concat(body).toString()
        await graphqlServer.handleRequest({
            headers: request.headers,
            url: request.url,
            method: request.method,
            body: requestBody
        }, response)
    })
})

server.listen(7070)
