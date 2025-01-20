"use client";
import React from "react";
import ActionCard from "./action";
import { Icon } from "@iconify/react";
import InvitationCard from "./invite";
import { useRouter } from "next/navigation";
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
  Spinner,
} from "@heroui/react";

// queries & mutations & subscriptions
import { SUB_CHILDREN } from "@graphql/subscriptions";
import { DELETE_CHILD_CLAIM, INVITE_CHILD } from "@graphql/mutations";

//graphql client
import { useMutation, useSubscription } from "@apollo/client";

export default function MainChildComponent({ user }) {
  // graphql
  // -> mutations
  const [inviteChild] = useMutation(INVITE_CHILD);
  const [deleteChild] = useMutation(DELETE_CHILD_CLAIM);

  // -> subscriptions
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_CHILDREN, {
    variables: {
      id: user.sub,
    },
  });

  // router
  const route = useRouter();

  // -> queries

  // states
  const [error, setError] = React.useState(sub_error ? sub_error.message : "");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showinvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");

  const [actionId, setActionId] = React.useState();
  const [showAction, setShowAction] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setError("");
    setLoading(false);
    setInviteEmail("");
    setShowInvite(false);
  }, [inviteEmail]);

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
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

  const handleDelete = React.useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (actionId === "") {
      setLoading(false);
      setError("No action selected.");
      return;
    }

    try {
      // send the invite
      const data = await deleteChild({ variables: { id: actionId } });

      if (data.data.removeChildInvite.status === "error") {
        setLoading(false);
        setSuccess("");
        setError(data.data.removeChildInvite.message);
        return;
      } else {
        setLoading(false);
        setActionId("");
        setShowAction(false);
        setError("");
        setSuccess(data.data.removeChildInvite.message);
      }
    } catch (error) {
      setError(error.message);
      setSuccess("");
      setLoading(false);
      return;
    }
  }, [actionId]);

  const children = sub_data?.child_parent || [];

  return (
    <>
      <HeaderSlot>
        <Button
          size="small"
          onPress={() => {
            setShowInvite(true);
          }}
          radius="large"
          variant="ghost"
          className="hidden md:flex items-center bg-content2 text:content1"
        >
          <Icon icon="akar-icons:plus" />
          Invite a child
        </Button>
        <button
          onClick={() => {
            setShowInvite(true);
          }}
          className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
        >
          <Icon icon="akar-icons:plus" />
        </button>
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
        <TableBody
          emptyContent={"No rows to display."}
          isLoading={sub_loading}
          loadingContent={
            <div className="flex items-center justify-center">
              <Spinner color="success" />
            </div>
          }
        >
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
                  <TableCell className="whitespace-nowrap">{data.child.name}</TableCell>
                  <TableCell>{data.child.email}</TableCell>
                  <TableCell className="text-center">
                    {data.child.is_plus ? (
                      <span className="text-orange-500 bg-orange-200 px-3 py-0.5 capitalize rounded-full text-xs font-bold">
                        Plus
                      </span>
                    ) : (
                      <span className="text-red-500 bg-red-200 px-3 py-0.5 capitalize rounded-full text-xs font-bold">
                        Free
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.status?.toLowerCase() === "accepted" ? (
                      <span className="text-green-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : data.status?.toLowerCase() === "pending" ? (
                      <span className="text-red-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : (
                      <span className="text-gray-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="text"
                      className="my-0.5 mx-1 bg-blue-500 text-background rounded-none font-medium"
                      isDisabled={data.status.toLowerCase() === "pending"}
                      onPress={() => {
                        route.push(`/parential-control/child/${data.id}`);
                      }}
                    >
                      Manage
                    </Button>
                    <Button
                      size="sm"
                      variant="text"
                      className="my-0.5 mx-1 bg-red-500 text-background rounded-none font-medium"
                      onPress={() => {
                        setActionId(data.id);
                        setShowAction(true);
                      }}
                    >
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

      {showAction && (
        <ActionCard
          action={actionId}
          handleClose={() => {
            setActionId("");
            setShowAction(false);
          }}
          handleSubmit={handleDelete}
          error={error}
          setError={setError}
          loading={loading}
        />
      )}
    </>
  );
}
