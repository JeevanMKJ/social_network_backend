const router = require("express").Router();

const {
  fetchThoughts,
  fetchThoughtById,
  addThought,
  modifyThought,
  removeThought,
  createReact,
  removeReact,
} = require("../../controllers/thoughtController");

// /api/thoughts
router.route("/").get(fetchThoughts).post(addThought);

// /api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(fetchThoughtById)
  .put(modifyThought)
  .delete(removeThought);

//  /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(createReact);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReact);

module.exports = router;
