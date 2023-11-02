require('dotenv').config();
export const config = {
  REGION: process.env.REGION,
  ACCESSKEYID: process.env.ACCESSKEYID,
  SECRETACCESSKEY: process.env.SECRETACCESSKEY,
  SESSIONSECRET: process.env.SESSIONSECRET,
  HOST: process.env.HOST,
  PORTCLIENT: process.env.PORTCLIENT,
};
