import { UserRole } from "../../../database/models/account/UserRole";

export async function checkRole(userId: string, type: "user" | "escrow") {
  try {
    const userRole = await UserRole.findOne({
      where: {
        userId: userId,
        type: type,
        active: true,
      },
    });

    if (!userRole) {
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
}
