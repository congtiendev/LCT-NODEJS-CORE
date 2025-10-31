const { successResponse } = require('@utils/response');
const profileService = require('../services/profile.service');

class ProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id);
      return successResponse(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const profile = await profileService.updateProfile(req.user.id, req.body);
      return successResponse(res, profile, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const avatarUrl = await profileService.uploadAvatar(req.user.id, req.file);
      return successResponse(res, { avatar: avatarUrl }, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
