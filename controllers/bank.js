const bcrypt = require("bcryptjs");

//local import
const Bank = require("../models/bank");
const Task = require("../models/task");
const { errHandler, isThatSameDay } = require("../utils/helper");

const getActiveBank = async (req, res) => {
  try {
    const data = await Bank.findOne({ active: true });
    return res.status(200).json({ msg: "request successfuly", data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const getAllBank = async (req, res) => {
  const { data, totalDocs } = res.paginatedResults;

  try {
    return res
      .status(200)
      .json({ msg: "request successfuly", data, totalDocs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

const createBankAccount = async (req, res) => {
  const { iban, bankName, nameSurname } = req.body;

  try {
    await Bank.create({ iban, bankName, nameSurname, active: false });

    return res.status(200).json({ msg: "change account info successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "change account info failure" });
  }
};

const changeAccountStatus = async (req, res) => {
  const { id: _id } = req.params;
  try {
    await Bank.updateMany({ $set: { active: false } });
    await Bank.updateOne({ _id }, { $set: { active: true } });

    return res.status(200).json({ msg: "request successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "request failure" });
  }
};

module.exports = {
  getAllBank,
  getActiveBank,
  createBankAccount,
  changeAccountStatus,
};
