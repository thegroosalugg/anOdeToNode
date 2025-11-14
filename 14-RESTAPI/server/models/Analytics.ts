import { Model, model, Schema } from "mongoose";

export interface IAnalytics {
    path: string;
      ua: string;
  screen: { width: number; height: number };
}

interface IAnalyticsMethods {
  // to be continued...
}

type Analytics = Model<IAnalytics, {}, IAnalyticsMethods>;

export const analyticsSchema = new Schema<IAnalytics>(
  {
      path: { type: String, required: true },
        ua: { type: String, required: true },
    screen: { type: { width: { type: Number }, height: { type: Number } } },
  },
  { timestamps: true }
);

export default model<IAnalytics, Analytics>("Analytics", analyticsSchema);
