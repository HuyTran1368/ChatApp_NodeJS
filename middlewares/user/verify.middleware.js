const { HttpResponseError } = require("../../utils/Response/http.response");
const { HttpStatus } = require("../../constants/app.constant");
const {
  updateInfoValidator,
} = require("../../utils/Validators/user/user.validator");
const { verifyUpload } = require("../file/verify.middleware");

module.exports.verifyUpdateAvatar = async (req, res, next) => {
  verifyUpload(req, res, next, "avatar_photo", 1048576);
};

module.exports.verifyUpdateCover = async (req, res, next) => {
  verifyUpload(req, res, next, "cover_photo", 1048576);
};

//TODO xem xét: gộp update info với avatar vào 1, trong middleware update avatar khi ko chọn file thì next(),
//TODO trong hàm controller update: update theo req.body, tức là tự động match dữ liệu, cái nào có thì update k thì thôi

module.exports.verifyUpdateInfo = async (req, res, next) => {
  const { error } = updateInfoValidator(req.body);

  if (error)
    return HttpResponseError(res, HttpStatus.BAD_REQUEST, error.details);

  next();
};
