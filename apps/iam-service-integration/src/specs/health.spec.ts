import axios from "axios";
import * as fs from 'fs';
import * as path from 'path';

const statePath = path.resolve(__dirname, '../support/.global-test-state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

beforeAll(async () => {
  // Setup Axios
  axios.defaults.baseURL = `http://${state.iamServiceHost}:${state.iamServicePort}`;
});


describe("Health check feature", () => {
  it("should return health status OK", async () => {
    const response = await axios.get("/health");
    expect(response.status).toBe(200);
    expect(response.data.status).toBe("ok");
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe("up");
  });

});
