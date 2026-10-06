export default function createDashboardController({ getDashboardStats }) {
  return {
    stats: async (_req, res, next) => {
      try {
        res.json(await getDashboardStats.execute());
      } catch (error) {
        next(error);
      }
    },
  };
}
