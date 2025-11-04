// apps/auth-service/src/swagger.js
const swaggerAutogen = require('swagger-autogen');

const doc = {
  info: {
    title: 'Auth Service API',
    version: '1.0.0',
    description: 'API documentation for Auth Service',
  },
  host: 'localhost:6001',
  basePath: '/api',
  schemes: ['http'],
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/routes/auth.router.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);