import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";
import tokenService from "./token.service.js";

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
    isEmailVerified: profileDetail.isEmailVerified,
    roles: profileDetail.roles.map((role) => ({ name: role.name })),
  };

  return response;
};

const login = async (payload) => {
  const user = await User.findOne({ email: payload.email })
    .populate("roles")

  if (!user || !user.isPasswordMatch(payload.password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password")
  }

  const token = await tokenService.generateAuthTokens(user)

  const response = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    roles: user.roles.map((role) => ({ name: role.name })),
    token: {
      access: token.access.token,
      refresh: token.refresh.token
    }
  };

  return response;
}

export default {
  createUser,
  login
};
