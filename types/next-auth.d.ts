import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    name: string;
    role: string;
  }

  interface JWT {
    id: string;
    name: string;
    role: string;
  }
}
