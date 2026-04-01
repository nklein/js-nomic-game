import {
  relevant_player_login,
} from "./players.js"

import {
  safe_seq
} from "./json_utils.js"

import {
  accept_decision,
  reject_decision,
  defer_decision,
} from "./decision.js";

import {
  tally_votes_on_pr_head_for_relevant_users,
  tally_accepts_proportion_of_voters,
  tally_rejects_proportion_of_voters,
} from "./vote-count.js";

function compare_augmented_pull_requests_by_updated_at(a, b) {
  return new Date(a.pull_request.updated_at).valueOf() - new Date(b.pull_request.updated_at).valueOf();
}

function sort_list_of_agumented_by_pull_request_updated_at(list_of_augmented) {
  return list_of_augmented.sort(compare_augmented_pull_requests_by_updated_at);
}

function find_reject(found, augmented) {
  return found
    ?? (function () {
      return (relevant_player_login(augmented.pull_request.user.login)
              ? null
              : new reject_decision(augmented.id,
                                    `Will not accept pull-request from user <${augmented.pull_request.user?.login}>`));
    })()
    ?? (function () {
      let proportion = tally_rejects_proportion_of_voters(tally_votes_on_pr_head_for_relevant_users(augmented));
      return (1/2 <= proportion)
        ? new reject_decision(augmented.id, `More than half (${proportion}) of the eligible voters rejected`)
        : null;
    })();
}

function find_accept(found, augmented) {
  return found
    ?? (function () {
      let proportion = tally_accepts_proportion_of_voters(tally_votes_on_pr_head_for_relevant_users(augmented));
      return (1/2 <= proportion)
        ? new accept_decision(augmented.id, `More than half (${proportion}) of the eligible voters accepted`)
        : null;
    })();
}

export function decide(list_of_augmented) {
  let sorted_list = sort_list_of_agumented_by_pull_request_updated_at([...safe_seq(list_of_augmented)]);

  return sorted_list.reduce(find_reject, null)
    ?? sorted_list.reduce(find_accept, null)
    ?? new defer_decision();
}
