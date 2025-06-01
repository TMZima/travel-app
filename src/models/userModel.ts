import mongoose, { Model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  itineraries: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  resetToken: string | null;
  resetTokenExpires: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  getPaginatedFriends(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: mongoose.Types.ObjectId[];
    page: number;
    limit: number;
    total: number;
  }>;
  getPaginatedItineraries(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: mongoose.Types.ObjectId[];
    page: number;
    limit: number;
    total: number;
  }>;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (this: IUserDocument, v: string) {
          if (!this.isModified("password")) return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
            v
          );
        },
        message:
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
      },
    },
    itineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if the password is new or modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    next(
      new Error(
        "An error occurred while securing your password. Please try again."
      )
    );
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Transform the JSON response to exclude sensitive fields
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Static method to get paginated friends:
userSchema.statics.getPaginatedFriends = async function (
  userId: string,
  page = 1,
  limit = 10
) {
  const user = await this.findById(userId).populate("friends").exec();
  if (!user) return { data: [], page, limit, total: 0 };

  const total = user.friends.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedFriends = user.friends.slice(start, end);

  return {
    data: paginatedFriends,
    page,
    limit,
    total,
  };
};

// Static method to get paginated itineraries:
userSchema.statics.getPaginatedItineraries = async function (
  userId: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;

  const user = await this.findById(userId).populate({ path: "itineraries" });

  if (!user || !user.itineraries) {
    return { data: [], page, limit, total: 0 };
  }

  const total = user.itineraries.length;

  const paginatedItineraries = user.itineraries.slice(skip, skip + limit);

  return {
    data: paginatedItineraries,
    page,
    limit,
    total,
  };
};

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;
