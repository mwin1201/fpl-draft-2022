// purpose of file is to return the specific player position

const PlayerPosition = (position_id) => {
  let playerPositions = JSON.parse(localStorage.getItem("element_types"));
  let elementType = playerPositions.filter((pos) => pos.id === position_id);
  let elementObj = elementType[0];
  return elementObj.singular_name_short;
};

export default PlayerPosition;
