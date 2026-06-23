import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMovieCache extends Document {
    key: string;
    data: unknown;
    expiresAt: Date;
    createdAt: Date;
}

const MovieCacheSchema = new Schema<IMovieCache>(
    {
        key: { type: String, required: true, unique: true, index: true },
        data: { type: Schema.Types.Mixed, required: true },
        expiresAt: {
            type: Date,
            required: true,
            index: { expireAfterSeconds: 0 },
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

const MovieCacheModel: Model<IMovieCache> =
    mongoose.models.MovieCache ??
    mongoose.model<IMovieCache>('MovieCache', MovieCacheSchema);

export default MovieCacheModel;
