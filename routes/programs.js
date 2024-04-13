// routes/programs.js
const express = require('express');
const router = express.Router();
const ProgramService = require('../services/programService');

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await ProgramService.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific program by ID
router.get('/:id', async (req, res) => {
  try {
    const program = await ProgramsService.getProgramById(req.params.id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new program
router.post('/', async (req, res) => {
  try {
    const newProgram = await ProgramsService.createProgram(req.body);
    res.status(201).json(newProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a program
router.put('/:id', async (req, res) => {
  try {
    const updatedProgram = await ProgramsService.updateProgram(req.params.id, req.body);
    res.json(updatedProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const message = await ProgramsService.deleteProgram(req.params.id);
    res.json({ message: 'Program successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
