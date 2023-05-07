const errHandler = (errData, res) => {
  console.log(errData);
  return res.status(errData.status).json({
    msg: errData.msg,
    status_code: errData.status_code || 0,
  });
};

const randomNumberGenarator = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return Number(result);
};

module.exports = { errHandler, randomNumberGenarator };
