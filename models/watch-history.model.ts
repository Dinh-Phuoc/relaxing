import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWatchHistory extends Document {
    userId: mongoose.Types.ObjectId;
    movieId: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    episodeSlug?: string;
    episodeName?: string;
    serverIndex?: number;
    progressSeconds: number;
    durationSeconds?: number;
    completed: boolean;
    lastWatchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        movieId: { type: String, required: true },
        slug: { type: String, required: true },
        source: { type: String, required: true },
        title: { type: String, required: true },
        poster: { type: String, required: true },
        episodeSlug: String,
        episodeName: String,
        serverIndex: { type: Number, default: 0 },
        progressSeconds: { type: Number, default: 0 },
        durationSeconds: Number,
        completed: { type: Boolean, default: false },
        lastWatchedAt: { type: Date, default: Date.now, index: true },
    },
    { timestamps: true },
);

WatchHistorySchema.index({ userId: 1, movieId: 1 }, { unique: true });
WatchHistorySchema.index({ userId: 1, lastWatchedAt: -1 });

const WatchHistoryModel: Model<IWatchHistory> =
    mongoose.models.WatchHistory ??
    mongoose.model<IWatchHistory>('WatchHistory', WatchHistorySchema);

export default WatchHistoryModel;
