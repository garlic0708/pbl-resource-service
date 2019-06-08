import config from "./graphql";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {getResource} from "./s3/s3";
import http from 'http';

const PORT = process.env['PORT'] || 4000;
const app = express();

app.get('/resource/:project/:fileName*', async (req, res) => {
    // todo authentication here
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const {project, fileName, 0: rest} = req.params;
    const stream = await getResource(project, `${fileName}${rest}`);
    stream.pipe(res)
});

const server = new ApolloServer({
    ...config,
});
server.applyMiddleware({app});

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
});
