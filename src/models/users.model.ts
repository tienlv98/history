/* eslint-disable @typescript-eslint/no-unused-vars */
import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

// Unique Index
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    expiredDate: {
      type: Date,
    },
  },
  { versionKey: false, timestamps: true },
);

// Regular indexes
const UserSchemaRegular: Schema = new Schema({
  email: {
    type: String,
    index: true,
  },
});

// Sparse Index for case search not null value this field
const UserSchemaSpare: Schema = new Schema({
  email: {
    type: String,
    sparse: true,
  },
});

// Compound Index
UserSchema.index({ email: 1, password: 1 }, { unique: true });
// TTL Index for a case temporary fields
UserSchema.index({ expiredDate: 1 }, { expireAfterSeconds: 3600 });
// Text Index for a case want to search text
UserSchema.index({ email: 'text' });
// find({$text: {$search: "abc@gmail.com"}).pretty()

export const UserModel = model<User & Document>('User', UserSchema);
