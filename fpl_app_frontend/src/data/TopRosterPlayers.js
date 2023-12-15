// this file is grabbing the top X scoring players on an owner's roster
import SinglePlayer from "./SinglePlayerData";

const topPlayers = (league_entry, num) => {
  let playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
  let topPlayerArray = [];
  let ownerRoster = playerOwnership.filter(
    (player) => player.owner === league_entry
  );

  for (var i = 0; i < ownerRoster.length; i++) {
    let playerData = SinglePlayer(ownerRoster[i].element);
    topPlayerArray.push(playerData);
  }

  topPlayerArray.sort(
    (playerA, playerB) => playerB.total_points - playerA.total_points
  );

  return topPlayerArray.slice(0, num);
};

export default topPlayers;
