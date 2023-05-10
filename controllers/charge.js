//local import
const User = require("../models/user");
const SendingMoney = require("../models/sendingMoney");
const { errHandler } = require("../utils/helper");

const userSend = async (req, res) => {
  const { id: _id } = req.user;
  const { senderName, balance, code } = req.body;

  try {
    const isUserExist = await User.findOne({ _id }, { _id: 0 });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    await SendingMoney.create({ user: _id, senderName, balance, code });

    return res.status(201).json({ msg: "request succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const checkAdminUserSend = async (req, res) => {
  const { data, totalDocs } = res.paginatedResults;
  try {
    return res.status(200).json({ msg: "request succesfuly", data, totalDocs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const userSendingUpdate = async (req, res) => {
  const { id: _id } = req.params;
  const { status } = req.body;
  try {
    await SendingMoney.updateOne({ _id }, { $set: { status } });

    const money = await SendingMoney.findOne({ _id });

    const user = await User.findOne({ _id: money.user });

    if (money.status === "Resolve" && !!user) {
      user.charge = user.charge + money.balance;
    }

    await user.save();

    return res.status(200).json({ msg: "request succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

module.exports = { userSend, checkAdminUserSend, userSendingUpdate };
