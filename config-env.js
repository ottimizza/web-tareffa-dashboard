const fs = require('fs');
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

function getEnvironmentVariable(key, _default = '') {
  return process.env[key] || _default;
}

function createEnvironementFile() {
  return `export const environment = {
  production: true,
  dashboardApi: '${getEnvironmentVariable('DASHBOARD_API')}',
  oauthBaseUrl: '${getEnvironmentVariable('API_OAUTH2_SERVICE')}',
  oauthClientId: '${getEnvironmentVariable('OAUTH2_CLIENT_ID')}',
  serviceUrl: '${getEnvironmentVariable('SERVICE_URL')}',
  serviceGetUrl: '${getEnvironmentVariable('SERVICE_GET_URL')}',
  storageBaseUrl: '${getEnvironmentVariable('STORAGE_BASE_URL')}',
  applicationId: '${getEnvironmentVariable('APPLICATION_ID', 'tareffa')}',
  apiTareffaSpring: '${getEnvironmentVariable('API_TAREFFA_SPRING')}',
  firebase: {
    apiKey: '${getEnvironmentVariable('FIREBASE_API_KEY')}',
    authDomain: '${getEnvironmentVariable('FIREBASE_AUTH_DOMAIN')}',
    databaseUrl: '${getEnvironmentVariable('FIREBASE_DATA_URL')}',
    projectId: '${getEnvironmentVariable('FIREBASE_PROJECT_ID')}',
    storageBucket: '${getEnvironmentVariable('FIREBASE_STORAGE_BUCKET')}',
    messagingSenderId: '${getEnvironmentVariable('FIREBASE_MESSAGING_SENDER_ID')}',
    appId: '${getEnvironmentVariable('FIREBASE_API_ID')}',
    measurementId: '${getEnvironmentVariable('FIREBASE_MEASUREMENT_ID')}'
  }
};
`;
}

const environment = getEnvironmentVariable('ENVIRONMENT');
const environmentFile = createEnvironementFile();

console.log(`
  ENVIRONMENT -> ${environment}
  ---
  ${environmentFile}
`);

fs.writeFile(`./src/environments/environment.prod.ts`, environmentFile, err => {
  if (err) {
    console.log(err);
  }
});
