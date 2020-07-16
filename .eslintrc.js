module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  extends: [
    "airbnb-typescript",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "no-useless-escape",
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'no-nested-ternary': 'off',
    'no-console': 'off',
    'jsx-a11y/click-events-have-key-events': 'off'
  },
};
