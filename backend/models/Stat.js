const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Stat extends Model {}

Stat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goals_scored: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assists: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clean_sheets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goals_conceded: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    yellow_cards: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    red_cards: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bonus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // foreign key
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "owner",
        keys: "fpl_id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "stat",
  }
);

module.exports = Stat;
