import NavigationHandler from "@/ui/navigationBar";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (session?.user && ["admin", "staff"].includes(session.user.role))
    return <NavigationHandler children={children} user={session.user} />;
  else return redirect("/signin");
}
