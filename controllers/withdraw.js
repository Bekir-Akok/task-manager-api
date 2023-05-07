//local import
const User = require("../models/user");
const WithdrawMoney = require("../models/withdrawMoney");
const { errHandler } = require("../utils/helper");

const userWithdraw = async (req, res) => {
  const { _id } = req.user;
  const { totalValue, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ _id }, { _id: 0 });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    if (isUserExist.securityCode !== securityCode) {
      return errHandler(
        { status: 417, msg: "statusCode does not correct", status_code: 109 },
        res
      );
    }

    const statament = isUserExist.charge >= totalValue;

    if (!statament) {
      return errHandler(
        { status: 417, msg: "user charge not enough", status_code: 110 },
        res
      );
    }

    isUserExist.charge = isUserExist.charge - totalValue;
    await isUserExist.save();
    await WithdrawMoney.create({ user: _id, totalValue });

    return res.status(201).json({ msg: "withdrawMoney create succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const checkAdminUserWithdraw = async (req, res) => {
  const { data, totalDocs } = res.paginatedResults;
  try {
    return res.status(200).json({ msg: "request succesfuly", data, totalDocs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const userWithdrawUpdate = async (req, res) => {
  const { id: _id } = req.params;
  const { status } = req.body;
  try {
    await WithdrawMoney.updateOne({ _id }, { $set: { status } });

    return res.status(200).json({ msg: "Withdraw update succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Withdraw update failure" });
  }
};

module.exports = { userWithdraw, checkAdminUserWithdraw, userWithdrawUpdate };
