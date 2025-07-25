import { redirect } from "next/navigation";
import { getUser } from "@lib/auth";
import ProfileTabs from "@components/pages/account/profile/tabs";
import Loading from "@components/common/loading";
import ErrorPage from "@components/common/error";

export const metadata = {
  title: "Profile - Classigoo",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  // const session = await auth0.getSession();
  const user = await getUser();
  if (!user || (user.status === "error" && user.message === "Unauthorized")) {
    redirect("/api/logout");
  }

  // const { data, loading, error } = await getClient().query({
  //   query: GET_PROFILE,
  //   variables: { id: session.user.sub },
  // });


  // if (loading) {
  //   return <Loading />;
  // }

  // if (error) {
  //   return <ErrorPage message={error.message} />;
  // }

  const profileData = user;

  return (
    <div className="w-full flex-1 lg:grid lg:justify-center">
      <div className="max-w-2xl lg:w-[650px]">
        <div className="flex items-center gap-x-3">
          <h1 className="text-3xl font-bold leading-9 text-default-foreground">Profile Settings</h1>
        </div>
        <h2 className="mt-2 text-small text-default-500">See your profile information and manage your settings.</h2>
        <ProfileTabs data={profileData} />
      </div>
    </div>
  );
}
