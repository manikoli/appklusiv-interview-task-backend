import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
