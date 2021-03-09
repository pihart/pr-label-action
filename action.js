const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const prNumber = github.context.payload?.pull_request?.number;

if (prNumber == null) {
  console.log("Could not get pull request number from context, exiting");
  return;
}

const token = core.getInput("repo-token", { required: true });

const client = new github.GitHub(token);

const { data: pullRequest } = await client.pulls.get({
  owner: github.context.repo.owner,
  repo: github.context.repo.repo,
  pull_number: prNumber,
});

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
