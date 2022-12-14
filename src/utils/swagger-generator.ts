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
  host: 'https://notes-app-mvp.herokuapp.com/api/v1',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'User',
      description: 'Endpoints',
    },
    {
      name: 'Auth',
      description: 'Endpoints',
    },
    {
      name: 'Note',
      description: 'Endpoints',
    },
  ],
  securityDefinitions: {
    user_auth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        "Enter the token with the `Bearer: ` prefix, e.g. 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw'.",
    },
  },
  definitions: {
    User: {
      id: '639407f89236de177775ac8f',
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456789',
      role: 'admin',
      status: 'active',
      profile_picture: 'https://example.com/profile-picture.jpg',
      email_verified_at: '2022-01-01T00:00:00.000Z',
      password_reset_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.FgfcaI6-LIF240aJeryZdOLvTHdRDNIBsK2HjhF7nLOFbS51rkmehmcH3Lf7gwTBUu2_xx1P6S62GUWchArPpA',
      remember_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw',
      provider_id: null,
      provider_name: null,
      lastLoginDate: '2022-11-01T00:00:00.000Z',
      currentLoginDate: '2022-12-12T00:00:00.000Z',
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-11-12T00:00:00.000Z',
    },
    Note: {
      id: '639271037445476efa30e136',
      title: 'Note title',
      subject: 'Note subject',
      content: 'Note content',
      start_date: '2022-10-01T00:00:00.000Z',
      due_date: '2022-10-15T00:00:00.000Z',
      assignee: {
        id: '639407f89236de177775ac8f',
        name: 'John Doe',
        email: 'john@doe.com',
        profile_picture: 'https://example.com/profile-picture.jpg',
      },
      created_at: '2022-01-01T00:00:00.000Z',
      updated_at: '2022-11-12T00:00:00.000Z',
    },
    CreateUser: {
      success: true,
      statusCode: 201,
      message: 'Usuário criado com sucesso!',
      user: {
        id: '639407f89236de177775ac8f',
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456789',
        role: 'user',
        status: 'active',
        profile_picture: 'https://example.com/profile-picture.jpg',
        email_verified_at: null,
        created_at: '2022-01-01T00:00:00.000Z',
        updated_at: '2022-11-12T00:00:00.000Z',
      },
      access_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.FgfcaI6-LIF240aJeryZdOLvTHdRDNIBsK2HjhF7nLOFbS51rkmehmcH3Lf7gwTBUu2_xx1P6S62GUWchArPpA',
    },
    newUser: {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456789',
    },
    OK: {
      success: true,
      statusCode: 200,
      message: 'Requisição realizada com sucesso!',
    },
    BadRequest: {
      success: false,
      statusCode: 400,
      message: 'Requisição inválida!',
    },
    Unauthorized: {
      success: false,
      statusCode: 401,
      message: 'Acesso negado. Você não está autenticado!',
    },
    Forbidden: {
      success: false,
      statusCode: 403,
      message:
        'Acesso negado. Você não tem permissão para acessar este recurso!',
    },
    NotFound: {
      success: false,
      statusCode: 404,
      message: 'Recurso não encontrado!',
    },
    Conflict: {
      success: false,
      statusCode: 409,
      message: 'Já existe um usuário com este e-mail!',
    },
    InternalServerError: {
      success: false,
      statusCode: 500,
      message: 'Erro interno do servidor!',
    },

    UserLogin: {
      email: 'john@doe.com',
      password: '123456',
    },
    UserLoginResponse: {
      success: true,
      statusCode: 200,
      message: 'Usuário logado com sucesso!',
      user: {
        id: '639407f89236de177775ac8f',
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'user',
        status: 'active',
        profile_picture: 'https://example.com/profile-picture.jpg',
        email_verified_at: '2022-01-01T00:00:00.000Z',
        created_at: '2022-01-01T00:00:00.000Z',
        updated_at: '2022-11-12T00:00:00.000Z',
      },
      access_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.FgfcaI6-LIF240aJeryZdOLvTHdRDNIBsK2HjhF7nLOFbS51rkmehmcH3Lf7gwTBUu2_xx1P6S62GUWchArPpA',
      refresh_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw',
    },
    RefreshToken: {
      Authorization:
        'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw',
    },
    RefreshTokenResponse: {
      success: true,
      statusCode: 200,
      message: 'Token de acesso atualizado com sucesso',
      access_token:
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw',
    },
    VerifyUser: {
      Authorization:
        'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOTQwN2Y4OTIzNmRlMTc3Nzc1YWM4ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MDg4MDMwMSwiZXhwIjoxNjcwOTY2NzAxfQ.xi8Hy6d6IXWKdVdsMH7iU32bEK5jHqOvqMG-ofsD6VcFcHUK49XJJ-NJpOTpfdjomwWebL_GWczdB21segdQnw',
    },
    VerifyUserResponse: {
      success: true,
      statusCode: 200,
      message: 'Usuário autenticado com sucesso!',
      user: {
        id: '639407f89236de177775ac8f',
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'user',
        status: 'active',
        profile_picture: 'https://example.com/profile-picture.jpg',
        email_verified_at: '2022-01-01T00:00:00.000Z',
        created_at: '2022-01-01T00:00:00.000Z',
        updated_at: '2022-11-12T00:00:00.000Z',
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
