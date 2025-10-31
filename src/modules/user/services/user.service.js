const userRepository = require('../repositories/user.repository');
const AppException = require('@exceptions/app.exception');
const { hashPassword } = require('@utils/crypto');
const { paginate } = require('@helpers/pagination.helper');

class UserService {
  async getAll(params) {
    const { page = 1, limit = 20, search, role, status } = params;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const result = await userRepository.findMany({
      where,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return paginate(result.data, result.total, parseInt(page), parseInt(limit));
  }

  async getById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    return user;
  }

  async create(data) {
    const { email, password, name, role } = data;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppException('Email already exists', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'USER',
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id, data) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppException('Email already exists', 400);
      }
    }

    const updatedUser = await userRepository.update(id, data);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    await userRepository.delete(id);
  }
}

module.exports = new UserService();
