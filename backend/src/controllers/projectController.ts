import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Project from '../models/Project.js';
import UserRole from '../models/UserRole.js';

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, visibility } = req.body;
        const project = new Project({ title, description, visibility });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;
        const userRolesRaw = await UserRole.find({ userId }).populate('roleId');
        const roles = userRolesRaw.map((ur: any) => ur.roleId.name);

        let query = {};

        if (roles.includes('Admin')) {
            query = {}; // See everything
        } else if (roles.includes('Employee')) {
            query = { visibility: { $in: ['INTERN', 'EMPLOYEE'] } };
        } else if (roles.includes('Intern')) {
            query = { visibility: 'INTERN' };
        } else {
            return res.status(403).json({ message: 'No access' });
        }

        const projects = await Project.find(query);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};
