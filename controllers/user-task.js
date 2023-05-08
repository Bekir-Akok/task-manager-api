//local import
const User = require("../models/user");
const Task = require("../models/task");
const { errHandler } = require("../utils/helper");

const createdAt = new Date();

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

        return { ...approved?._doc, repeatCount: t.repeatCount };
      })
    );

    return res.status(200).json({ msg: "get user tasks successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get user tasks failure" });
  }
};

const approvedTask = async (req, res) => {
  const { id: _id } = req.user;
  const { taskId, index } = req.params;
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

    const newObj = { ...isUserExist.task[index], createdAt };

    isUserExist.approvedTask = [...isUserExist.approvedTask, newObj];
    isUserExist.task = isUserExist.task.filter((_t, i) => {
      return i !== Number(index);
    });

    await isUserExist.save();

    return res.status(200).json({ msg: "apporoved task create successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "apporoved task create failure" });
  }
};

const getApprovedTask = async (req, res) => {
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
      isUserExist.approvedTask.map(async (task) => {
        const approved = await Task.findOne({ _id: task.id });

        return {
          ...approved?._doc,
          repeatCount: task.repeatCount,
          createdAt: task.createdAt,
        };
      })
    );

    return res.status(200).json({ msg: "get approved task successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get approved task failure" });
  }
};

const createDoneTask = async (req, res) => {
  const { id: _id } = req.user;
  const { taskId, index } = req.params;

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
    const { repeatCount } = isUserExist.approvedTask[index];

    const state =
      isUserExist.charge >=
      Number(selectedTask.taskPrice) * Number(repeatCount);
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

    const newObj = { ...isUserExist.approvedTask[index], createdAt };

    isUserExist.doneTask = [...isUserExist.doneTask, newObj];
    isUserExist.approvedTask = isUserExist.approvedTask.filter(
      (_t, i) => i !== Number(index)
    );

    if (isUserExist?.taskNumber - 1 === 0) {
      isUserExist.charge =
        isUserExist.charge +
        isUserExist.frozen +
        Number(selectedTask.taskPrice) +
        Number(selectedTask.taskComission) * Number(repeatCount);
      isUserExist.frozen = 0;
      isUserExist.taskNumber = 1;

      await isUserExist.save();
    } else if (isUserExist?.taskNumber - 1 !== 0) {
      isUserExist.charge =
        isUserExist.charge -
        Number(selectedTask.taskPrice) * Number(repeatCount);
      isUserExist.frozen =
        Number(isUserExist.frozen) +
        Number(selectedTask.taskPrice) +
        Number(selectedTask.taskComission) * Number(repeatCount);
      isUserExist.taskNumber = isUserExist.taskNumber - 1;

      await isUserExist.save();
    }

    await isUserExist.save();

    return res.status(200).json({ msg: "create done task successfuly" });
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

        return {
          ...approved?._doc,
          repeatCount: task.repeatCount,
          createdAt: task.createdAt,
        };
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
