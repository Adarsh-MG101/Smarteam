import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Role from './models/Role.js';
import Permission from './models/Permission.js';
import RolePermission from './models/RolePermission.js';
import User from './models/User.js';
import UserRole from './models/UserRole.js';

dotenv.config();

const permissions = [
    'CREATE_PROJECT',
    'VIEW_ALL_PROJECTS',
    'CREATE_TASK',
    'UPDATE_TASK_STATUS',
    'REVIEW_TASK',
    'VIEW_DASHBOARD'
];

const roles = [
    {
        name: 'Admin',
        permissions: [
            'CREATE_PROJECT',
            'VIEW_ALL_PROJECTS',
            'CREATE_TASK',
            'UPDATE_TASK_STATUS',
            'REVIEW_TASK',
            'VIEW_DASHBOARD'
        ]
    },
    {
        name: 'Employee',
        permissions: [
            'CREATE_TASK',
            'UPDATE_TASK_STATUS',
            'VIEW_DASHBOARD'
        ]
    },
    {
        name: 'Intern',
        permissions: [
            'UPDATE_TASK_STATUS',
            'VIEW_DASHBOARD'
        ]
    }
];

const seed = async () => {
    try {
        console.log('--- Seeding Started ---');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing data
        await UserRole.deleteMany({});
        await User.deleteMany({});
        await RolePermission.deleteMany({});
        await Role.deleteMany({});
        await Permission.deleteMany({});
        console.log('Cleared existing data');

        // Create permissions
        const createdPermissions: any = {};
        for (const pName of permissions) {
            const p = await Permission.create({ name: pName });
            createdPermissions[pName] = p._id;
            console.log(`Created Permission: ${pName}`);
        }

        // Create roles and link permissions
        const createdRoles: any = {};
        for (const r of roles) {
            const role = await Role.create({ name: r.name });
            createdRoles[r.name] = role._id;
            console.log(`Created Role: ${r.name}`);
            for (const pName of r.permissions) {
                await RolePermission.create({
                    roleId: role._id,
                    permissionId: createdPermissions[pName]
                });
                console.log(`Linked ${pName} to ${r.name}`);
            }
        }

        // Create Default Admin User
        const adminEmail = process.env.ADMIN_EMAIL as string;
        const adminPassword = process.env.ADMIN_PASSWORD as string;
        console.log(`Target Admin Email: ${adminEmail}`);

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword
        });
        console.log(`Created User: ${adminEmail} (ID: ${adminUser._id})`);

        // Assign Admin Role to the default user
        await UserRole.create({
            userId: adminUser._id,
            roleId: createdRoles['Admin']
        });
        console.log(`Assigned Admin role to ${adminEmail}`);

        console.log('-----------------------------------------');
        console.log('Seeding completed successfully!');
        console.log('-----------------------------------------');

        process.exit(0);
    } catch (error: any) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();

