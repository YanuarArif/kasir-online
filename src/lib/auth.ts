import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db as database } from "./prisma";
import { Role } from "@prisma/client";
import { hasPermission } from "./rbac";

const combinedProviders = [
  ...authConfig.providers,
  Resend({
    from: "updates.example.com",
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: combinedProviders,
  adapter: PrismaAdapter(database),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Callbacks untuk pengganti middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isAuthRoute = [
        "/login",
        "/register",
        "/send-verification",
        "/verification-email",
      ].includes(pathname);
      const protectedRoutes = ["/dashboard", "/user"];

      // Redirect authenticated users away from auth routes
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Redirect unauthenticated users to login
      if (
        !isLoggedIn &&
        protectedRoutes.some((route) => pathname.startsWith(route))
      ) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      // Check role-based permissions for authenticated users
      if (isLoggedIn && pathname.startsWith("/dashboard")) {
        const userRole = auth.user?.role as Role;

        // If user doesn't have permission for this page, redirect to dashboard
        if (!hasPermission(userRole, pathname)) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      return true;
    },

    // Add user ID and role to the JWT
    async jwt({ token, user, account, trigger }) {
      // Ensure user and user.id exist before assigning
      if (user?.id) {
        token.sub = user.id; // 'sub' is the standard JWT claim for subject (user ID)

        // Add role if it exists on the user object, otherwise default to OWNER
        // This ensures Google OAuth users always have a role
        token.role = user.role || Role.OWNER;

        // For Google OAuth users, ensure role is set in the database
        if (account?.provider === "google" && !user.role) {
          try {
            // Try to update the user record with the OWNER role
            await database.user.update({
              where: { id: user.id },
              data: {
                role: Role.OWNER,
                provider: "google",
              },
            });
          } catch (error) {
            console.error("Error updating user role:", error);
            // Even if the update fails, we'll still set the role in the token
          }
        }

        // Add employee-specific data if this is an employee login
        if (user.isEmployee) {
          token.isEmployee = true;
          token.ownerId = user.ownerId;
          token.employeeId = user.employeeId;
        }
      }

      // If this is a token update (not initial sign-in)
      if (trigger === "update" && token.sub) {
        // Fetch the latest user data from the database
        const latestUser = await database.user.findUnique({
          where: { id: token.sub },
        });

        // Update the token with the latest role if available
        if (latestUser?.role) {
          token.role = latestUser.role;
        }
      }

      return token;
    },

    // Add user ID and role to the session object from the JWT
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // Add ID to session.user
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role; // Add role to session.user
      }

      // Add employee-specific data if this is an employee login
      if (token.isEmployee && session.user) {
        session.user.isEmployee = true;
        session.user.ownerId = token.ownerId as string;
        session.user.employeeId = token.employeeId as string;
      }

      return session;
    },

    // Callback untuk menambahkan logika tambahan setelah autentikasi berhasil
    async signIn({ user, account }) {
      // For existing users with credentials provider, verify their email if they sign in with Google
      if (account?.provider === "google" && user.email) {
        const existingUser = await database.user.findUnique({
          where: { email: user.email },
        });

        // If user exists but was created with credentials and email isn't verified
        if (
          existingUser &&
          existingUser.provider === "credentials" &&
          !existingUser.emailVerified
        ) {
          try {
            await database.user.update({
              where: { id: existingUser.id },
              data: {
                emailVerified: new Date(),
              },
            });
          } catch (error) {
            console.error("Error updating email verification status:", error);
          }
        }
      }
      return true;
    },
  },
});
