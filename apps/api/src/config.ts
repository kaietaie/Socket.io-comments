require('dotenv').config();
export const config = {
  REGION:"eu-central-1",
  ACCESSKEYID: "AKIAQ2FNHS7WQG3HPR5D",
  SECRETACCESSKEY: "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",
  SESSIONSECRET: "SECRETS SHOULD KEEPS IN SAFE",
  HOST: "http://localhost",
  PORTCLIENT:5173,
};

// require('dotenv').config();
// export const config = {
//   REGION: process.env.REGION,
//   ACCESSKEYID: process.env.ACCESSKEYID,
//   SECRETACCESSKEY: process.env.SECRETACCESSKEY,
//   SESSIONSECRET: process.env.SESSIONSECRET,
//   HOST: process.env.HOST,
//   PORTCLIENT: process.env.PORTCLIENT,
// };