const swaggerAutogen = require('swagger-autogen')();

const output = './swagger.json';
const endpoints = [
    './app.js'
];

swaggerAutogen(output, endpoints);
