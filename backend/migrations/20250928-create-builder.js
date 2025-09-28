"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("builders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      hq_location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      established_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("builders");
  },
};
