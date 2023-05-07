const bcrypt = require("bcryptjs");

//local import
const User = require("../models/user");
const { errHandler } = require("../utils/helper");

const resetPassword = async (req, res) => {
  const { userName, password, oldPassword } = req.body;

  try {
    const isUserExist = await User.findOne({ userName });

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
  const { userName, accountCode, accountType, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ userName });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const securityCodeCorrect = isUserExist.securityCode === securityCode;

    if (!securityCodeCorrect) {
      return errHandler(
        { status: 417, msg: "user security code wrong", status_code: 106 },
        res
      );
    }

    isUserExist.accountType = accountType;
    isUserExist.accountCode = accountCode;

    await isUserExist.save();

    return res.status(200).json({ msg: "change account info successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "change account info failure" });
  }
};

const getWalletDetail = async (req, res) => {
  const { _id } = req.user;
  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const { userName, accountCode, accountType, securityCode } = isUserExist;
    const data = { userName, accountCode, accountType, securityCode };

    return res.status(200).json({ msg: "get wallet detail successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "get wallet detail failure" });
  }
};

const changeSecurityCode = async (req, res) => {
  const { _id } = req.user;
  const { oldSecurityCode, securityCode } = req.body;

  try {
    const isUserExist = await User.findOne({ _id });

    if (!isUserExist) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const securityCodeCorrect = isUserExist.securityCode === oldSecurityCode;

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

module.exports = {
  resetPassword,
  walletDetail,
  getWalletDetail,
  changeSecurityCode,
};
