const server = require('./');

server({
  get: params => {
    console.log(params);
    return params;
  },
  port: 8888
});
