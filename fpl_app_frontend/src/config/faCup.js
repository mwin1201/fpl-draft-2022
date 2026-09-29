// FA Cup: a knockout tournament across all three leagues. Each round is decided
// by the starting-11 score in a single gameweek.
//
// Round 1: Championship vs League One. Round 2: Premiership vs Round 1 winners.
// The 10 Round 2 winners are then seeded 1-10 by their Round 2 score (see
// SEEDING_ROUND). Seeds 1-6 go straight to the quarterfinals and seeds 7-10
// play in a play-in round for the last 2 quarterfinal spots.
// A slot with `entryId: null` is shown as "TBD".

export const ROUNDS = [
  { key: "r1", name: "Round 1", gameweek: 10 },
  { key: "r2", name: "Round 2", gameweek: 14 },
  { key: "pi", name: "Play-in", gameweek: 16 },
  { key: "qf", name: "Quarterfinal", gameweek: 18 },
  { key: "sf", name: "Semifinal", gameweek: 22 },
  { key: "final", name: "Final", gameweek: 26 },
];

// FPL Draft entry id -> team info.
export const TEAMS = {
  // Premiership
  46498: { name: "Goodbye Arne", manager: "Max Winter", league: "Premiership" },
  46821: { name: "Ted\u2019s Heroes", manager: "Teddy Eley", league: "Premiership" },
  47447: { name: "TakeOffPants&Jacquet", manager: "Matt Chiswell", league: "Premiership" },
  48257: { name: "Ryan's Reds", manager: "Ryan Baer", league: "Premiership" },
  48882: { name: "Wirtz Case Scenario", manager: "Nicholas Zantal", league: "Premiership" },
  67538: { name: "Pete\u2019s Pistolas", manager: "Pete Passalino", league: "Premiership" },
  123052: { name: "Sesk Addict", manager: "Max Jones", league: "Premiership" },
  178552: { name: "Mbeumboclaat", manager: "Jake Bruce", league: "Premiership" },
  192422: { name: "Raya's Rioters", manager: "Patrick Kelliher", league: "Premiership" },
  219199: { name: "Wile E. Kayodes", manager: "Phil Rich", league: "Premiership" },
  // Championship
  28185: { name: "CT Boy", manager: "Eli L", league: "Championship" },
  30407: { name: "Gottleib County", manager: "Caleb Flack", league: "Championship" },
  49510: { name: "Huge Iraolas", manager: "Patrick McClanahan", league: "Championship" },
  117595: { name: "Right in the Saka", manager: "Matt Ross", league: "Championship" },
  117667: { name: "Pepperoni", manager: "Johnny M", league: "Championship" },
  122939: { name: "Tomas Rigo\u2019s on Fire", manager: "Derek Grammer", league: "Championship" },
  143187: { name: "Kroupi Diaper", manager: "Ryan Hilbert", league: "Championship" },
  174293: { name: "Mandalorian & Dorgu", manager: "Benjamin Yacavone", league: "Championship" },
  246949: { name: "12 Angry Pickles", manager: "ivy parfy", league: "Championship" },
  247866: { name: "The Big Tarkowski", manager: "Colin V", league: "Championship" },
  // League One
  131866: { name: "Whampton Ponderers", manager: "Noah Wolff", league: "League One" },
  132310: { name: "Pwalsh25", manager: "Patrick Walsh", league: "League One" },
  132916: { name: "Team JVG", manager: "Jesse Van Genugten", league: "League One" },
  132991: { name: "Soccerboy 3000", manager: "Ross Combs", league: "League One" },
  149352: { name: "KC-ONU-goal-HA", manager: "KC Onuoha", league: "League One" },
  149564: { name: "CHANGE NAME", manager: "Chris Conn", league: "League One" },
  246912: { name: "Beer City United", manager: "Chris Robie", league: "League One" },
  249261: { name: "Addicted to Enzos", manager: "Alka Rosenior", league: "League One" },
  266858: { name: "Harshie-ball", manager: "Harshie S", league: "League One" },
  268031: { name: "CF Gogi", manager: "colan biemer", league: "League One" },
};

// Winners of this round are ranked by points, then goals, then fewest cards to
// produce the `{ seed: n }` slots below.
export const SEEDING_ROUND = "r2";

// A slot is a fixed team `{ entryId }`, the winner of an earlier matchup
// `{ winnerOf: "<matchup id>" }`, or a seed from SEEDING_ROUND `{ seed: n }`.
// Only `entryId` is used to look up a team; names come from TEAMS.
export const MATCHUPS = [
  // Round 1 (GW 10): Championship vs League One, 10 matchups
  { id: "r1-1", round: "r1", home: { entryId: 28185, name: "CT Boy", manager: "Eli L"  }, away: { entryId: 174293, name: "Mandalorian & Dorgu", manager: "Benjamin Yacavone" } },
  { id: "r1-2", round: "r1", home: { entryId: 249261, name: "Addicted to Enzos", manager: "Alka Rosenior" }, away: { entryId: 149352, name: "KC-ONU-goal-HA", manager: "KC Onuoha" } },
  { id: "r1-3", round: "r1", home: { entryId: 246912, name: "Beer City United", manager: "Chris Robie" }, away: { entryId: 117595, name: "Right in the Saka", manager: "Matt Ross" } },
  { id: "r1-4", round: "r1", home: { entryId: 246949, name: "12 Angry Pickles", manager: "ivy parfy" }, away: { entryId: 117667, name: "Pepperoni", manager: "Johnny M" } },
  { id: "r1-5", round: "r1", home: { entryId: 132991, name: "Soccerboy 3000", manager: "Ross Combs" }, away: { entryId: 149564, name: "CHANGE NAME", manager: "Chris Conn" } },
  { id: "r1-6", round: "r1", home: { entryId: 247866, name: "The Big Tarkowski", manager: "Colin V" }, away: { entryId: 266858, name: "Harshie-ball", manager: "Harshie S" } },
  { id: "r1-7", round: "r1", home: { entryId: 122939, name: "Tomas Rigo\u2019s on Fire", manager: "Derek Grammer" }, away: { entryId: 132916, name: "Team JVG", manager: "Jesse Van Genugten" } },
  { id: "r1-8", round: "r1", home: { entryId: 30407, name: "Gottleib County", manager: "Caleb Flack" }, away: { entryId: 49510, name: "Huge Iraolas", manager: "Patrick McClanahan" } },
  { id: "r1-9", round: "r1", home: { entryId: 268031, name: "CF Gogi", manager: "colan biemer" }, away: { entryId: 143187, name: "Kroupi Diaper", manager: "Ryan Hilbert" } },
  { id: "r1-10", round: "r1", home: { entryId: 131866, name: "Whampton Ponderers", manager: "Noah Wolff" }, away: { entryId: 132310, name: "Pwalsh25", manager: "Patrick Walsh" } },

  // Round 2 (GW 14): Premiership teams vs Round 1 winners
  { id: "r2-1", round: "r2", home: { entryId: 123052, name: "Sesk Addict", manager: "Max Jones" }, away: { winnerOf: "r1-1" } },
  { id: "r2-2", round: "r2", home: { entryId: 46821, name: "Ted\u2019s Heroes", manager: "Teddy Eley" }, away: { winnerOf: "r1-2" } },
  { id: "r2-3", round: "r2", home: { entryId: 48882, name: "Wirtz Case Scenario", manager: "Nicholas Zantal" }, away: { winnerOf: "r1-3" } },
  { id: "r2-4", round: "r2", home: { entryId: 46498, name: "Goodbye Arne", manager: "Max Winter" }, away: { winnerOf: "r1-4" } },
  { id: "r2-5", round: "r2", home: { entryId: 47447, name: "TakeOffPants&Jacquet", manager: "Matt Chiswell" }, away: { winnerOf: "r1-5" } },
  { id: "r2-6", round: "r2", home: { entryId: 48257, name: "Ryan's Reds", manager: "Ryan Baer" }, away: { winnerOf: "r1-6" } },
  { id: "r2-7", round: "r2", home: { entryId: 67538, name: "Pete\u2019s Pistolas", manager: "Pete Passalino" }, away: { winnerOf: "r1-7" } },
  { id: "r2-8", round: "r2", home: { entryId: 192422, name: "Raya's Rioters", manager: "Patrick Kelliher" }, away: { winnerOf: "r1-8" } },
  { id: "r2-9", round: "r2", home: { entryId: 178552, name: "Mbeumboclaat", manager: "Jake Bruce" }, away: { winnerOf: "r1-9" } },
  { id: "r2-10", round: "r2", home: { entryId: 219199, name: "Wile E. Kayodes", manager: "Phil Rich" }, away: { winnerOf: "r1-10" } },

  // Play-in (GW 16): seeds 7-10
  { id: "pi-1", round: "pi", home: { seed: 7 }, away: { seed: 10 } },
  { id: "pi-2", round: "pi", home: { seed: 8 }, away: { seed: 9 } },

  // Quarterfinal (GW 18): top 2 seeds face the play-in winners
  { id: "qf-1", round: "qf", home: { seed: 1 }, away: { winnerOf: "pi-2" } },
  { id: "qf-2", round: "qf", home: { seed: 2 }, away: { winnerOf: "pi-1" } },
  { id: "qf-3", round: "qf", home: { seed: 3 }, away: { seed: 6 } },
  { id: "qf-4", round: "qf", home: { seed: 4 }, away: { seed: 5 } },

  // Semifinal (GW 22)
  { id: "sf-1", round: "sf", home: { winnerOf: "qf-1" }, away: { winnerOf: "qf-4" } },
  { id: "sf-2", round: "sf", home: { winnerOf: "qf-2" }, away: { winnerOf: "qf-3" } },

  // Final (GW 26)
  { id: "final", round: "final", home: { winnerOf: "sf-1" }, away: { winnerOf: "sf-2" } },
];

// Only consulted when a matchup is level on points, goals and cards.
// Matchup id -> winning entry id, e.g. { "r1-3": 46498 }.
export const TIE_OVERRIDES = {};
