import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";

const createUser = async (payload) => {
  if (await User.isEmailTaken(payload.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  let roles = [];
  if (payload.roles && payload.roles.length > 0) {
    const validRoles = await Role.find({ _id: { $in: payload.roles } });

    if (validRoles.length !== payload.roles.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid roles provided");
    }

    roles = validRoles.map((role) => role._id);
  } else {
    const userRole = await Role.findOne({ name: "ROLE_USER" });
    if (userRole) {
      roles.push(userRole._id);
    }
  }

  const user = await User.create({ ...payload, roles });

  const profileDetail = await User.findById(user._id)
    .populate("roles")
    .lean();

  const response = {
    id: profileDetail._id,
    name: profileDetail.name,
    email: profileDetail.email,
    roles: profileDetail.roles.map((role) => ({ name: role.name })),
    isEmailVerified: profileDetail.isEmailVerified,
  };

  return response;
};

export default {
  createUser,
};
