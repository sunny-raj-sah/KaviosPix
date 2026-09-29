// const generateToken = require("../utils/generateToken");

// const googleCallback = (req, res) => {
//   try {
//     const token = generateToken(req.user);

//     res.status(200).json({
//       success: true,
//       message: "Google authentication successful",
//       token,
//       user: {
//         userId: req.user.userId,
//         email: req.user.email,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to generate authentication token",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   googleCallback,
// };

// --------------------------------------------------------------
//  const generateToken = require("../utils/generateToken");

// const googleCallback = (req, res) => {
//   try {
//     const token = generateToken(req.user);

//     const user = {
//       userId: req.user.userId,
//       email: req.user.email,
//     };

//     const frontendUrl =
//       process.env.FRONTEND_URL || "http://localhost:5173";

//     const userData = encodeURIComponent(
//       JSON.stringify(user)
//     );

//     const redirectUrl =
//       `${frontendUrl}/auth/callback` +
//       `#token=${encodeURIComponent(token)}` +
//       `&user=${userData}`;

//     console.log("OAuth redirect:", redirectUrl);

//     return res.redirect(redirectUrl);
//   } catch (error) {
//     console.error(
//       "Google callback error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate authentication token",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   googleCallback,
// };

// ------------------------------------------------------
// 3
const generateToken = require("../utils/generateToken");

const googleCallback = (req, res) => {
  try {
    console.log("========== GOOGLE CALLBACK ==========");
    console.log("Authenticated user:", req.user);

    const token = generateToken(req.user);

    console.log("JWT generated:", Boolean(token));
    
  const frontendUrl =process.env.FRONTEND_URL || "http://localhost:5173";


    return res.redirect(
      `${frontendUrl}/auth/callback#token=${encodeURIComponent(
        token
      )}`
    );
  } catch (error) {
    console.error("========== GOOGLE CALLBACK ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Google callback failed",
      error: error.message,
    });
  }
};

module.exports = {
  googleCallback,
};