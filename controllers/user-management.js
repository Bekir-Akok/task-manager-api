const bcrypt = require("bcryptjs");

//local import
const User = require("../models/user");
const Task = require("../models/task");
const Team = require("../models/team");
const { errHandler } = require("../utils/helper");

const getAllUser = async (req, res) => {
  const { totalDocs, data } = res.paginatedResults;
  try {
    return res
      .status(200)
      .json({ msg: "get all user successfuly", totalDocs, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get all user failure" });
  }
};

const updateTaskFromUser = async (req, res) => {
  const { id: _id, taskId } = req.params;
  const { repeatCount } = req.body;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return errHandler(
        { status: 417, msg: "task does not exist", status_code: 107 },
        res
      );
    }

    await User.updateOne(
      { _id },
      { $push: { task: { id: taskId, repeatCount } } }
    );

    return res.status(200).json({ msg: "update task successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "update task failure" });
  }
};

const deleteTaskFromUser = async (req, res) => {
  const { id: _id, taskId, index } = req.params;
  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return errHandler(
        { status: 417, msg: "task does not exist", status_code: 107 },
        res
      );
    }

    user.task = user.task.filter((t, i) => i !== Number(index));

    await user.save();

    return res.status(200).json({ msg: "delete task successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "delete task failure" });
  }
};

const createModeratorUser = async (req, res) => {
  const {
    userName,
    password,
    role,
    phoneNumber,
    securityCode,
    suggestionName,
  } = req.body;
  try {
    const isUserExist = await User.findOne(
      { $or: [{ userName }, { phoneNumber }] },
      { _id: 0 }
    );

    if (isUserExist) {
      return errHandler(
        { status: 417, msg: "user already exist", status_code: 104 },
        res
      );
    }

    const isSuggestionNameExist = await User.findOne({ suggestionName });

    if (isSuggestionNameExist) {
      return errHandler(
        { status: 417, msg: "already exist", status_code: 108 },
        res
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      password: hashPassword,
      phoneNumber,
      securityCode,
      suggestionName,
      role,
    });

    await Team.create({ owner: user._id, group: [] });

    return res.status(200).json({ msg: "moderator create successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "moderator create failure" });
  }
};

const getAllTaskByUser = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findOne({ _id });

    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await Promise.all(
      user.task.map(async (t) => {
        const task = await Task.findOne({ _id: t?.id });

        return { ...task?._doc, repeatCount: t?.repeatCount };
      })
    );

    return res.status(200).json({ msg: "get all user successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get all user failure" });
  }
};

const userInfoUpdate = async (req, res) => {
  const { id: _id } = req.params;
  const {
    charge,
    frozen,
    taskNumber,
    userName,
    phoneNumber,
    securityCode,
    suggestionName,
  } = req.body;

  try {
    const user = await User.findOne({ _id });
    const isUniqe = await User.findOne({
      $or: [{ userName }, { phoneNumber }],
    });

    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    if (!taskNumber >= 1) {
      return errHandler({ status: 417, msg: "", status_code: 112 }, res);
    }

    if (isUniqe.length >= 1) {
      return errHandler(
        {
          status: 417,
          msg: "username phonenumber must be uniqe",
          status_code: 113,
        },
        res
      );
    }

    user.charge = charge;
    user.frozen = frozen;
    user.taskNumber = taskNumber;
    user.userName = userName;
    user.phoneNumber = phoneNumber;
    user.securityCode = securityCode;
    user.suggestionName = suggestionName;

    await user.save();

    return res.status(200).json({ msg: "update user successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "update user failure" });
  }
};

const userChangePassword = async (req, res) => {
  const { id: _id } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({ _id });

    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    return res.status(200).json({ msg: "req succes" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "update user failure" });
  }
};

module.exports = {
  getAllUser,
  updateTaskFromUser,
  deleteTaskFromUser,
  createModeratorUser,
  getAllTaskByUser,
  userInfoUpdate,
  userChangePassword,
};
