class StorageInterface {
  async upload(file, path) {
    throw new Error('Method upload() must be implemented');
  }

  async delete(path) {
    throw new Error('Method delete() must be implemented');
  }

  async get(path) {
    throw new Error('Method get() must be implemented');
  }

  async exists(path) {
    throw new Error('Method exists() must be implemented');
  }
}

module.exports = StorageInterface;
