module.exports = {
  presets: ["babel-preset-expo", "nativewind/babel"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
  ],
};
