import mongoose from "mongoose";

const madicalRecordSchema = new mongoose.Schema({}, { timestamps: true });

export const MadicalRecord = mongoose.model(
  "MadicalRecord",
  madicalRecordSchema
);
