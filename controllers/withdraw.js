//local import
const User = require("../models/user");
const WithdrawMoney = require("../models/withdrawMoney");
const { errHandler } = require("../utils/helper");

const userWithdraw = async (req, res) => {
  const { id: _id } = req.user;
  const { totalValue, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    if (isUserExist.securityCode !== Number(securityCode)) {
      return errHandler(
        { status: 417, msg: "statusCode does not correct", status_code: 106 },
        res
      );
    }

    const statament = isUserExist.charge >= Number(totalValue);

    if (!statament) {
      return errHandler(
        { status: 417, msg: "user charge not enough", status_code: 111 },
        res
      );
    }

    isUserExist.charge = isUserExist.charge - totalValue;

    await isUserExist.save();

    await WithdrawMoney.create({
      user: _id,
      userName: isUserExist.userName,
      totalValue,
    });

    return res.status(201).json({ msg: "withdrawMoney create succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const checkAdminUserWithdraw = async (req, res) => {
  const { data, totalDocs } = res.paginatedResults;
  try {
    const userAdded = await Promise.all(
      data.map(async (withdraw) => {
        const { nameSurname, accountCode } = await User.findOne({
          _id: withdraw.user,
        });

        return { ...withdraw?._doc, nameSurname, accountCode };
      })
    );

    return res
      .status(200)
      .json({ msg: "request succesfuly", data: userAdded, totalDocs });
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

    const money = await WithdrawMoney.findOne({ _id });
    const user = await User.findOne({ _id: money.user });

    if (status === "Reject") {
      user.charge = user.charge + money.totalValue;
    }
    await user.save();

    return res.status(200).json({ msg: "Withdraw update succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Withdraw update failure" });
  }
};

module.exports = { userWithdraw, checkAdminUserWithdraw, userWithdrawUpdate };
