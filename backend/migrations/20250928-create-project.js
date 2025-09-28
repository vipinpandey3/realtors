"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      builder_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "builders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price_range: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price_min_inr: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      price_max_inr: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Ongoing", "Ready to Move", "Completed", "Paused"),
        allowNull: false,
        defaultValue: "Ongoing",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("projects");
  },
};
