import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFavorite extends Document {
    userId: mongoose.Types.ObjectId;
    movieId: string;
    slug: string;
    source: string;
    title: string;
    poster: string;
    year?: number;
    createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
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
        year: Number,
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

FavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const FavoriteModel: Model<IFavorite> =
    mongoose.models.Favorite ?? mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default FavoriteModel;
