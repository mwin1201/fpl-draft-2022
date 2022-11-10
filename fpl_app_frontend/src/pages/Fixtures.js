
const Fixtures = () => {
    let fixtureData = JSON.parse(localStorage.getItem("matches"));

    return (
        <div>
            <h1>Fixture History</h1>
            {fixtureData.map((fixture,i) => (
                <div key={i}>
                    <h3>Week {fixture.event}</h3>
                    {fixture.league_entry_1}: {fixture.league_entry_1_points} vs {fixture.league_entry_2}: {fixture.league_entry_2_points}
                </div>
            ))}
        </div>
    );

};

export default Fixtures;