// services/programsService.js
const Programs = require('../models/programs'); 

class ProgramsService {
  static async getAllPrograms() {
    try {
      return await Programs.findAll();
    } catch (error) {
      throw new Error('Unable to retrieve programs: ' + error.message);
    }
  }

  static async getProgramById(id) {
    try {
      const programs = await Programs.findByPk(id);
      if (!programs) {
        throw new Error('Program not found');
      }
      return programs;
    } catch (error) {
      throw new Error('Unable to retrieve program: ' + error.message);
    }
  }

  static async createProgram(programData) {
    try {
      return await Programs.create(programData);
    } catch (error) {
      throw new Error('Unable to create program: ' + error.message);
    }
  }

  static async updateProgram(id, updatedData) {
    try {
      let programs = await Programs.findByPk(id);
      if (!programs) {
        throw new Error('Program not found');
      }
      return await programs.update(updatedData);
    } catch (error) {
      throw new Error('Unable to update program: ' + error.message);
    }
  }

  static async deleteProgram(id) {
    try {
      let program = await Program.findByPk(id);
      if (!program) {
        throw new Error('Program not found');
      }
      await program.destroy();
      return 'Program successfully deleted';
    } catch (error) {
      throw new Error('Unable to delete program: ' + error.message);
    }
  }
}

module.exports = ProgramsService;
