import mongoose from "mongoose";
import { Password } from "../services/password";

enum usertype {
  seller = "seller",
  buyer = "buyer",
}

// Creating interface
interface UserAttrs {
  email: string;
  password: string;
  usertype: usertype;
  permissions: object;
}

// An interface descript the properties that a user document pass
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  usertype: usertype;
  permissions: object;
  //permission: object;
}

// An interface define build function is available to the model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Create schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    usertype: {
      type: String,
      enum: Object.values(usertype),
      required: true,
    },
    permissions: {
      type: Array,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Before saving the document just hash the password
userSchema.pre("save", async function (done) {
  // Check if password is modified
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  // Call the done function
  done();
});

// Build
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Create mongoose model
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
