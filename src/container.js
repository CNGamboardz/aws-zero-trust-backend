import LoginUser from './application/use-cases/LoginUser.js';
import GetDashboardStats from './application/use-cases/GetDashboardStats.js';
import pool from './infrastructure/db/mysqlPool.js';
import MySqlUserRepository from './infrastructure/repositories/MySqlUserRepository.js';
import BcryptPasswordHasher from './infrastructure/security/BcryptPasswordHasher.js';
import JwtTokenService from './infrastructure/security/JwtTokenService.js';
import authenticateFactory from './interfaces/http/middlewares/authenticate.js';
import createAuthController from './interfaces/http/controllers/authController.js';
import createDashboardController from './interfaces/http/controllers/dashboardController.js';

const userRepository = new MySqlUserRepository(pool);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const loginUser = new LoginUser({ userRepository, passwordHasher, tokenService });
const getDashboardStats = new GetDashboardStats({ userRepository });
const authenticate = authenticateFactory({ tokenService, userRepository });
const authController = createAuthController({ loginUser, userRepository });
const dashboardController = createDashboardController({ getDashboardStats });

export const container = {
  pool,
  userRepository,
  passwordHasher,
  tokenService,
  loginUser,
  getDashboardStats,
  authenticate,
  authController,
  dashboardController,
};
