import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RiderDocument = HydratedDocument<Rider>;

@Schema()
export class Rider {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false, minLength: 6, maxLength: 20 })
  password: string;
}

export const RiderSchema = SchemaFactory.createForClass(Rider);
