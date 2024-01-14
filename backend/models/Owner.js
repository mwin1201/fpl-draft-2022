const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

class Owner extends Model {
    // check password
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password);
    }
};

Owner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
        team_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8]
            },
        },
        primary_league_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        fpl_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        secondary_league_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        hooks: {
            async beforeCreate(newOwnerData) {
                newOwnerData.password = await bcrypt.hash(newOwnerData.password, 8);
                return newOwnerData;
            },
            async beforeUpdate(updatedOwnerData) {
                updatedOwnerData.password = await bcrypt.hash(updatedOwnerData.password, 8);
                return updatedOwnerData;
            }
        },
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "owner"
    }
);

module.exports = Owner;