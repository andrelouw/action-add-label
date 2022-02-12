import * as github from '@actions/github';
import * as core from '@actions/core';
import { error } from '@actions/core';

async function run(): Promise<void> {
  core.debug("Hello")

  try {
    const githubToken = core.getInput('github_token');
    core.debug(githubToken)

    const labels = core
      .getInput('labels')
      .split('\n')
      .filter(l => l !== '');
    core.debug(labels.toString())

    const [owner, repo] = core.getInput('repo').split('/');
    core.debug(owner)
    core.debug(repo)
    const number =
      core.getInput('number') === ''
        ? github.context.issue.number
        : parseInt(core.getInput('number'));

    if (labels.length === 0) {
      core.debug("⚠️ No labels provided, not doing anything")
      return
    }

    core.debug(number.toString( ))
    const client = github.getOctokit(githubToken);
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