export default function createAuthController({ loginUser, userRepository }) {
  return {
    login: async (req, res, next) => {
      try {
        const result = await loginUser.execute(req.validatedBody);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    me: async (req, res) => {
      res.json({ user: req.auth });
    },

    logout: async (req, res, next) => {
      try {
        // Revoca todos los tokens anteriores del usuario.
        await userRepository.incrementTokenVersion(req.auth.userId);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  };
}
