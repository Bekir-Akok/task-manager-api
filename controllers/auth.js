const bcrypt = require("bcryptjs");

//local import
const User = require("../models/user");
const Team = require("../models/team");
const { generateAccessToken } = require("../middleware/auth");
const { errHandler } = require("../utils/helper");

//routes
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return errHandler(
        { status: 417, msg: "user does not exist", status_code: 101 },
        res
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return errHandler(
        { status: 417, msg: "wrong password", status_code: 102 },
        res
      );
    }

    if (user && isPasswordCorrect) {
      // Create token
      const { token } = generateAccessToken(user._id, user.userName, user.role);

      const {
        userName,
        role,
        phoneNumber,
        securityCode,
        suggestionName,
        accountType,
        accountCode,
      } = user;

      const selectUser = {
        userName,
        role,
        phoneNumber,
        securityCode,
        suggestionName,
        accountType,
        accountCode,
      };

      return res.status(200).json({
        user: selectUser,
        token,
        message: "Authentication successful",
      });
    }
  } catch (err) {
    console.log(err);
    errHandler({ status: 500, msg: "login failed" }, res);
  }
};

const register = async (req, res) => {
  const { userName, password, phoneNumber, securityCode, suggestionName } =
    req.body;

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

    if (!isSuggestionNameExist) {
      return errHandler(
        { status: 417, msg: "suggestionName doesnt exist", status_code: 103 },
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
    });

    const team = await Team.updateOne(
      { _id: isSuggestionNameExist._id },
      { $push: { group: user._id } }
    );

    if (user && team) {
      return res.status(201).json({ msg: "user create succesfuly" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "user create failure" });
  }
};

module.exports = {
  login,
  register,
};
