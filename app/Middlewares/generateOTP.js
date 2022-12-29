const otpGenerator = require("otp-generator");
const { OTP_LENGTH, OTP_CONFIG } = require("../Config/auth.config");

exports.generateOTP = async () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};
