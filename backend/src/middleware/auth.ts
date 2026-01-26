import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';
import RolePermission from '../models/RolePermission.js';
import Permission from '../models/Permission.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const requirePermission = (permissionName: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // 1. Get user roles
            const userRoles = await UserRole.find({ userId: req.user._id }).populate({ path: 'roleId', model: Role });

            if (!userRoles || userRoles.length === 0) {
                console.log(`[RBAC] User ${req.user.email} has no roles assigned.`);
                return res.status(403).json({ message: 'Forbidden: No roles assigned' });
            }

            for (const userRole of userRoles) {
                const role: any = userRole.roleId;
                if (!role) {
                    console.log(`[RBAC] UserRole ${userRole._id} has a null roleId.`);
                    continue;
                }

                // 2. Get permissions for each role
                const rolePermissions = await RolePermission.find({ roleId: role._id }).populate({ path: 'permissionId', model: Permission });

                for (const rolePerm of rolePermissions) {
                    const permission: any = rolePerm.permissionId;
                    if (!permission) {
                        console.log(`[RBAC] RolePermission ${rolePerm._id} has a null permissionId.`);
                        continue;
                    }

                    if (permission.name === permissionName) {
                        return next(); // Permission found!
                    }
                }
            }

            console.log(`[RBAC] User ${req.user.email} lacks permission: ${permissionName}`);
            res.status(403).json({ message: `Forbidden: Missing permission ${permissionName}` });
        } catch (error: any) {
            console.error('[RBAC] Error in requirePermission middleware:', error);
            res.status(500).json({
                message: `Server error in RBAC middleware: ${error.message}`,
                error: error.message
            });
        }

    };
};

