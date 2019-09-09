module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ["react", "@typescript-eslint", "prettier"],
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  }
};
