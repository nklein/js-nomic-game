import {
  relevant_player_login,
  relevant_player_count,
} from "./players.js"

import {
  safe_seq
} from "./json_utils.js"

let ACCEPT = "ACCEPT";
let REJECT = "REJECT";

function compare_reviews_by_submitted_at(a, b) {
  return new Date(a.submitted_at).valueOf() - new Date(b.submitted_at).valueOf();
}

function sort_reviews_by_summitted_at(list_of_reviews) {
  return [...list_of_reviews].sort(compare_reviews_by_submitted_at);
}

function collect_votes_on_pr_head(augmented) {
  let head_sha = augmented.pull_request.head.sha;
  let most_recent_vote_by_user = {};

  for (let review of sort_reviews_by_summitted_at([...safe_seq(augmented.reviews)])) {
    if (review.commit_id === head_sha) {
      let vote = [ACCEPT, REJECT].find((v) => v === review.body);
      if (vote) {
        most_recent_vote_by_user[review.user.login] = vote;
      }
    }
  }

  return most_recent_vote_by_user;
}

export function tally_votes_on_pr_head_for_relevant_users (augmented) {
  let accepts = 0;
  let rejects = 0;
  let voters = relevant_player_count();

  let all_votes = collect_votes_on_pr_head(augmented);

  for (let user in all_votes) {
    if (relevant_player_login(user)) {
      let vote = all_votes[user];
      if (vote === ACCEPT) {
        ++accepts;
      } else if (vote === REJECT) {
        ++rejects;
      }
    }
  }

  return {
    accepts, rejects, voters,
  };
}

export function tally_accepts_proportion_of_voters(tally) {
  return tally.accepts / tally.voters;
}

export function tally_rejects_proportion_of_voters(tally) {
  return tally.rejects / tally.voters;
}
