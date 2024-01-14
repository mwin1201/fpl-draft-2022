// purpose of file is to return specific player data object

const SinglePlayer = (player_id) => {
  let players = JSON.parse(localStorage.getItem("elements"));
  let singlePlayer = players.filter((player) => player.id === player_id);
  let playerObj = singlePlayer[0];
  return playerObj;
};

export default SinglePlayer;
