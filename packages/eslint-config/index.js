module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: { ecmaFeatures: { jsx: true } },
  settings: { react: { version: "detect" } }
};