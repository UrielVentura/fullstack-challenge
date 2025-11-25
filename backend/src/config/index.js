module.exports = {
  port: process.env.PORT || 3000,
  externalApi: {
    baseUrl: "https://echo-serv.tbxnet.com/v1/secret",
    apiKey: "Bearer aSuperSecretKey",
  },
};
