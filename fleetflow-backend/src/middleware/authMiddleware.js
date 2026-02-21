const admin = require('../config/firebase');
const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Sync/Check User in Database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (!user) {
        // Auto-create user on first login
      user = await prisma.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || `${decodedToken.uid}@example.com`,
          name: decodedToken.name || 'User',
          role: decodedToken.role || 'MANAGER' // Default role or from custom claims
        }
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.dbUser.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
