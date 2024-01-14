// this file is grabbing the other ID value for owners to make lookups easier

const OwnerID = (owner_id) => {
  let leagueOwners = JSON.parse(localStorage.getItem("league_entries"));
  let owner = leagueOwners.filter((owner) => owner.id === owner_id);

  return owner[0].entry_id;
};

export default OwnerID;
