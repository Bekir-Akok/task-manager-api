const WithdrawMoney = require("../models/withdrawMoney");
const sendingMoney = require("../models/sendingMoney");
const { errHandler } = require("../utils/helper");

const getUserWithdraw = async (req, res) => {
  const { id: _id } = req.user;
  const { start_date, end_date } = req.query;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await WithdrawMoney.findOne({
      user: _id,
      created_at: { $gte: start_date, $lte: end_date },
    });

    return res.status(200).json({ msg: "get user withdraw successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get user withdraw failure" });
  }
};

const getUserSending = async (req, res) => {
  const { id: _id } = req.user;
  const { start_date, end_date } = req.query;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const data = await sendingMoney.findOne({
      user: _id,
      created_at: { $gte: start_date, $lte: end_date },
    });

    return res.status(200).json({ msg: "get user sending successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get user sending failure" });
  }
};

module.exports = { getUserWithdraw, getUserSending };
