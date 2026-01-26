import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    visibility: 'INTERN' | 'EMPLOYEE';
}

const ProjectSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    visibility: { type: String, enum: ['INTERN', 'EMPLOYEE'], required: true },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
