import axios from 'axios';

beforeAll(async () => {
  // Setup Axios
  axios.defaults.baseURL = `https://iam.fbi.com`;
});

describe('Health check feature', () => {
  it('should return health status OK', async () => {
    const response = await axios.get('/health');
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe('up');
  });
});
