import * as github from '@actions/github';
import * as core from '@actions/core';

async function run(): Promise<void> {
  core.exportVariable("ACTIONS_STEP_DEBUG", true)
  core.setCommandEcho(true)
  core.debug("Debug message")
  core.info("info message")
  core.warning("warn message")
  core.error("error message")
  console.log("Conolse message")
  try {
    const githubToken = core.getInput('github_token');
    const labels = core
      .getInput('labels')
      .split('\n')
      .filter(l => l !== '');

    const [owner, repo] = core.getInput('repo').split('/');
    const number =
      core.getInput('number') === ''
        ? github.context.issue.number
        : parseInt(core.getInput('number'));

    core.info(`Owner: ${owner}`)
    core.info(`Repo: ${repo}`)
    core.info(`Pull Request Number: ${number}`)

    if (labels.length === 0) {
      core.info("⚠️ No labels provided, not doing anything")
      return
    }

    const client = github.getOctokit(githubToken);
    const {data: reviews} = await client.pulls.listReviews({
      owner, repo, pull_number: number
    })

    const statuses = reviews.filter(r => r.state == "APPROVED")

    if (statuses.length == 0) {
      core.info("😔 No approvals yet, not labeling the PR.")
      return
    }

    const {data: { base: { ref: base }}} = await client.pulls.get({
      owner, repo, pull_number: number
    })

    core.info(`Base branch: ${base}`)

    const {data: { required_approving_review_count: requireApprovalCount }} = await client.repos.getPullRequestReviewProtection({
      owner, repo, branch: base
    })

    if (statuses.length < requireApprovalCount) {
      core.info("😔 Not enough approvals to add label yet.")
      return
    }

    core.info("💪 Sufficient number of approvals detected, adding labels")

    await client.issues.addLabels({
      labels: labels,
      owner: owner,
      repo: repo,
      issue_number: number
    })
  } catch (e) {
    core.error(e);
    core.setFailed(e.message)
  }
}

 run();