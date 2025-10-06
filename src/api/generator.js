// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateApi } = require('swagger-typescript-api');

const API_URL = 'http://localhost:4000';
const SWAGGER_SCHEMA_PATH = '/api-docs.json';
const BASE_URL = `${API_URL}${SWAGGER_SCHEMA_PATH}`;
const OUTPUT_DIR = path.join(path.resolve(__dirname, '.', 'generated'));

generateApi({
  output: OUTPUT_DIR,
  url: BASE_URL,
  httpClientType: 'axios',
  generateRouteTypes: true,
  generateResponses: true,
  generateClient: true,
  toJS: false,
  enumNamesAsValues: false,
  singleHttpClient: false,
  generateUnionEnums: false,
  modular: true,
  addReadonly: false,
  sortTypes: false,
  withCredentials: true,
});
