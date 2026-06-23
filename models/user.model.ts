import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    username: string;
    passwordHash: string;
    avatar?: string;
    role: 'user' | 'admin' | 'moderator';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
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
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },
    },
    { timestamps: true },
);

const UserModel: Model<IUser> =
    mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

export default UserModel;
