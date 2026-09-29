const User = require("../models/User");

const createUser = async (req, res) => {
try {
const { email } = req.body;


const user = await User.create({
  email,
});

res.status(201).json({
  success: true,
  message: "User created successfully",
  data: user,
});


} catch (error) {
res.status(500).json({
success: false,
message: "Failed to create user",
error: error.message,
});
}
};


const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      userId: req.user.userId,
      email: req.user.email,
    },
  });
};

 
module.exports = {
createUser,
getCurrentUser ,
};
