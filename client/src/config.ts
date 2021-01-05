// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'f5bodh2dr8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-la879an3.eu.auth0.com',            // Auth0 domain
  clientId: '5RupkVr50TXRr3Rska2Zt5Pn5Ed3vluO',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
