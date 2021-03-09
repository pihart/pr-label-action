const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const token = core.getInput("repo-token", { required: true });

const client = github.getOctokit(token);

/**
 * @type {{label: string, run: string}[]}
 */
const items = JSON.parse(core.getInput("items", { required: true }));

(async () => {
  const prLabels = (await client.issues.listLabelsOnIssue()).data.map(
    (label) => label.name
  );
  for (const { label, run } of items) {
    if (!prLabels.data.includes(label)) continue;

    execSync(run);
  }
})();
