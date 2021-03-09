const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

/**
 * @param {number} prNumber
 * @param {InstanceType<typeof github.GitHub>} octokit
 * @param {{label: string, run: string}[]} items
 * @return {Promise<void>}
 */
export async function runFromPRLabels({
  prNumber = ((github.context.payload || {}).pull_request || {}).number,
  octokit = github.getOctokit(core.getInput("repo-token", { required: true })),
  items = JSON.parse(core.getInput("items", { required: true })),
} = {}) {
  if (prNumber == null) {
    core.setFailed("Could not get pull request number from context, exiting");
    return;
  }

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
}
