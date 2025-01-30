import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import { withAuth } from "next-auth/middleware";
import { getSession } from "next-auth/react";
import { sendVerificationRequest } from "@/server/mfa";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export const config = {
  matcher: ["/api/auth/:path*"],
};

export default withAuth({
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const session = await getSession();
      if (session && session.user) {
        // Send MFA verification request
        await sendVerificationRequest(session.user.email);
      }
      return true;
    },
  },
});
