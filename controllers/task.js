//local import
const Task = require("../models/task");

const getAllTask = async (req, res) => {
  const { totalDocs, data } = res.paginatedResults;
  try {
    return res
      .status(200)
      .json({ msg: "get all task successfuly", totalDocs, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get all task failure" });
  }
};

const createTask = async (req, res) => {
  const { taskName, taskPrice, taskComission, fileUrl } = req.body;
  try {
    await Task.create({
      taskName,
      taskPrice,
      taskComission,
      taskPhoto: fileUrl,
    });

    return res.status(200).json({ msg: "create task successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "create task failure" });
  }
};

const deleteTask = async (req, res) => {
  const { id: _id } = req.params;
  try {
    await Task.deleteOne({ _id });

    return res.status(200).json({ msg: "delete task successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "delete task failure" });
  }
};

module.exports = { getAllTask, createTask, deleteTask };
