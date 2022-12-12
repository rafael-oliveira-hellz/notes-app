/* eslint-disable @typescript-eslint/no-var-requires */
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/public/swagger_output.json';
const endpointsFiles = [
  './src/routes/auth.route.ts',
  './src/routes/user.route.ts',
  './src/routes/note.route.ts',
];

const doc = {
  info: {
    version: '1.0.0',
    title: 'NOTES REST API',
    description:
      'Documentation automatically generated by the <b>swagger-autogen</b> module.',
  },
  host: 'localhost:3333/api/v1',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'User',
      description: 'Endpoints',
    },
  ],
  securityDefinitions: {
    user_auth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer abcde12345'.",
    },
  },
  definitions: {
    User: {
      name: 'Jhon Doe',
      age: 29,
      parents: {
        father: 'Simon Doe',
        mother: 'Marie Doe',
      },
      diplomas: [
        {
          school: 'XYZ University',
          year: 2020,
          completed: true,
          internship: {
            hours: 290,
            location: 'XYZ Company',
          },
        },
      ],
    },
    AddUser: {
      $name: 'Jhon Doe',
      $age: 29,
      about: '',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
