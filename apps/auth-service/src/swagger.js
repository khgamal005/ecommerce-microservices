const swaggerAutogen = require('swagger-autogen')();

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

const outputFile = './apps/auth-service/src/swagger-output.json';
const endpointsFiles = ['./apps/auth-service/src/routes/auth.router.ts'];

// Generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
});