module.exports = {
  default: `--require-module ts-node/register --require tests/steps/**/*.ts --format @cucumber/pretty-formatter tests/features/**/*.feature`
};
