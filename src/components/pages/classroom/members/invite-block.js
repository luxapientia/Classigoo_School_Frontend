"use client";

import React from "react";
import { Button, Snippet } from "@heroui/react";

export default function InviteMemberBlock({ id, code, teacher, handleInviteEmail }) {
  // states
  const [copyURL, setCopyURL] = React.useState(false);

  // actions
  const handleCopyURL = () => {
    navigator.clipboard.writeText(`${process.env.APP_BASE_URL}/classroom/${id}/join?code=${code}`);
    setCopyURL(true);
    setTimeout(() => {
      setCopyURL(false);
    }, 1500);
  };
  return (
    <>
      <div className="w-[250px] border-3 p-5 dark:bg-neutral-900 rounded-2xl dark:border-gray-700">
        <h3 className="text-lg font-semibold text-center mb-3">Invitation Code</h3>
        <Snippet
          symbol=""
          copyable
          tooltipProps={{
            placement: "top",
          }}
          className="w-full"
        >
          {code}
        </Snippet>

        <Button className="w-full mt-5" onPress={handleCopyURL}>
          {copyURL ? "URL Copied!" : "Copy URL"}
        </Button>
      </div>

      {teacher && (
        <div className="mt-5 w-[250px] border-3 p-5 dark:bg-neutral-900 rounded-2xl dark:border-gray-700">
          <h3 className="text-lg font-semibold text-center mb-3">Invite by email</h3>
          <Button className="w-full" onClick={handleInviteEmail}>
            Send Invitation
          </Button>
        </div>
      )}
    </>
  );
}
