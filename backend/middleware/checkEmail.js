module.exports = (req, res, next) => {
  const validEmail = (email) => {
    let emailRegexp =
      /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
    let isRegexTrue = emailRegexp.test(email);
    isRegexTrue
      ? next()
      : res.status(400).json({ message: "Mail non conforme" });
  };
  validEmail(req.body.email);
};
