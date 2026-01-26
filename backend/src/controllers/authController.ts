import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import UserRole from '../models/UserRole.js';
import Role from '../models/Role.js';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roleName } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // --- SECURITY: PREVENT ADMIN REGISTRATION ---
        // Default to 'Intern' if no role or 'Admin' is requested
        let assignedRoleName = 'Intern';

        const allowedRoles = ['Employee', 'Intern'];
        if (roleName && allowedRoles.includes(roleName)) {
            assignedRoleName = roleName;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Assign the validated role
        const role = await Role.findOne({ name: assignedRoleName });
        if (role) {
            await UserRole.create({ userId: user._id, roleId: role._id });
        }

        res.status(201).json({
            message: `User registered successfully as ${assignedRoleName}`,
            user: { name, email, role: assignedRoleName }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        // Get user roles for the response
        const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');
        const roles = userRoles.map((ur: any) => ur.roleId.name);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: roles
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
