export default class GetDashboardStats {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute() {
    const [activeUsers, roles, permissions] = await Promise.all([
      this.userRepository.countActiveUsers(),
      this.userRepository.countRoles(),
      this.userRepository.countPermissions(),
    ]);

    return { activeUsers, roles, permissions };
  }
}
