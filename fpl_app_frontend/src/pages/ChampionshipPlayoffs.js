import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Playoffs from "../components/ChampionshipPlayoffs";

const ChampionshipPlayoffs = () => {
  return (
    <div>
      <Playoffs
        league_id={JSON.parse(localStorage.getItem("current_league"))}
      />
    </div>
  );
};

export default ChampionshipPlayoffs;
