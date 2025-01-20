"use client";

import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spacer,
  Divider,
  Form,
  Select,
  SelectItem,
} from "@heroui/react";

const ROLES = [
  { key: "student", label: "Student" },
  { key: "teacher", label: "Teacher" },
];

export default function InvitationCard({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  handleClose,
  handleSubmit,
  loading,
  ...props
}) {
  const bodyRef = useDetectClickOutside({ onTriggered: handleClose });

  return (
    <div className="z-[1000] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-5">
      <Card className="w-full max-w-[500px]" {...props} ref={bodyRef}>
        <CardHeader className="px-6 pb-0 pt-6">
          <div className="flex flex-col items-start">
            <h4 className="text-large">Invite User</h4>
            <p className="text-small text-default-500">
              Enter the details of the user you want to invite.
            </p>
          </div>
        </CardHeader>
        <Spacer y={2} />
        <CardBody className="px-4">
          <Form
            className="gap-0"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isClearable
              isRequired
              label="Email Address"
              name="inviteEmail"
              placeholder="someone@example.com"
              value={inviteEmail}
              onValueChange={(value) => setInviteEmail(value)}
            />
            <Spacer y={4} />
            <Select
              className="w-full"
              label="Select Role"
              placeholder="Please select a role"
              selectedKeys={inviteRole}
              onChange={(e) => setInviteRole([e.target.value])}
              isRequired
              items={ROLES}
            >
              {(role) => <SelectItem key={role.key}>{role.label}</SelectItem>}
            </Select>

            <Spacer y={6} />
            <Divider />
            <div className="flex w-full flex-wrap-reverse items-center justify-between gap-2 px-4 pt-4 md:flex-wrap">
              <p className="text-small text-default-400"></p>
              <div className="flex items-center gap-2">
                <Button type="reset" variant="bordered" onPress={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  onPress={handleSubmit}
                >
                  Invite
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
