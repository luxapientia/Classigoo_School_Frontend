import React from "react";
import { auth0 } from "@lib/auth0";
import { redirect } from "next/navigation";
import { GET_CHILDREN } from "@graphql/queries";
import { getClient } from "@lib/apolloServer";
import MainChildComponent from "@components/pages/parential-control/child/main";

export default async function ChildrenPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data, loading, error } = await getClient().query({
    query: GET_CHILDREN,
    variables: {
      id: session.user.sub,
    },
  });

  return (
    <>
      <MainChildComponent qchildren={data.child_parent} qloading={loading} qerror={error} />
    </>
  );
}
