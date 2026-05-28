import { Types } from "mongoose";
import User from "./user.model";

export type UpdateMyProfileInput = {
  name?: string;
  jobTitle?: string;
  bio?: string;
  avatar?: string;
  theme?: string;
  publicProfile?: boolean;
  usageData?: boolean;
};

export function normalizeEmail(email: unknown): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export async function findUserByEmail(emailRaw: unknown) {
  const normalized = normalizeEmail(emailRaw);
  if (!normalized) return null;
  const exact = await User.findOne({ email: normalized });
  if (exact) return exact;
  return User.findOne({
    $expr: { $eq: [{ $toLower: "$email" }, normalized] },
  });
}

export async function listUsers() {
  return User.find()
    .select("-password -passwordResetToken -passwordResetExpires")
    .populate("tenant", "name slug")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getMyProfile(userId: Types.ObjectId | string) {
  return User.findById(userId)
    .select("-password -passwordResetToken -passwordResetExpires")
    .populate("tenant", "name slug")
    .lean();
}

export async function updateMyProfile(
  userId: Types.ObjectId | string,
  payload: UpdateMyProfileInput,
) {
  const update: Record<string, unknown> = {};
  if (typeof payload.name === "string") update.name = payload.name;
  if (typeof payload.jobTitle === "string") update.jobTitle = payload.jobTitle;
  if (typeof payload.bio === "string") update.bio = payload.bio;
  if (typeof payload.avatar === "string") update.avatar = payload.avatar;
  if (typeof payload.theme === "string") update.theme = payload.theme;
  if (typeof payload.publicProfile === "boolean")
    update.publicProfile = payload.publicProfile;
  if (typeof payload.usageData === "boolean")
    update.usageData = payload.usageData;
  return User.findByIdAndUpdate(
    userId,
    { $set: update },
    {
      new: true,
      runValidators: true,
      select: "-password -passwordResetToken -passwordResetExpires",
    },
  ).lean();
}
