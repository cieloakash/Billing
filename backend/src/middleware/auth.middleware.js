import jwt from "jsonwebtoken";

export const protectedRoute = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const cookieString =req.headers.cookie;
      console.log(cookieString);
      
      const token = cookieString?.split("; ") // Split multiple cookies
  .find(cookie => cookie.startsWith("jwtoken=")) // Find the specific cookie
  ?.split("=")[1] || null;

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No Token Provided" });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      if (!decode || !decode.id || !decode.role) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid Token"
        });
      }
    
      const userRole = decode.role.toLowerCase();
      req.user = {
        id: decode.id.toString(),
        role: userRole,
        username:decode.username.toUpperCase()
      };
      if (allowedRoles.length > 0) {
        const normalizedRoles = allowedRoles.map((r) => r.toLowerCase());
        if (!normalizedRoles.includes(userRole)) {
          console.log(userRole);
          
          return res.status(403).json({
            success: false,
            message: `Access forbidden. Required roles: ${allowedRoles.join(", ")}`,
            yourRole: userRole,
          });
        }
      }
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid Token"
        });
      }
      // Other errors
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Authentication failed"
      });
    
    }
  };
};
