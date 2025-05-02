import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

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
        validator: function (v: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
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
        default: [],
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
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

// Transform the JSON response to exclude sensitive fields
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password; // Remove password from the JSON response
    delete ret.__v; // Remove version key
    return ret;
  },
});

// Static method to get paginated friends:
userSchema.statics.getPaginatedFriends = async function (
  userId: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;

  // Get the total count of friends
  const total = await this.countDocuments({ _id: userId });

  // Get paginated friends
  const paginatedFriends = await this.findById(userId)
    .populate({
      path: "friends",
      options: { limit, skip },
    })
    .exec();

  return {
    data: paginatedFriends ? paginatedFriends.friends : [],
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

  // Get the total count of itineraries
  const total = await this.countDocuments({ _id: userId });

  // Get paginated itineraries
  const paginatedItineraries = await this.findById(userId)
    .populate({
      path: "itineraries",
      options: { limit, skip },
    })
    .exec();

  return {
    data: paginatedItineraries ? paginatedItineraries.itineraries : [],
    page,
    limit,
    total,
  };
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
