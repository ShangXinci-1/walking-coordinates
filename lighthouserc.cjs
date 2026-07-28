module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run preview",
      startServerReadyPattern: "Static preview:",
      url: [
        "http://127.0.0.1:4173/walking-coordinates/",
        "http://127.0.0.1:4173/walking-coordinates/journey",
        "http://127.0.0.1:4173/walking-coordinates/outcomes",
        "http://127.0.0.1:4173/walking-coordinates/legacy",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--headless=new --no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 1 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "lighthouse-results",
    },
  },
};
