//local import
const Photo = require("../models/photo");
const { errHandler } = require("../utils/helper");

//routes
const photoGet = async (req, res) => {
  try {
    const data = await Photo.find();
    return res.status(200).json(...data);
  } catch (err) {
    console.log(err);
    errHandler({ status: 500, msg: "photoGet failed" }, res);
  }
};

const photoCreate = async (req, res) => {
  const { photoUrls, links } = req.body;
  try {
    await Photo.create({ photoUrls, links });

    return res.status(201).json({ msg: "photo create succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "photo create failure" });
  }
};

const photoUpdate = async (req, res) => {
  const { id: _id } = req.params;
  const { photoUrls, links } = req.body;

  try {
    await Photo.updateOne({ _id }, { $set: { photoUrls, links } });

    return res.status(201).json({ msg: "user create succesfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "user create failure" });
  }
};

module.exports = {
  photoGet,
  photoCreate,
  photoUpdate,
};
