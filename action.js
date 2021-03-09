const core = require("@actions/core");
import { runFromPRLabels } from "./lib";

runFromPRLabels().catch((reason) => {
  core.setFailed(reason);
});
