const userService = require('../services/user.service');
const { successResponse } = require('@utils/response');

class UserController {
  async getAll(req, res, next) {
    try {
      const { page, limit, search, role, status } = req.query;
      const result = await userService.getAll({ page, limit, search, role, status });
      return successResponse(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.update(id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
