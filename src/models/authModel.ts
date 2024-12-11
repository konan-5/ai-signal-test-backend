import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string | null;
    verification: boolean;
    google_id: string | null;
    created_unix: number;
}

const userSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        verification: { type: Boolean, default: false },
        google_id: { type: String, default: null },
        created_unix: { type: Number, default: Date.now },
    }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
