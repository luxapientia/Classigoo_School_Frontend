"use client";

import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Card, CardHeader, CardBody, Button, Spacer, Divider } from "@heroui/react";

export default function DisableInvitation({ handleClose, handleSubmit, loading, ...props }) {
  const bodyRef = useDetectClickOutside({ onTriggered: handleClose });
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-5 z-[1000]">
      <Card className="w-full max-w-[500px]" {...props} ref={bodyRef}>
        <CardHeader className="px-6 pb-0 pt-6">
          <div className="flex flex-col items-start">
            <h4 className="text-large">Are you sure?</h4>
          </div>
        </CardHeader>
        <CardBody className="px-4">
          <p className="text-small text-default-500 mt-1 px-2">
            If you disable the invitation code, new members will not be able to join this classroom using the code
            anymore also the existing code and pending invitations will be invalidated.
          </p>

          <Spacer y={6} />
          <Divider />
          <div className="flex w-full flex-wrap-reverse items-center justify-between gap-2 px-4 pt-4 md:flex-wrap">
            <p className="text-small text-default-400"></p>
            <div className="flex items-center gap-2">
              <Button type="reset" variant="bordered" onPress={handleClose}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={loading} onPress={handleSubmit}>
                Disable
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
