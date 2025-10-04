"use strict";

const noCnObjectArg = require("./rules/no-cn-object-arg");

module.exports = {
  rules: {
    "no-cn-object-arg": noCnObjectArg,
  },
  configs: {
    recommended: {
      rules: {
        "anukit/no-cn-object-arg": "error",
      },
    },
  },
};
