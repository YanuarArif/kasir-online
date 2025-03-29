"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/validate-token";
import { db } from "@/lib/prisma";

// Security improvement: Custom error class
class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

// function untuk verifikasi token verifikasi email
export const validateToken = async (email: string, token: string) => {
  try {
    // Cari token di db by Token
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      throw new TokenError("Token tidak valid");
    }

    // Verify email association
    if (existingToken.email !== email) {
      throw new TokenError("Token tidak valid untuk email ini");
    }

    // Cek apakah token expired
    const isExpired = existingToken.expires < new Date();
    if (isExpired) {
      throw new TokenError("Token sudah kadaluarsa");
    }

    // Get user
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      throw new TokenError("Email tidak ditemukan");
    }

    // Update user emailVerified
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // Delete the used token
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof TokenError) {
      throw error;
    }
    throw new Error("Gagal memverifikasi email");
  }
};
