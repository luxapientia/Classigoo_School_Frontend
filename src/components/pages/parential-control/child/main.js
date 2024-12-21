"use client";
import React from "react";
import { auth0 } from "@lib/auth0";
import { Icon } from "@iconify/react";
import InvitationCard from "./invite";
import isEmail from "validator/lib/isEmail";
import { HeaderSlot } from "@components/layout/header";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  Button,
  Alert,
  TableRow,
  Avatar,
  TableColumn,
} from "@nextui-org/react";

// queries & mutations
import { INVITE_CHILD } from "@graphql/mutations";

//graphql client
import { useMutation } from "@apollo/client";

export default function MainChildComponent({ qchildren = [], qloading, qerror }) {
  // graphql
  // -> mutations
  const [inviteChild] = useMutation(INVITE_CHILD);

  // -> queries

  // states
  const [error, setError] = React.useState(qerror ? qerror.message : "");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showinvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");

  const [children, setChildren] = React.useState(qchildren.length > 0 ? qchildren : []);

  const handleClose = React.useCallback(() => {
    setError("");
    setLoading(false);
    setInviteEmail("");
    setShowInvite(false);
  }, [inviteEmail]);

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      console.log("submitting form");
      setLoading(true);
      setError("");
      setSuccess("");

      if (!inviteEmail) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (isEmail(inviteEmail) === false) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      try {
        // send the invite
        const data = await inviteChild({ variables: { email: inviteEmail } });
        if (data.data.inviteChild.status === "error") {
          setLoading(false);
          setError(data.data.inviteChild.message);
          return;
        } else {
          setLoading(false);
          setInviteEmail("");
          setShowInvite(false);
          setSuccess(data.data.inviteChild.message);
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
        return;
      }
    },
    [inviteEmail]
  );

  return (
    <>
      <HeaderSlot>
        <Button
          size="small"
          onClick={() => {
            setShowInvite(true);
          }}
          radius="large"
          variant="ghost"
          className="flex items-center bg-content2 text:content1"
        >
          <Icon icon="akar-icons:plus" />
          Invite a child
        </Button>
      </HeaderSlot>
      <div className="mb-5">
        {success && (
          <Alert hideIcon color="success" variant="faded">
            {success}
          </Alert>
        )}
        {error && (
          <Alert hideIcon color="danger" variant="faded">
            {error}
          </Alert>
        )}
      </div>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Avatar</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn className="text-center">Membership</TableColumn>
          <TableColumn className="text-center">Invitation Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."} isLoading={qloading}>
          {children.length > 0
            ? children.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={data.child.avatar}
                      alt={data.child.name}
                      name={data.child.name}
                      size="small"
                      radius="lg"
                    />
                  </TableCell>
                  <TableCell>{data.child.name}</TableCell>
                  <TableCell>{data.child.email}</TableCell>
                  <TableCell className="text-center">
                    {!data.child.is_plus ? (
                      <span className="text-orange-500 bg-orange-200 px-3 py-0.5 capitalize rounded-full text-xs font-bold">
                        Plus
                      </span>
                    ) : (
                      <span className="text-red-500 bg-red-200 px-3 py-0.5 capitalize rounded-full text-xs font-bold">
                        Basic
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.status?.toLowerCase() === "active" ? (
                      <span className="text-green-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : data.status?.toLowerCase() === "pending" ? (
                      <span className="text-red-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : (
                      <span className="text-gray-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {data.status?.toLowerCase() === "pending" ? (
                      <Button size="small" variant="ghost" color="primary" className="mr-2">
                        Resend
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button size="small" variant="ghost" color="danger">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : []}
        </TableBody>
      </Table>

      {showinvite && (
        <InvitationCard
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          error={error}
          setError={setError}
          loading={loading}
        />
      )}
    </>
  );
}
