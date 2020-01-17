import mongoose, { Schema, Document } from 'mongoose';
import { isEmail } from 'validator';

import { generatePasswordHash } from '../helpers';

export interface IUser extends Document {
    email?: string;
    fullname?: string;
    password?: string;
    confirmed?: boolean;
    avatar?: string;
    confirm_hash?: string;
    last_seen?: Date;
}

const UserSchema = new Schema({
    email: {
        type: String,
        require: 'Email address is required',
        validate: [isEmail, 'Invalid email'],
        unique: true,
    },
    fullname: {
        type: String,
        require: 'Fullname is required',
    },
    password: {
        type: String,
        require: 'Password is required',
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    avatar: String,
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date(),
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function (next) {
    const user: any = this;

    if (!user.isModified('password')) return next();

    generatePasswordHash(user.password)
        .then(hash => {
            user.password = String(hash);
            generatePasswordHash(new Date().toString())
                .then(confirmHash => {
                    user.confirm_hash = String(confirmHash);
                    next();
                });
        })
        .catch(err => {
            next(err);
        });
});


const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;

