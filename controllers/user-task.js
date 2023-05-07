//local import
const User = require("../models/user");
const Task = require("../models/task");
const { errHandler } = require("../utils/helper");

const getUserTasks = async (req, res) => {
  const { id: _id } = req.user;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await Promise.all(
      isUserExist.task.map(async (t) => {
        const approved = await Task.findOne({ _id: t.id });

        return { ...approved, repeatCount: t.repeatCount };
      })
    );

    return res.status(200).json({ msg: "get user tasks successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get user tasks failure" });
  }
};

const approvedTask = async (req, res) => {
  const { _id } = req.user;
  const { taskId } = req.params;
  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    if (!isUserExist.task.find((t) => t.id === taskId)) {
      return errHandler(
        { status: 417, msg: "user does not have this task", status_code: 110 },
        res
      );
    }

    isUserExist.task = isUserExist.task.filter((t) => t.id !== taskId);
    isUserExist.approvedTask = [
      ...isUserExist.approvedTask,
      ...isUserExist.task.filter((t) => t.id === taskId),
    ];

    await isUserExist.save();

    return res
      .status(200)
      .json({ msg: "apporoved task create successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "apporoved task create failure" });
  }
};

const getApprovedTask = async (req, res) => {
  const { id: _id } = req.user;
  console.log(req.user);
  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await Promise.all(
      isUserExist.approvedTask.map(async (task) => {
        const approved = await Task.findOne({ _id: task.id });

        return { ...approved, repeatCount: task.repeatCount };
      })
    );

    return res.status(200).json({ msg: "get approved task successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get approved task failure" });
  }
};

const createDoneTask = async (req, res) => {
  const { _id } = req.user;
  const { taskId } = req.params;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    if (!isUserExist.approvedTask.find((t) => t.id === taskId)) {
      return errHandler(
        { status: 417, msg: "user does not have this task", status_code: 110 },
        res
      );
    }

    const selectedTask = await Task.findOne({ _id: taskId });

    const state = isUserExist.charge >= selectedTask.taskPrice;
    if (!state) {
      return errHandler(
        {
          status: 417,
          msg: "user does not have enough charge",
          status_code: 109,
        },
        res
      );
    }

    isUserExist.approvedTask = isUserExist.approvedTask.filter(
      (t) => t.id !== taskId
    );
    isUserExist.doneTask = [
      ...isUserExist.doneTask,
      ...isUserExist.approvedTask.filter((t) => t.id === taskId),
    ];

    if (!!isUserExist?.taskNumber && isUserExist?.taskNumber - 1 === 0) {
      isUserExist.charge = isUserExist.charge + isUserExist.frozen;
      isUserExist.frozen = 0;
      isUserExist.taskNumber = 1;
    } else if (!!isUserExist?.taskNumber && isUserExist?.taskNumber - 1 !== 0) {
      isUserExist.charge = isUserExist.charge - selectedTask.taskPrice;
      isUserExist.frozen =
        isUserExist.frozen +
        selectedTask.taskPrice +
        selectedTask.taskComission;
      isUserExist.taskNumber = isUserExist.taskNumber - 1;
    }

    await isUserExist.save();

    return res.status(200).json({ msg: "create done task successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "create done task failure" });
  }
};

const getDoneTask = async (req, res) => {
  const { id: _id } = req.user;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await Promise.all(
      isUserExist.doneTask.map(async (task) => {
        const approved = await Task.findOne({ _id: task.id });

        return { ...approved, repeatCount: task.repeatCount };
      })
    );

    return res.status(200).json({ msg: "get done task successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get done task failure" });
  }
};

module.exports = {
  getUserTasks,
  approvedTask,
  getApprovedTask,
  createDoneTask,
  getDoneTask,
};
