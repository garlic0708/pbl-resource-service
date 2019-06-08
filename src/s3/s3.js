import knox from 'knox'
import {accessKeyId, secretAccessKey, bucketName} from "../config";
import {promisify} from 'util'
import streamLength from 'stream-length'
import tempWrite from 'temp-write'
import {createReadStream, unlink} from 'fs'

let client;

function getClient() {
    if (!client)
        client = knox.createClient({
            key: accessKeyId,
            secret: secretAccessKey,
            bucket: bucketName,
        });
    return client
}

export async function getResource(project, fileName) {
    console.log('getting resource', project, fileName);
    const client = getClient();
    return promisify(client.getFile).bind(client)(`/${project}/${fileName}`)
}

export async function listResources(project) {
    const client = getClient();
    return promisify(client.list).bind(client)({prefix: project})
        .then(({Contents}) => Contents
            .filter(content => content.Key !== `${project}/`)
            .map(content =>
                ({
                    project,
                    fileName: content.Key.split(/\/(.+)/)[1],
                })
            ))
}

export async function uploadResource(project, fileName, stream) {
    const client = getClient();
    try {
        const tempFilePath = await tempWrite(stream);
        stream = createReadStream(tempFilePath);
        const length = await streamLength(stream);
        await promisify(client.putStream).bind(client)(stream, `/${project}/${fileName}`, {
            'Content-Length': length,
        });
        return promisify(unlink)(tempFilePath)
    } catch (e) {
        console.error(e)
    }
}

export async function createFolder(project, path) {
    const client = getClient();
    const buffer = Buffer.from('');
    return promisify(client.putBuffer).bind(client)(buffer, `/${project}/${path}/`, {
        'Content-Length': 0,
    })
}
