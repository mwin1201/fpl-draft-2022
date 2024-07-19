const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class ChampionsLeague extends Model {}

ChampionsLeague.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "owner",
        key: "fpl_id",
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "champions_league",
  }
);

module.exports = ChampionsLeague;
