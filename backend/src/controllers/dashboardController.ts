import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import TaskReview from '../models/TaskReview.js';
import UserRole from '../models/UserRole.js';

const gradePoints: { [key: string]: number } = {
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1,
    'X': 0
};

export const getUserDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        // Get user tasks
        const tasks = await Task.find({ assignedTo: userId }).populate('projectId');

        // Get grades for these tasks
        const taskIds = tasks.map((t: any) => t._id);
        const reviews = await TaskReview.find({ taskId: { $in: taskIds } });

        // Calculate average grade
        let totalPoints = 0;
        let reviewCount = 0;
        const grades = reviews.map((r: any) => {
            totalPoints += gradePoints[r.grade] || 0;
            reviewCount++;
            return { taskId: r.taskId, grade: r.grade };
        });

        const averageGrade = reviewCount > 0 ? (totalPoints / reviewCount).toFixed(2) : 'N/A';

        res.json({
            tasks,
            grades,
            averageGrade
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user dashboard' });
    }
};

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
    try {
        // 1. All users with their roles
        const users = await User.find().select('-password');
        const usersWithRoles = await Promise.all(users.map(async (user: any) => {
            const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');

            // Calculate average grade for this user
            const userTasks = await Task.find({ assignedTo: user._id });
            const userTaskIds = userTasks.map((t: any) => t._id);
            const userReviews = await TaskReview.find({ taskId: { $in: userTaskIds } });

            let totalPoints = 0;
            userReviews.forEach((r: any) => { totalPoints += gradePoints[r.grade] || 0; });
            const averageGrade = userReviews.length > 0 ? (totalPoints / userReviews.length).toFixed(2) : 'N/A';

            return {
                ...user.toObject(),
                roles: userRoles.map((ur: any) => ur.roleId.name),
                averageGrade
            };
        }));

        // 2. Leaderboard: Users sorted by average grade
        const leaderboard = usersWithRoles
            .filter((u: any) => u.averageGrade !== 'N/A')
            .sort((a: any, b: any) => parseFloat(b.averageGrade) - parseFloat(a.averageGrade));

        // 3. Global stats
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'COMPLETED' });
        const pendingTasks = await Task.countDocuments({ status: 'PENDING' });

        res.json({
            users: usersWithRoles,
            leaderboard,
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin dashboard' });
    }
};
