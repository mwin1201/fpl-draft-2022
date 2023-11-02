const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class LeagueData extends Model {

};

LeagueData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        // example: 23-24
        season_year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        league_started_in: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: [['championship', 'premiership']]
            }
        },
        league_ended_in: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['championship', 'premiership']]
            }
        },

        // only applies to team in championship table positions 3-6 by gameweek 36
        championship_playoff: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Y', 'N', 'NA']]
            }
        },

        // applies to top 4 table positions in premiership
        champions_league: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Y', 'N', 'NA']]
            }
        },

        // team's current table position
        table_position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10
            }
        },

        // bottom 3 table positions in premiership
        relegation: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Y', 'N', 'NA']]
            }
        },

        // top 2 table positions in championship + winner of the promotional playoff
        promotion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Y', 'N', 'NA']]
            }
        },
        total_points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_goals: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_assists: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        season_complete: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        // foreign key
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "owner",
                key: "fpl_id"
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "league_data"
    }
);

module.exports = LeagueData;