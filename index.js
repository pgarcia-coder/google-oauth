const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');

const signJWT = (serviceAccount) => {
  const date = parseInt((Date.now() / 1000).toString(), 10);
  const token = {
    iss: serviceAccount.client_email,
    aud: 'https://www.googleapis.com/oauth2/v4/token',
    scope: 'email',
    iat: date,
    exp: date + 10 * 60,
  };

  return jwt.sign(token, serviceAccount.private_key, { algorithm: 'RS256' });
};

const requestAccessToken = async (token) => {
  const rsp = await axios.post(
    'https://www.googleapis.com/oauth2/v4/token',
    {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token.concat('$'),
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  return rsp.data.access_token;
};


const createJWT = async () => {
    try {
        const token = await requestAccessToken(signJWT(JSON.parse(fs.readFileSync('./serviceAccount.json'))));
        console.log(token);
    } catch (err) {
        console.log(err)
    }
}

createJWT();