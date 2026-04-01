
// To get a game started, Patrick will remove themself
// from the following list and add in the real players
// for the game.
let players = [{ login: "nklein", name: "Patrick Stein", },];

export function relevant_player_login(login) {
  return players.find((p) => p.login === login);
}

export function relevant_player_count() {
  return players.length;
}
