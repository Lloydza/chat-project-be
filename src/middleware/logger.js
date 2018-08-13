// Logs all http requests

const logger = async (ctx, next) => {
  console.log(new Date(), ctx.method, ctx.url);
  await next();
};

module.exports = logger;
