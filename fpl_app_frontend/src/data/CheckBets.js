import getGameweek from "./CurrentGameweek";
const axios = require("axios").default;

// This function will do the following:
// 1. Grab all the bets and put into array
// 2. Filter the array to only be the bets for the current game week and paid = False
// 3. Use the current gameweek to pull fixtures and put into array
// 4. Filter the fixture array for fixtures where finished = True
// 5. Compare both arrays against each other by searching the bet array for fixture IDs coming from the fixture array
// 6. If matches are found we need to compare team_a_score to team_h_score to determine fixture winner/loser
// -- Then check all matching bets for who they picked to win or lose
// -- If they are right in their bet we need to make 2 DB calls:
// ---- PUT edit the wallet to change the total positively
// ---- PUT edit the bet to change paid to TRUE and success to TRUE
// -- If they are wrong in their bet we make 2 DB calls:
// ---- PUT edit the wallet to change the total negatively
// ---- PUT edit the bet to change paid to TRUE and success to FALSE


// maybe only pass in a single Owner FPL ID
// will need to make sure to check all gameweeks and not just current one....
const CheckBets = async (betOwner) => {

    const getAllBets = async (ownerId) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/api/bets/owner/` + ownerId)
        .then((apiResponse) => {
            return apiResponse.data;
        })
    };

    const getFixtureData = async (event) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
        .then((apiResponse) => {
            return apiResponse.data;
        })
    };

    const getWalletValue = async (ownerId) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/api/wallets/owner/` + ownerId)
        .then((apiResponse) => {
            return apiResponse.data.total;
        })
        .catch(err => console.error(err));
    };

    const matchOutcome = async (fixtureId, fixtures) => {
        const oneFixture = fixtures.filter((fixture) => fixture.code === fixtureId);
        const teamHScore = parseInt(oneFixture[0].team_h_score);
        const teamAScore = parseInt(oneFixture[0].team_a_score);

        if (teamHScore > teamAScore) {
            return ({team_h_wins: true, team_a_wins: false});
        } else if (teamAScore > teamHScore) {
            return ({team_h_wins: false, team_a_wins: true});
        } else {
            return ({team_h_wins: false, team_a_wins: false});
        }

    };

    const betStatus = async (bets, fixtureId, fixtures, walletValue) => {
        const {team_h_wins, team_a_wins} = await matchOutcome(fixtureId, fixtures);
        for (var i = 0; i < bets.length; i++) {
            let betTeamHWins = bets[i].team_h_prediction === 'win' ? true : false;
            let betTeamAWins = bets[i].team_a_prediction === 'win' ? true : false;
            let newWalletValue, walletUpdate, betUpdate;

            if (betTeamHWins === true && team_h_wins === true) {
                // bet won
                newWalletValue = walletValue + bets[i].amount;
                walletUpdate = await updateWallet(newWalletValue, bets[i].owner_id);
                
                if (walletUpdate) {
                    betUpdate = await updateBet("win", bets[i]);
                }

            } else if (betTeamAWins === true && team_a_wins === true) {
                // bet won
                newWalletValue = walletValue + bets[i].amount;
                walletUpdate = await updateWallet(newWalletValue, bets[i].owner_id);
                
                if (walletUpdate) {
                    betUpdate = await updateBet("win", bets[i]);
                }

            } else if (betTeamAWins === false && betTeamHWins === false && team_a_wins === false && team_h_wins === false) {
                // bet won
                newWalletValue = walletValue + bets[i].amount;
                walletUpdate = await updateWallet(newWalletValue, bets[i].owner_id);
                
                if (walletUpdate) {
                    betUpdate = await updateBet("win", bets[i]);
                }

            } else {
                // bet lost
                newWalletValue = walletValue - bets[i].amount;
                walletUpdate = await updateWallet(newWalletValue, bets[i].owner_id);
                
                if (walletUpdate) {
                    betUpdate = await updateBet("loss", bets[i]);
                }
            }
        }
    };

    const updateWallet = async (newWalletTotal, owner) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.put(`${currentOrigin}/api/wallets`, {total: newWalletTotal, owner_id: owner})
        .then((apiResponse) => {
            if (apiResponse.status === 200) {
                return true;
            }
        })
        .catch(err => console.error(err));
    };

    const updateBet = async (outcome, bet) => {
        let betData;
        if (outcome === "win") {
            betData = {
                ...bet,
                paid: true,
                success: true
            };
        } else {
            betData = {
                ...bet,
                paid: true
            };
        }

        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.put(`${currentOrigin}/api/bets`, betData)
            .then((apiResponse) => {
                if (apiResponse.status === 200) {
                    return true;
                }
            })
            .catch(err => console.error(err));
    };

    const compareFixturesToBets = async (bets, fixtures, walletValue) => {
        for (var i = 0; i < fixtures.length; i++) {
            let curFixtureId = fixtures[i].code;
            let fixtureBets = bets.filter((bet) => bet.fixture_id === curFixtureId);
            if (fixtureBets.length > 0) {
                await betStatus(fixtureBets, curFixtureId, fixtures, walletValue);
            }
        }
    };

    const getGameweekFromBets = (bets) => {
        const unpaidBets = bets.sort((bet1, bet2) => bet1.gameweek - bet2.gameweek).filter((bet) => bet.paid === false);
        
        if (unpaidBets.length > 0) {
            return unpaidBets[0].gameweek;
        }
        return 0;
    };

    const start = async (betOwner) => {
        const betArray = await getAllBets(betOwner);

        if (betArray.length === 0) {
            return;
        }

        const currentGameweek = getGameweekFromBets(betArray);

        if (currentGameweek === 0) {
            return;
        }

        //const [currentGameweek, gwStatus] = await getGameweek();
        const betsForCurrentGameweek = betArray.filter((bet) => bet.gameweek === currentGameweek).filter((bet) => bet.paid === false);
        const fixturesForCurrentGameweek = await getFixtureData(currentGameweek);
        const finishedFixtures = fixturesForCurrentGameweek.filter((fixture) => fixture.finished === true);
        const ownerWalletValue = await getWalletValue(betOwner);
        await compareFixturesToBets(betsForCurrentGameweek, finishedFixtures, ownerWalletValue);
    };

    start(betOwner);
};

export default CheckBets;