import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    diagonsedwith: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    bloodGroup: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "CUSTOM"],
      required: true,
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamps: true }
);
export const Patient = mongoose.model("Patient", patientSchema);
