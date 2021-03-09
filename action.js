const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const prNumber = ((github.context.payload || {}).pull_request || {}).number;

if (prNumber == null) {
  console.log("Could not get pull request number from context, exiting");
  return;
}

const token = core.getInput("repo-token", { required: true });

const octokit = github.getOctokit(token);

/**
 * @type {{label: string, run: string}[]}
 */
const items = JSON.parse(core.getInput("items", { required: true }));

(async () => {
  const {
    data: { labels },
  } = await octokit.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber,
  });

  const prLabels = labels.map((label) => label.name);
  for (const { label, run } of items) {
    if (!prLabels.includes(label)) continue;

    core.info(`Running ${run} for label ${label}`);
    core.info(execSync(run).toString());
  }
})();
