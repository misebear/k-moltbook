import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID ?? "", clientSecret: process.env.GITHUB_SECRET ?? "" }),
    Email({ server: process.env.EMAIL_SERVER ?? "", from: process.env.EMAIL_FROM ?? "" }),
  ],
  trustHost: true,
});
