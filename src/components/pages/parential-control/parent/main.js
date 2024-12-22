"use client";
import React from "react";
import { Icon } from "@iconify/react";
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
} from "@nextui-org/react";

// queries & mutations
import { ACCEPT_CHILD_CLAIM } from "@graphql/mutations";

//graphql client
import { useMutation } from "@apollo/client";
import ActionCard from "./action";

export default function MainParentComponent({ qparent = [], qloading, qerror }) {
  // graphql
  // -> mutations
  const [acceptChildClaim] = useMutation(ACCEPT_CHILD_CLAIM);

  // router
  const route = useRouter();

  // -> queries

  // states
  const [error, setError] = React.useState(qerror ? qerror.message : "");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [action, setAction] = React.useState({});
  const [showAction, setShowAction] = React.useState(false);

  const [parent, setParent] = React.useState(qparent.length > 0 ? qparent : []);

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

  return (
    <>
      {/* <HeaderSlot>
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
          Invite a parent
        </Button>
      </HeaderSlot> */}
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
        <TableBody emptyContent={"No rows to display."} isLoading={qloading}>
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
                  <TableCell>{data.parent.name}</TableCell>
                  <TableCell>{data.parent.email}</TableCell>
                  <TableCell className="text-center">
                    {data.parent.is_plus ? (
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
                    {data.status?.toLowerCase() === "accepted" ? (
                      <span className="text-green-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : data.status?.toLowerCase() === "pending" ? (
                      <span className="text-red-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    ) : (
                      <span className="text-gray-500 capitalize rounded-full text-xs font-bold">{data.status}</span>
                    )}
                  </TableCell>
                  <TableCell
                    className={`${data.status.toLowerCase() === "pending" ? "flex justify-center content-center" : "text-center"}`}
                  >
                    {data.status.toLowerCase() === "pending" ? (
                      <>
                        <Button
                          size="small"
                          variant="ghost"
                          color="success"
                          className="mr-2"
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
                          size="small"
                          variant="ghost"
                          color="danger"
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
