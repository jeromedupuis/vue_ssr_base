'use strict'
module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: "production",
  JWT_SECRET_TOKEN: "9cdbf24943b760388b42cef77f613c7b94f9774b",
  MONGO_URI: "mongodb://"+process.env.MONGO_URI+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DB,
  FORCE_AUTH: false
}
