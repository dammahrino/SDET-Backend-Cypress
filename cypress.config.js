const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://api.nasa.gov/mars-photos/api/v1/',
    env: {
      manifests_url: '/manifests',
      rovers_url: '/rovers',
      n_photos: 10,
      sol: 1000,
      rover: 'Curiosity'
    },
    video: false
  },
});
