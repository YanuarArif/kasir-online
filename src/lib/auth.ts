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
    jwt({ token, user }) {
      // Ensure user and user.id exist before assigning
      if (user?.id) {
        token.sub = user.id; // 'sub' is the standard JWT claim for subject (user ID)
        token.role = user.role; // Add role if it exists on the user object
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
      return session;
    },

    // Callback untuk menambahkan logika tambahan setelah autentikasi berhasil
    async signIn({ user, account }) {
      // Block Google login if email exists but isn't verified
      if (account?.provider === "google") {
        const existingUser = await database.user.findUnique({
          where: { email: user.email! },
        });

        if (
          existingUser &&
          existingUser.provider === "credentials" &&
          !existingUser.emailVerified
        ) {
          await database.user.update({
            where: { id: existingUser.id },
            data: {
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
  },
});
