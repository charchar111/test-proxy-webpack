const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = () => {
  return new ModuleFederationPlugin({
    runtime: "my-runtime-name",
    shared: {
      ...deps,
      react: {
        singleton: true,
        requiredVersion: deps.react,
      },
      "react-dom": {
        singleton: true,
        requiredVersion: deps["react-dom"],
      },
      "react-router-dom": {
        singleton: true,
        requiredVersion: deps["react-router-dom"],
      },
    },
  });
};
