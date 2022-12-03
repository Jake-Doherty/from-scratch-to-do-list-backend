const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it.only('POST /api/v1/todos should create a new todo in the db', async () => {
    const [agent, user] = await registerAndLogin();

    const testTodo = {
      userId: user.id,
      detail: 'I really need to do this',
    };

    const resp = await agent.post('/api/v1/todos').send(testTodo);

    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "detail": "I really need to do this",
        "id": "1",
        "user_id": "1",
      }
    `);
  });

  afterAll(() => {
    pool.end();
  });
});
