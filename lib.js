const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

/**
 * @param {number} prNumber
 * @param {InstanceType<typeof github.GitHub>} octokit
 * @param {{label: string, run: string}[]} items
 * @param {string} prefix
 * @param {"false" | "true"} caseSensitive
 * @return {Promise<void>}
 */
async function runFromPRLabels({
  prNumber = ((github.context.payload || {}).pull_request || {}).number,
  octokit = github.getOctokit(core.getInput("repo-token", { required: true })),
  items = JSON.parse(core.getInput("items", { required: true })),
  prefix = core.getInput("prefix") || "",
  caseSensitive = core.getInput("case-sensitive"),
} = {}) {
  if (prNumber == null) {
    core.setFailed("Could not get pull request number from context, exiting");
    return;
  }

  const caseTransform = (str) => (caseSensitive ? str : str.toLowerCase());

  // Labels on the PR itself
  const {
    data: { labels },
  } = await octokit.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber,
  });

  // Label names on the PR
  const prLabels = labels.map((label) => label.name).map(caseTransform);

  // Preserve order of items defined in config
  for (const { label, run } of items) {
    if (!prLabels.includes(caseTransform(label))) continue;

    core.info(`Running ${run} for label ${label}`);
    core.info(execSync(`${prefix ? `${prefix} ` : ""}${run}`).toString());
  }
}

module.exports = { runFromPRLabels };
