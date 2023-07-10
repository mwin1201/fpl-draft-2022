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
        teamName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8]
            },
        },
        primaryLeagueID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entryID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fplID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        secondaryLeagueID: {
            type: DataTypes.INTEGER
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