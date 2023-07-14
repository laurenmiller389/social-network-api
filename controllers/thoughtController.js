const { Course, Student } = require('../models');

module.exports = {
  // Get all courses
  async getThought(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a course
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a thought
  //(don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      //might need this for deleting thought reactions:

      /*      
      await Student.deleteMany({ _id: { $in: course.students } });
      res.json({ message: 'Course and students deleted!' });
      */
   
    } catch (err) {
      res.status(500).json(err);
    }
  
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.courseId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

//API THOUGHT REACTIONS

// POST request to create a reaction stored in a single thought's reactions array field
app.post('/api/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reaction } = req.body;

    // Find the thought by its ID and push the reaction to the reactions array
    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $push: { reactions: reaction } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request to pull and remove a reaction by the reaction's reactionId
app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    // Find the thought by its ID and pull the reaction by its reactionId
    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});
