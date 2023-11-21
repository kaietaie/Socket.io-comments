require('dotenv').config();

export const config = {
  REGION: process.env.AWS_REGION,
  ACCESSKEYID: process.env.AWS_ACCESS_KEY_ID,
  SECRETACCESSKEY: process.env.AWS_SECRET_ACCESS_KEY,
  SESSIONSECRET: process.env.SESSIONSECRET,
  HOST: process.env?.HOST,
  PORT:process.env?.PORT || 3000,
  PORTCLIENT: process.env.PORTCLIENT,
}; 