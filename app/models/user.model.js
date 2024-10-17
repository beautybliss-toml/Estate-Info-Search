module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      username1: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      allow: {
        type: Sequelize.INTEGER, //0: false, 1: true
        allowNull: false,
      },
    });
  
    return user;
};