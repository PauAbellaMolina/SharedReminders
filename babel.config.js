module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }],
      ['module-resolver', {
        "alias": {
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@firebaseConfig": "./firebaseConfig.js",
          "@types": "./src/types/types.ts",
          "@styles": "./src/styles",
          "@assets": "./assets",
        },
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ]
      },
    ],
    ]
  };
};
