import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserCreatedBy {
    userId: mongoose.Types.ObjectId;
    username: string;
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    passwordHash: string;
    avatar?: string;
    role: 'user' | 'admin' | 'moderator' | 'super-admin';
    isActive: boolean;
    createdBy?: IUserCreatedBy | null;
    createdAt: Date;
    updatedAt: Date;
}

const CreatedBySchema = new Schema<IUserCreatedBy>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        username: { type: String, required: true, trim: true },
    },
    { _id: false },
);

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator', 'super-admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: CreatedBySchema,
            default: null,
        },
    },
    { timestamps: true },
);

UserSchema.index({ 'createdBy.userId': 1 });

const UserModel: Model<IUser> =
    mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

export default UserModel;
