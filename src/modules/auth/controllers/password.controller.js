const passwordService = require('../services/password.service');
const { successResponse } = require('@utils/response');

class PasswordController {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await passwordService.sendResetPasswordEmail(email);
      return successResponse(res, null, 'Password reset email sent');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await passwordService.resetPassword(token, password);
      return successResponse(res, null, 'Password reset successfully');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await passwordService.changePassword(req.user.id, oldPassword, newPassword);
      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PasswordController();
