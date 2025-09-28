"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "builders",
      [
        {
          name: "Sample Builder",
          hq_location: "Sample Location",
          established_year: 2000,
        },
        {
          name: "Sample Builder 2",
          hq_location: "Sample Location 2",
          established_year: 2001,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Builders", null, {});
  },
};
