import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskReview extends Document {
    taskId: mongoose.Types.ObjectId;
    grade: 'A' | 'B' | 'C' | 'D' | 'X';
    comments?: string;
}

const TaskReviewSchema: Schema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, unique: true },
    grade: { type: String, enum: ['A', 'B', 'C', 'D', 'X'], required: true },
    comments: { type: String },
});

export default mongoose.model<ITaskReview>('TaskReview', TaskReviewSchema);
