import NotFound from "@/app/not-found";
import ActivityList from "@/components/(dashboard)/dashboard/activities/list";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "staff"].includes(session.user.role)) {
    return <NotFound />;
  }

  return <ActivityList user={session.user} />;
}

export default Page;
