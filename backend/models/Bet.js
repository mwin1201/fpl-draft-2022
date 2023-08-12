const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Bet extends Model {

};

Bet.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        fixture_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_h: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_h_prediction: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['win','draw','loss']]
            }
        },
        team_a: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        team_a_prediction: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['win','draw','loss']]
            }
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        
        //foreignKey
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
        modelName: "bet"
    }
);

module.exports = Bet;