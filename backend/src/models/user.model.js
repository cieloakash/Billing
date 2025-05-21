import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "sales", "logistic"],
        message: "{VALUE} is not a valid role",
      },
      default: "sales",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt/updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;

// User Model (All Roles)
// const UserSchema = new Schema({
//     email: { type: String, unique: true },
//     passwordHash: String,
//     role: { type: String, enum: ['admin', 'sales', 'logistic'] },
//     isActive: { type: Boolean, default: true },
//     lastLogin: Date,
//     createdAt: { type: Date, default: Date.now }
//   });

//   // Bill Model
//   const BillSchema = new Schema({
//     billNumber: { type: String, unique: true }, // e.g., "INV-2024-1001"
//     salesUser: { type: Schema.Types.ObjectId, ref: 'User' },
//     customer: {
//       name: String,
//       contact: String,
//       deliveryAddress: String
//     },
//     items: [{
//       name: String,
//       quantity: Number,
//       price: Number
//     }],
//     totalAmount: Number,
//     status: {
//       type: String,
//       enum: ['new', 'pending', 'fulfilled', 'rescheduled'],
//       default: 'new'
//     },
//     logisticUpdates: [{
//       type: Schema.Types.ObjectId,
//       ref: 'LogisticUpdate'
//     }],
//     createdAt: { type: Date, default: Date.now }
//   });

//   // Logistic Update Model (Embedded or Separate)
//   const LogisticUpdateSchema = new Schema({
//     bill: { type: Schema.Types.ObjectId, ref: 'Bill' },
//     updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//     status: String,
//     driverName: String,
//     vehicleNumber: String,
//     remarks: String,
//     scheduledDate: Date, // For rescheduled bills
//     timestamp: { type: Date, default: Date.now }
//   });
