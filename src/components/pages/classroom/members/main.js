"use client";
import React from "react";
import { useSubscription } from "@apollo/client";
import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";
import InviteMemberBlock from "./invite-block";
import MembersTable from "./table-block";
import RoleAction from "./role-action";
import { useMutation } from "@apollo/client";
import { CHANGE_CLASSROOM_USER_ROLE, REMOVE_CLASSROOM_MEMBER, INVITE_CLASSROOM_MEMBER } from "@graphql/mutations";
import { Alert } from "@heroui/react";
import RemoveMember from "./remove-action";
import InvitationCard from "./invite-action";

export default function ClassroomMembersMain({ id, session }) {
  // states
  const [changeID, setChangeID] = React.useState(null);
  const [changeRole, setChangeRole] = React.useState([]);
  const [rmMemberID, setRmMemberID] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [showRemove, setShowRemove] = React.useState(false);
  const [showMailInvite, setShowMailInvite] = React.useState(false);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState([]);

  // graphql
  // -> mutations
  const [updateRole] = useMutation(CHANGE_CLASSROOM_USER_ROLE);
  const [removeMember] = useMutation(REMOVE_CLASSROOM_MEMBER);
  const [inviteMember] = useMutation(INVITE_CLASSROOM_MEMBER);

  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_GET_CLASSROOM, {
    variables: { id },
  });

  const handleRoleChange = async () => {
    // e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateRole({
        variables: {
          id: changeID,
          role: changeRole[0],
        },
      });
      setSuccess("Role changed successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setChangeID(null);
      setChangeRole([]);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await removeMember({
        variables: {
          id: changeID,
        },
      });

      if (result.data.removeClassroomMember.status === "success") {
        setSuccess(result.data.removeClassroomMember.message);
      } else {
        setError(result.data.removeClassroomMember.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setChangeID(null);
      setRmMemberID(null);
      setShowRemove(false);
    }
  };

  const handleRoleClose = () => {
    setChangeID(null);
    setChangeRole([]);
  };

  const handleShowInvite = React.useCallback(() => {
    setShowMailInvite(true);
  }, []);

  const handleInviteEmailSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await inviteMember({
        variables: {
          cid: id,
          email: inviteEmail,
          role: inviteRole[0],
        },
      });

      if (result.data.inviteClassroomMember.status === "success") {
        setSuccess(result.data.inviteClassroomMember.message);
      } else {
        setError(result.data.inviteClassroomMember.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowMailInvite(false);
      setInviteEmail("");
      setInviteRole([]);
    }
  };

  // get the current user's role
  const userRole = sub_data?.classrooms_by_pk?.classroom_relation.find((r) => r.user.id === session.user.sub);

  return (
    <>
      <ClassroomLayout id={id} loading={sub_loading} classroom={sub_data?.classrooms_by_pk}>
        {success && (
          <div className="flex items-center justify-center w-full">
            <Alert
              hideIconWrapper
              color="success"
              title={success}
              variant="bordered"
              isClosable={true}
              classNames={{
                base: "my-5",
              }}
            />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center w-full">
            <Alert
              hideIconWrapper
              color="danger"
              title="Something went wrong"
              description={error}
              variant="bordered"
              isClosable={true}
              classNames={{
                base: "my-5",
              }}
            />
          </div>
        )}
        <div className="flex gap-5">
          {sub_data?.classrooms_by_pk?.invitation_code !== "" && (
            <div className="flex-initial">
              <InviteMemberBlock
                id={id}
                code={sub_data?.classrooms_by_pk?.invitation_code}
                handleInviteEmail={handleShowInvite}
                teacher={userRole?.role === "teacher" || userRole?.role === "owner"}
              />
            </div>
          )}
          <div className="flex-auto">
            <MembersTable
              user={session.user}
              relations={sub_data?.classrooms_by_pk?.classroom_relation}
              changeID={changeID}
              changeRole={changeRole}
              setChangeID={setChangeID}
              setChangeRole={setChangeRole}
              setShowRemove={setShowRemove}
              setRmMemberID={setRmMemberID}
            />
          </div>
        </div>
      </ClassroomLayout>
      {changeID && !showRemove && (
        <RoleAction
          role={changeRole}
          setRole={setChangeRole}
          loading={loading}
          error={error}
          success={success}
          handleSubmit={handleRoleChange}
          handleClose={handleRoleClose}
        />
      )}

      {changeID && showRemove && (
        <RemoveMember
          handleClose={() => {
            setShowRemove(false);
            setChangeID(null);
          }}
          handleSubmit={handleRemove}
          error={error}
          loading={loading}
          self={session.user.sub === rmMemberID}
        />
      )}

      {showMailInvite && (
        <InvitationCard
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          inviteRole={inviteRole}
          setInviteRole={setInviteRole}
          handleClose={() => setShowMailInvite(false)}
          handleSubmit={handleInviteEmailSubmit}
          error={error}
          loading={loading}
        />
      )}
    </>
  );
}
