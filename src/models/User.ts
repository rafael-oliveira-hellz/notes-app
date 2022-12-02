import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IUser } from "./interfaces/user";

const userSchema = new mongoose.Schema<IUser>({  
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
  },
  provider_id: {
    type: String,
    required: false,
  },
  profile_picture: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { 
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

userSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
}

const User = mongoose.model('User', userSchema);

export default User;