// services/UserProgramService.js
const UserProgram = require('../models/userprograms'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary
const Programs = require('../models/programs'); // Adjust the path as necessary

class UserProgramService {
 static async getProgramIdByName(program_name) {
    try {
      const program = await Programs.findOne({ where: { program_name: program_name } });
      if (!program) {
        throw new Error('Program not found');
      }
      return program.program_id;
    } catch (error) {
      throw new Error(`Error fetching program ID: ${error.message}`);
    }
 }

 static async enrollUser({ program_id, program_name, full_names, email, phone_number, educationlevel, currentjob }) {
    // validation
    if (!program_id|| !full_names || !email || !phone_number || !educationlevel || !currentjob || !program_name) {
      throw new Error('Missing required fields');
    }

    try {
      // Retrieve program ID based on the program name
      //const program_id = await this.getProgramIdByName(program_name);

      // Create enrollment record
      const enrollment = await UserProgram.create({
       // user_id,
        program_id,
        full_names,
        program_name,
        email,
        phone_number,
        educationlevel,
        currentjob,
        status: 'enrolled', // Assuming a default status
      });
      return enrollment;
    } catch (error) {
      throw new Error(`Error enrolling user: ${error.message}`);
    }
 }


 static async getUserPrograms(user_id) {
    try {
      // Use Sequelize to find all programs associated with a user
      const userWithPrograms = await User.findByPk(user_id, {
        include: [{ model: Programs, through: UserProgram }]
      });
      return userWithPrograms; // This will return the user along with their enrolled programs
    } catch (error) {
      throw new Error(`Error fetching user programs: ${error.message}`);
    }
 }

 static async unenrollUser(user_id, program_id) {
    try {
      // Use Sequelize to delete a specific enrollment record
      const result = await UserProgram.destroy({
        where: {
          user_id,
          program_id
        }
      });
      return result > 0 ? "Unenrollment successful" : "Unenrollment failed";
    } catch (error) {
      throw new Error(`Error unenrolling user: ${error.message}`);
    }
 }
}

module.exports = UserProgramService;
