// The old "you are viewing your secondary league" alert was tied to user
// accounts (primary vs secondary league). With no accounts, the active league
// is chosen explicitly and shown in the header/refresh bar, so this alert is no
// longer needed. Kept as a no-op so existing imports keep working.
const LeagueAlert = () => null;

export default LeagueAlert;
