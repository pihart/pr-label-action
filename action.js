const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const token = core.getInput("repo-token", { required: true });

const client = new github.GitHub(token);

/**
 * @type {{label: string, run: string}[]}
 */
const items = JSON.parse(core.getInput("items", { required: true }));

/**
 * @type {string[]}
 */
const prLabels = await client.issues.listLabelsOnIssue();

for (const { label, run } of items) {
  if (!prLabels.includes(label)) continue;

  execSync(run);
}
