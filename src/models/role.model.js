import mongoose from "mongoose";

export const RolesEnum = {
    USER: "ROLE_USER",
    ADMIN: "ROLE_ADMIN",
    MODERATOR: "ROLE_MODERATOR"
}

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: Object.values(RolesEnum)
  },
});


const Role = mongoose.model("Role", roleSchema)

export default Role;