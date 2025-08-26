import mongoose, { Schema, Document } from "mongoose";

export interface ILeader extends Document {
  leaderId: string;
  name: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderSchema = new Schema(
  {
    leaderId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Leader = mongoose.model<ILeader>("Leaders", LeaderSchema);
export type LeaderDocument = ILeader & Document;