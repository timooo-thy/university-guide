import { config } from "dotenv"; // Importing dotenv for environment variable configuration
config(); // Configuring dotenv
import SibApiV3Sdk from "sib-api-v3-sdk"; // Importing SendinBlue SDK
import UserModel from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Sends a reset password link to the user's email.
 * @function
 * @async
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object to send back the result.
 * @throws {Error} When there's an issue sending the reset password email.
 */
async function sendForgetPassword(req, res) {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Missing email field." });
  }

  const user = await UserModel.findOne({
    "particulars.email": email,
    googleId: { $exists: false },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "User not found or user registered via Google OAuth." });
  }

  const resetToken = uuidv4();

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000);

  await user.save();

  const resetLink = `https://www.sguniguide.tech/reset-password/${resetToken}`;

  let forgetPasswordEmail = {
    to: [
      {
        email: email,
      },
    ],
    templateId: 4,
    params: { link: resetLink },
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
  };

  try {
    await apiInstance.sendTransacEmail(forgetPasswordEmail);
    res
      .status(200)
      .json({
        message: "A link to reset password has been sent to your email.",
      });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

/**
 * Verifies if the provided reset token is valid and not expired.
 * @function
 * @async
 * @param {Object} req - The request object containing the token as a parameter.
 * @param {Object} res - The response object to send back the result.
 */
async function verifyResetToken(req, res) {
  const { token } = req.params;

  const user = await UserModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      isValid: false,
      message: "Reset token is invalid or has expired.",
    });
  }

  return res.status(200).json({
    isValid: true,
    message: "Token is valid. You can now reset your password.",
  });
}

/**
 * Resets the user's password with the new provided one.
 * @function
 * @async
 * @param {Object} req - The request object containing the token and the new password.
 * @param {Object} res - The response object to send back the result.
 * @throws {Error} When there's an issue resetting the password.
 */
async function resetPassword(req, res) {
  const { token, password } = req.body;

  const user = await UserModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      error: "Reset token is invalid or has expired.",
    });
  }

  user.setPassword(password, async (err) => {
    if (err) {
      return res.status(500).json({
        error: "Error setting new password.",
      });
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful!",
    });
  });
}

export default { sendForgetPassword, verifyResetToken, resetPassword };
