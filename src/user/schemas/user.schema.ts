import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fname: string;

  @Prop({ required: true })
  lname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.Student })
  role: string;

  // for enrolled courses
  @Prop({ default: [], type: [Types.ObjectId], ref: 'Course' })
  enrolledCourses: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
