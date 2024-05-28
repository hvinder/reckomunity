const { User } = require("../model");

const verifyUser = async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.get("user_id") || 0 },
  });
  if (!user) return res.status(401).end();
  req.user = user;
  next();
};

module.exports = { verifyUser };
