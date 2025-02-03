import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON } from './utils/index.js';
// import { roles } from '../config/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email format');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // digunakan oleh plugin toJSON
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Tambahkan plugin yang mengubah mongoose menjadi JSON
userSchema.plugin(toJSON);
// userSchema.plugin(paginate);

/**
 * Periksa apakah email sudah digunakan
 * @param {string} email - Email pengguna
 * @param {mongoose.Types.ObjectId} [excludeUserId] - ID pengguna yang dikecualikan
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Periksa apakah password cocok dengan password pengguna
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * @typedef {mongoose.Model} User
 */
const User = mongoose.model('User', userSchema);

export default User;
