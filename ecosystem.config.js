module.exports = {
  apps: [
    {
      name: "Yaqeen-API",
      script: "./dist/app.js",
      env: {
        NODE_ENV: "production",
      },
      env_test: {
        NODE_ENV: "production",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
