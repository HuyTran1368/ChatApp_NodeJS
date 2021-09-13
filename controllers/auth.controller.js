const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const {
  registerValidator,
  emailExistsValidator,
  comparePwdValidator,
  loginValidator,
} = require("../utils/Validators/auth.validator");
const {
  HttpResponse,
  HttpResponseError,
} = require("../utils/Response/http.response");
const { HttpStatus, ResponseMessage } = require("../constants/app.constant");
const _CONF = require("../config/app");

module.exports.create = (req, res) => {
  return res.render("user/register");
};

module.exports.register = async (req, res) => {
  const data = { ...req.body };

  //validate
  const { error } = registerValidator(req.body);

  if (error)
    return HttpResponseError(res, HttpStatus.BAD_REQUEST, error.details);

  const _emailExists = await emailExistsValidator(data.email);

  if (_emailExists)
    return HttpResponseError(
      res,
      HttpStatus.BAD_REQUEST,
      ResponseMessage.EMAIL_ALREADY_EXISTS
    );

  try {
    let user = await new User(data).save();

    return HttpResponse(res, HttpStatus.CREATED, user);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.BAD_REQUEST, err.message);
  }
};

module.exports.login = async (req, res) => {
  const data = { ...req.body } || { ...req.decoded };

  const { error } = loginValidator(data);

  if (error)
    return HttpResponseError(res, HttpStatus.BAD_REQUEST, error.details);

  const _emailExists = await emailExistsValidator(data.email);

  if (_emailExists) {
    let user = await User.findEmail(data.email);

    let isPassed = await comparePwdValidator(data.password, user.password);

    if (isPassed) {
      const token = jwt.sign({ user }, _CONF.TOKEN_SECRET);

      if (data.remember_me === "true")
        await res.cookie("token", token, { signed: true });

      req.session.token = token;

      return HttpResponse(res, HttpStatus.OK, user);
    } else
      return HttpResponseError(
        res,
        HttpStatus.BAD_REQUEST,
        ResponseMessage.INCORRECT_PASSWORD
      );
  } else
    return HttpResponseError(
      res,
      HttpStatus.BAD_REQUEST,
      ResponseMessage.INCORRECT_EMAIL
    );
};
