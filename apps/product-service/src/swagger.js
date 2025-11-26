const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'product Service API',
    version: '1.0.0',
    description: 'API documentation for product Service',
  },
  host: 'localhost:6002',
  basePath: '/api',
  schemes: ['http'],
};

const outputFile = './apps/product-service/src/swagger-output.json';
const endpointsFiles = ['./apps/product-service/src/routes/product.router.ts'];

// Generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
});



