import { db } from "../lib/prisma";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    console.log("Error getting verification token:", error);
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    console.log("Error getting verification token:", error);
  }
};
