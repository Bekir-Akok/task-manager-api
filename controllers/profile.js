const bcrypt = require("bcryptjs");

//local import
const User = require("../models/user");
const Task = require("../models/task");
const { errHandler, isThatSameDay } = require("../utils/helper");

const resetPassword = async (req, res) => {
  const { id: _id } = req.user;
  const { password, oldPassword } = req.body;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      isUserExist.password
    );

    if (!isPasswordCorrect) {
      return errHandler(
        { status: 417, msg: "user password wrong", status_code: 105 },
        res
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    isUserExist.password = hashPassword;

    await isUserExist.save();

    return res.status(200).json({ msg: "reset password successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "reset password failure" });
  }
};

const walletDetail = async (req, res) => {
  const { id: _id } = req.user;
  const { nameSurname, accountCode, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const securityCodeCorrect =
      Number(isUserExist.securityCode) === Number(securityCode);

    if (!securityCodeCorrect) {
      return errHandler(
        { status: 417, msg: "user security code wrong", status_code: 106 },
        res
      );
    }

    isUserExist.nameSurname = nameSurname;
    isUserExist.accountCode = accountCode;

    await isUserExist.save();

    return res.status(200).json({ msg: "change account info successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "change account info failure" });
  }
};

const getWalletDetail = async (req, res) => {
  const { id: _id } = req.user;
  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const { userName, accountCode, accountType, nameSurname } = isUserExist;
    const data = {
      userName,
      accountCode,
      accountType,
      nameSurname,
    };

    return res.status(200).json({ msg: "get wallet detail successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get wallet detail failure" });
  }
};

const changeSecurityCode = async (req, res) => {
  const { id: _id } = req.user;
  const { oldSecurityCode, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const securityCodeCorrect =
      Number(isUserExist.securityCode) === Number(oldSecurityCode);

    if (!securityCodeCorrect) {
      return errHandler(
        { status: 417, msg: "user security code wrong", status_code: 106 },
        res
      );
    }

    isUserExist.securityCode = securityCode;

    await isUserExist.save();

    return res.status(200).json({ msg: "change security code successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "change security code failure" });
  }
};

const getQuestData = async (req, res) => {
  const { id: _id } = req.user;
  const today = new Date();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const { charge, frozen, taskNumber, task, doneTask } = isUserExist;

    const total = charge + frozen;

    const todayQuest = task.length;

    const todayTask = doneTask.filter((t) => isThatSameDay(t.createdAt, today));

    const yesterdayTask = doneTask.filter((t) =>
      isThatSameDay(t.createdAt, yesterday)
    );

    const totals = await Promise.all(
      todayTask.map(async (t) => {
        const task = await Task.findOne({ _id: t.id });

        const { taskPrice, taskComission } = task?._doc;
        const { repeatCount } = t;

        const total = taskPrice + taskComission * repeatCount;

        return { total };
      })
    );

    const todayEarn = totals?.reduce((total, acc) => {
      return total + acc.total;
    }, 0);

    const totalss = await Promise.all(
      yesterdayTask?.map(async (t) => {
        const task = await Task.findOne({ _id: t.id });

        const { taskPrice, taskComission } = task?._doc;
        const { repeatCount } = t;

        const total = taskPrice + taskComission * repeatCount;

        return { total };
      })
    );

    const yesterdayEarn = totalss?.reduce((total, acc) => {
      return total + acc.total;
    }, 0);

    const data = { total, todayQuest, taskNumber, todayEarn, yesterdayEarn };

    return res.status(200).json({ msg: "get quest data successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get quest data failure" });
  }
};

const getBalanceData = async (req, res) => {
  const { id: _id } = req.user;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const { charge, frozen } = isUserExist;

    const data = { charge, frozen };

    return res.status(200).json({ msg: "get balance data successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get balance data failure" });
  }
};

module.exports = {
  resetPassword,
  walletDetail,
  getWalletDetail,
  changeSecurityCode,
  getQuestData,
  getBalanceData,
};
