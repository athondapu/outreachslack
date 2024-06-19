const fs = require("fs");
const path = require("path");

const middlewaresPath = path.join(__dirname);

const registerMiddlewares = (app) => {
  fs.readdirSync(middlewaresPath).forEach((file) => {
    if (path.extname(file) === ".js") {
      const middleware = require(path.join(middlewaresPath, file));
      console.log("middleware: ", middleware);
      if (typeof middleware !== 'function') {
        console.error(`Middleware ${middlewaresPath} does not export a function`);
      } else {
        app.use(middleware);
      }
    }
  });
};

module.exports.registerMiddlewares = (app) => {
  registerMiddlewares(app);
};
