const { User, Thought } = require("../models");

const thoughtCtrl = {
  fetchThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  fetchThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thoughtData) => {
        if (!thoughtData) {
          return res
            .status(404)
            .json({ message: "Thought not found with this ID!" });
        }
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({
            message: "Thought added, but user not found with this ID!",
          });
        }

        res.json({ message: "Thought added successfully!" });
      })
      .catch((err) => res.json(err));
  },

  modifyThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "Thought not found with this ID!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },

  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res
            .status(404)
            .json({ message: "Thought not found with this ID!" });
        }

        return User.findOneAndUpdate(
          { thoughts: params.thoughtId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({
            message: "Thought deleted, but user not found with this ID!",
          });
        }
        res.json({ message: "Thought successfully removed!" });
      })
      .catch((err) => res.json(err));
  },

  createReact({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "Thought not found with this ID" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },

  removeReact({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtCtrl;
