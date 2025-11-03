const swaggerAutogen = require('swagger-autogen');

const doc = {
  info: {
    title: 'Auth Service API',
    version: '1.0.0',
    description: 'API documentation for Auth Service',
  },
  host: 'localhost:6001',
  schemas: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.router.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
