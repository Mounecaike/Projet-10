const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    apiUrl: "http://localhost:8081"
  },
  e2e: {
    baseUrl: "http://localhost:8080/#/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

