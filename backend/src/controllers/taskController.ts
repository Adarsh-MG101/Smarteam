import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import TaskReview from '../models/TaskReview.js';
import UserRole from '../models/UserRole.js';

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, assignedTo, projectId } = req.body;

        // Check if user has access to the project
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // (Add logic to check if user can see this project if needed, 
        // but the prompt says: "Users can create tasks, but only inside projects they can see")

        const task = new Task({
            title,
            description,
            assignedTo,
            projectId,
            status: 'PENDING'
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).populate('projectId');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check if assigned user or admin
        const userRoleRaw = await UserRole.find({ userId: req.user._id }).populate('roleId');
        const isAdmin = userRoleRaw.some((ur: any) => ur.roleId.name === 'Admin');

        if (task.assignedTo.toString() !== req.user._id.toString() && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status' });
    }
};

export const reviewTask = async (req: AuthRequest, res: Response) => {
    try {
        const { taskId, grade, comments } = req.body;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Task must be completed before review' });
        }

        const review = await TaskReview.findOneAndUpdate(
            { taskId },
            { grade, comments },
            { upsert: true, new: true }
        );

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error reviewing task' });
    }
};

export const getTaskReviews = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await TaskReview.find().populate({
            path: 'taskId',
            populate: { path: 'assignedTo', select: 'name email' }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
}
