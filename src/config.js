const isProd = process.env['stage'] === 'PROD';
export const mongoUrl = `mongodb://${isProd ? 'mongo' : 'localhost'}:27017/pbl`;
export const redisUrl = isProd ? 'redis' : 'localhost';
export const accessKeyId = process.env['AWS_ACCESS_KEY_ID'];
export const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'];
export const bucketName = 'pbl-resource';
export const domain = `http://localhost:${process.env['PORT'] || 4000}`;
