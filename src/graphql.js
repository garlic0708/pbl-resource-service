import {gql} from 'apollo-server'
import {uploadResource, listResources, createFolder} from "./s3/s3";
import {domain} from "./config";

const typeDefs = gql`
    type Resource {
        project: ID!
        fileName: String!
        url: String
    }

    type Query {
        listResources(project: ID!): [Resource!]!
    }

    type Mutation {
        uploadResource(project: ID!, fileName: String!, content: Upload!): Resource!
        createFolder(project: ID!, path: String!): String!
    }
`;

// noinspection JSUnusedGlobalSymbols
const resolvers = {
    Resource: {
        url: ({project, fileName}) => {
            if (!fileName.endsWith('/'))
                return `${domain}/resource/${project}/${fileName}`
        }
    },
    Query: {
        listResources: async (root, {project}) => {
            return listResources(project)
        }
    },
    Mutation: {
        uploadResource: async (root, {project, fileName, content}) => {
            const awaitContent = await content;
            console.log(awaitContent);
            await uploadResource(project, fileName, awaitContent.createReadStream());
            return {project, fileName}
        },
        createFolder: async (root, {project, path}) => {
            await createFolder(project, path);
            return path
        }
    }
};

export default {
    typeDefs,
    resolvers,
}
