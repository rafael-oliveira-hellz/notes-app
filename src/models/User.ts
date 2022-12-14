import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoose from '../database/connection';
import { IUser } from './interfaces/user';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified_at: {
      type: Date,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    password_reset_token: {
      type: String,
      required: false,
    },
    remember_token: {
      type: String,
      required: false,
    },
    provider_name: {
      type: String,
      required: false,
      default: null,
    },
    provider_id: {
      type: String,
      required: false,
      default: null,
    },
    profile_picture: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    role: {
      type: String,
      required: false,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLoginDate: {
      type: Date,
      required: false,
      default: null,
    },
    currentLoginDate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

userSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // delete returnedObject.password;
  },
});

userSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

/*userSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};*/

const User = mongoose.model<IUser>('User', userSchema);

export default User;
