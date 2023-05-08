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

const isThatSameDay = (dateToCheck, date) => {
  const date1 = new Date(date);
  const date2 = new Date(dateToCheck);

  if (
    date2.getDate() === date1.getDate() &&
    date2.getMonth() === date1.getMonth() &&
    date2.getFullYear() === date1.getFullYear()
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = { errHandler, randomNumberGenarator, isThatSameDay };
