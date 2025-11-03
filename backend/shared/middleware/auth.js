"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const authenticate = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication token required'
                }
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            logger_1.logger.error('JWT_SECRET not configured');
            return res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Authentication not configured'
                }
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.sub,
            tenantId: decoded.tenantId,
            email: decoded.email,
            roles: decoded.roles || []
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error', { error });
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid or expired token'
            }
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }
        const hasRole = allowedRoles.some(role => req.user.roles.includes(role));
        if (!hasRole) {
            logger_1.logger.warn('Authorization failed', {
                userId: req.user.id,
                requiredRoles: allowedRoles,
                userRoles: req.user.roles
            });
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                }
            });
        }
        next();
    };
};
exports.authorize = authorize;
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}
//# sourceMappingURL=auth.js.map