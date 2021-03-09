const core = require("@actions/core");
const { runFromPRLabels } = require("./lib");

runFromPRLabels().catch((reason) => {
  core.setFailed(reason);
});
