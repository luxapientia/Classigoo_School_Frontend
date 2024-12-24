"use client";
import React from "react";
import { useRouter } from "next/navigation";
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
} from "@nextui-org/react";
import ActionCard from "./action";

// queries & mutations & subscriptions
import { SUB_PARENT } from "@graphql/subscriptions";
import { ACCEPT_CHILD_CLAIM } from "@graphql/mutations";

//graphql client
import { useMutation, useSubscription } from "@apollo/client";

export default function MainParentComponent({ user }) {
  // graphql
  // -> mutations
  const [acceptChildClaim] = useMutation(ACCEPT_CHILD_CLAIM);

  // router
  const route = useRouter();

  // -> queries
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_PARENT, {
    variables: {
      id: user.sub,
    },
  });

  // states
  const [error, setError] = React.useState(sub_error ? sub_error.message : "");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [action, setAction] = React.useState({});
  const [showAction, setShowAction] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setError("");
    setSuccess("");
    setLoading(false);
    setAction({});
    setShowAction(false);
  }, [action]);

  const handleSubmit = React.useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (action?.id === "") {
      setLoading(false);
      setError("No action selected.");
      return;
    }

    try {
      // send the invite
      const data = await acceptChildClaim({
        variables: {
          id: action.id,
          accept: action.accept,
        },
      });

      if (data.data.acceptChildInvite.status === "error") {
        setLoading(false);
        setSuccess("");
        setError(data.data.acceptChildInvite.message);
        return;
      } else {
        setLoading(false);
        setAction({});
        setShowAction(false);
        setError("");
        setSuccess(data.data.acceptChildInvite.message);
      }
    } catch (error) {
      setError(error.message);
      setSuccess("");
      setLoading(false);
      return;
    }
  }, [action]);

  const parent = sub_data?.child_parent || [];

  return (
    <>
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
          <TableColumn className="text-center">Actions</TableColumn>
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
          {parent.length > 0
            ? parent.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      src={data.parent.avatar}
                      alt={data.parent.name}
                      name={data.parent.name}
                      size="small"
                      radius="lg"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{data.parent.name}</TableCell>
                  <TableCell>{data.parent.email}</TableCell>
                  <TableCell className="text-center">
                    {data.parent.is_plus ? (
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
                  <TableCell
                    className={`${
                      data.status.toLowerCase() === "pending" ? "flex justify-center content-center" : "text-center"
                    }`}
                  >
                    {data.status.toLowerCase() === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="text"
                          className="my-0.5 mx-1 bg-green-500 text-background rounded-none font-medium"
                          onClick={() => {
                            setAction({
                              id: data.id,
                              accept: true,
                            });
                            setShowAction(true);
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="text"
                          className="my-0.5 mx-1 bg-red-500 text-background rounded-none font-medium"
                          onClick={() => {
                            setAction({
                              id: data.id,
                              accept: false,
                            });
                            setShowAction(true);
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <span className="text-center">--</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            : []}
        </TableBody>
      </Table>

      {showAction && (
        <ActionCard
          action={action}
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
