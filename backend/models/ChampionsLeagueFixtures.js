const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class ChampionsLeagueFixtures extends Model {}

ChampionsLeagueFixtures.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    gameweek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_entry_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_entry_1_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_entry_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_entry_2_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "champions_league_fixtures",
  }
);

module.exports = ChampionsLeagueFixtures;
