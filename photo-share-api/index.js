const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require(`express`)
const { createServer } = require('http')
const { WebSocketServer } = require('ws');
const { makeExecutableSchema } =require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');

const { readFileSync }  = require(`fs`)
const cors = require('cors')
const bodyParser = require('body-parser');

const { MongoClient } = require(`mongodb`)
require(`dotenv`).config()

const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`)
const resolvers = require(`./resolvers`)

async function start() {
    // Creating MongoDB client
    const MONGO_DB = process.env.DB_HOST
    const client = await MongoClient.connect(
        MONGO_DB,
        { useNewUrlParser: true}
    )
    const db = client.db()

    // Authenticate user
    const findUser = (githubToken) => {
        return db.collection(`users`).findOne({ githubToken })
    }

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = express()
    const httpServer = createServer(app);
    const pubsub = new PubSub();

    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/graphql',
    });

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer({
        schema,
        // Adding a context property lets you add data to your GraphQL operation context
        context: async (ctx, msg, args) => {
            // ctx is the graphql-ws Context where connectionParams live
            if (ctx.connectionParams.authentication) {
                const currentUser = await findUser(ctx.connectionParams.authentication);
                return { currentUser, pubsub };
            }
            // Otherwise let our resolvers know we don't have a current user
            return { currentUser: null, pubsub };
        },
    }, wsServer);

    const server = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const currentUser = await findUser(req.headers.authorization)
                return { db, currentUser, pubsub }
            },
        }),
    );

    app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`))

    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000`);
}

start();
