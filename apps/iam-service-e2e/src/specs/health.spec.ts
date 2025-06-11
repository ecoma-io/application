import axios from 'axios';


describe('Health check feature', () => {
  it('should return health status OK', async () => {
    const response = await axios.get('https://iam.fbi.com/health');
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe('up');
  });
});
