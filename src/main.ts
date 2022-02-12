import * as github from '@actions/github';
import * as core from '@actions/core';

async function run(): Promise<void> {
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

    if (labels.length === 0) {
      core.debug("⚠️ No labels provided, not doing anything")
      return
    }

    const client = github.getOctokit(githubToken);

    const {data: reviews} = await client.pulls.listReviews({
      owner, repo, pull_number: number
    })

    const statuses = reviews.filter(r => r.state == "APPROVED")

    const base = core.getInput('base_branch')

    const {data: { required_approving_review_count: requireApprovalCount }} = await client.repos.getPullRequestReviewProtection({
      owner, repo, branch: base
    })

    if (statuses.length < requireApprovalCount) {
      core.debug("😔 Not enough approvals to add label yet.")
      return
    }

    core.debug("💪 Sufficient number of approvals detected, adding labels")

    await client.issues.addLabels({
      labels: labels,
      owner: owner,
      repo: repo,
      issue_number: number
    })

   //  const {data: rev} = await client.pulls.listRequestedReviewers({
   //    owner, repo, pull_number: number
   //  })
   // rev.users.forEach(function(value) {
   //
   //
   // })
   //
   //
   //  const {data: r} = await client.pulls.get({
   //    owner, repo, pull_number: number
   //  })


    // const {data: revi} = await client.repos.getPullRequestReviewProtection({
    //   owner, repo, branch: 'develop'
    // })
    // core.debug(revi.required_approving_review_count.toString())
    // // revi.contexts.forEach(function(value) {
    // //   core.debug(value)
    // // })
    //
    // // type Pull = GetResponseDataTypeFromEndpointMethod<typeof client.pulls.get >
    // reviews.forEach(function(value) {
    //   core.debug(value.state.toString())
    // })
    // core.debug(r.state)
    // core.debug(r.mergeable_state)
    // r.requested_reviewers.forEach(function(reviewer) {
    //   core.debug(reviewer.)
    // })
    // core.debug(r.)
    // await client.issues.addLabels({
    //   labels: labels,
    //   owner: owner,
    //   repo: repo,
    //   issue_number: number
    // })

    // const { data: { head: { sha: commit_sha } } } = await client.request('GET /repos/:owner/:repo/pulls/:pull_number', {
    //   owner,
    //   repo,
    //   pull_number: number
    // })
    //
    // // https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
    // const { data: { state: commitStatusState } } = await client.request('GET /repos/:owner/:repo/commits/:commit_sha/status', {
    //   owner,
    //   repo,
    //   commit_sha
    // })
    // core.debug(commitStatusState)
    //
    // // https://developer.github.com/v3/checks/runs/#list-check-runs-for-a-specific-ref
    //
    // const { data: con } = await  client.checks.listForRef({
    //   owner,
    //   repo,
    //   ref: commit_sha
    // })
    // // core.debug(con.check_runs)
    // // const { data: con } = await  client.checks.listForRef({
    // //   owner,
    // //   repo,
    // //   commit_sha
    // // })
    // con.check_runs.forEach(function(value) {
    //
    //   core.debug(value.name)
    //
    // })
    // // core.debug(con)
    // // const conclusions = await paginateRest('GET /repos/:owner/:repo/commits/:ref/check-runs', {
    // //   owner,
    // //   repo,
    // //   commit_sha
    // // }, (response) => response.data.conclusion)



  } catch (e) {
    core.error(e);
    core.setFailed(e.message)
  }
}
 run();
//
import { request } from '@octokit/request'
import { paginateRest } from '@octokit/plugin-paginate-rest'
//
// async function getCombinedSuccess(octokit, { owner, repo, pull_number}) {
//   // https://developer.github.com/v3/pulls/#get-a-single-pull-request
//   const { data: { head: { sha: commit_sha } } } = await octokit.request('GET /repos/:owner/:repo/pulls/:pull_number', {
//     owner,
//     repo,
//     pull_number
//   })
//
//   // https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
//   const { data: { state: commitStatusState } } = request('GET /repos/:owner/:repo/commits/:commit_sha/status', {
//     owner,
//     repo,
//     commit_sha
//   })
//
//   // https://developer.github.com/v3/checks/runs/#list-check-runs-for-a-specific-ref
//   const conclusions = await octokit.paginate('GET /repos/:owner/:repo/commits/:ref/check-runs', {
//     owner,
//     repo,
//     commit_sha
//   }, (response) => response.data.conclusion)
//
//   // const allChecksSuccess = conclusions => conclusions.every(conclusion => conclusion === success)
//
//   // return commitStatusState === 'success' && allChecksSuccess
// }