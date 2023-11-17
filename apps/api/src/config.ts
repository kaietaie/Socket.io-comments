require('dotenv').config();
// export const config = {
//   REGION:"eu-central-1",
//   ACCESSKEYID: "AKIAQ2FNHS7WQG3HPR5D",
//   SECRETACCESSKEY: "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",
//   SESSIONSECRET: "SECRETS SHOULD KEEPS IN SAFE",
//   HOST: "http://localhost",
//   PORTCLIENT:5173,
// };

export const config = {
  REGION: process.env.AWS_REGION,
  ACCESSKEYID: process.env.AWS_ACCESS_KEY_ID,
  SECRETACCESSKEY: process.env.AWS_SECRET_ACCESS_KEY,
  SESSIONSECRET: process.env.SESSIONSECRET,
  HOST: process.env.HOST,
  PORTCLIENT: process.env.PORTCLIENT,
};