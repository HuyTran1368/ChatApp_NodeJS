const { HttpResponseError } = require("../../utils/Response/http.response");
const { HttpStatus } = require("../../constants/app.constant");
const mimeVaildator = require("../../utils/Validators/image/mime.validator");
const formidable = require("formidable");
// const mv = require("mv");
const { ValidationMessage } = require("../../constants/app.constant");
const fs = require("fs");

module.exports = async (req, res, next) => {
  const form = formidable.IncomingForm();

  await form.parse(req, (err, fields, files) => {
    if (files && files.avatar.size) {
      let source = files.avatar.path;
      // let target = `${__dirname}/../../public/uploads/users/${files.avatar.name}`;

      const validateMIME = mimeVaildator(source);

      //check mime type
      if (!validateMIME.ok)
        return HttpResponseError(
          res,
          HttpStatus.BAD_REQUEST,
          ValidationMessage.MIME_TYPE
        );

      //check file size: <=5MB
      if (files.avatar.size > 5242880)
        return HttpResponseError(
          res,
          HttpStatus.BAD_REQUEST,
          ValidationMessage.AVATAR_SIZE
        );

      // mv(source, target, (err) => {
      //   if (err)
      //     return HttpResponseError(res, HttpStatus.BAD_REQUEST, err.stack);

      //   req.target = target;

      //   next();
      // });

      req.source = fs.readFileSync(source);

      next();
    } else
      return HttpResponseError(
        res,
        HttpStatus.BAD_REQUEST,
        ValidationMessage.REQUIRED
      );
  });
};
