const express = require('express');
const router = express.Router();
const UserProgramService = require('../services/userprogramService');
const Program = require('../models/programs'); // Import your Program model

// Enroll a user in a program
router.post('/', async (req, res) => {
    try {
        // Log the request body to see what data is being received
        console.log('Request body:', req.body);

        const { full_names, currentjob, educationlevel, email, program_name, phone_number } = req.body;

        // Use req.session.user_id to get the user's ID
        //const userId = req.session.userId;

        // Use the service to get the program_id based on programName
        const program = await Program.findOne({ where: { program_name: program_name } });
        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }
        const programId = await program.id;
        console.log('Program ID', programId)
        //console.log('User Id', userId)
        // Pass the data along with userId and programId to the service
        const enrollment = await UserProgramService.enrollUser({
            //user_id: userId,
            program_id: programId,
            full_names: full_names,
            currentjob: currentjob,
            educationlevel: educationlevel,
            program_name: program_name,
            phone_number: phone_number,
            email: email,
        });
        await enrollment
        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Error in userPrograms route:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get all programs for a user
router.get('/', async (req, res) => {
    try {
        // Use req.session.user_id to get the user's ID
        const user_id = req.session.user_id;
        const programs = await UserProgramService.getUserPrograms(user_id);
        if (!programs) {
            return res.status(404).json({ message: 'No programs found for this user' });
        }
        res.json(programs);
    } catch (error) {
        console.error('Error fetching user programs:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Unenroll a user from a program
router.delete('/:program_id', async (req, res) => {
    try {
        // Use req.session.user_id to get the user's ID
        const user_id = req.session.user_id;
        const { program_id } = req.params;
        const message = await UserProgramService.unenrollUser(user_id, program_id);
        res.json({ message });
    } catch (error) {
        console.error('Error unenrolling user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
