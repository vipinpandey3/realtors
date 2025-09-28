"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate 50 rummy project records
    const projects = [];
    for (let i = 1; i <= 50; i++) {
      projects.push({
        name: `Rummy Project ${i}`,
        location: `Location ${i}`,
        builder_id: (i % 2) + 1, // alternate between builder 1 and 2
        price_range: `${50 + i}L-${1 + i}Cr`,
        status: i % 2 === 0 ? "Ongoing" : "Ongoing",
      });
    }
    await queryInterface.bulkInsert("projects", projects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("projects", null, {});
  },
};
