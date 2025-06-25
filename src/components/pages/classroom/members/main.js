"use client";
import React from "react";
import axios from "@lib/axios";
// import { useSubscription } from "@apollo/client";
// import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";
import InviteMemberBlock from "./invite-block";
import MembersTable from "./table-block";
import RoleAction from "./role-action";
// import { useMutation } from "@apollo/client";
// import { CHANGE_CLASSROOM_USER_ROLE, REMOVE_CLASSROOM_MEMBER, INVITE_CLASSROOM_MEMBER } from "@graphql/mutations";
import { Alert } from "@heroui/react";
import RemoveMember from "./remove-action";
import InvitationCard from "./invite-action";
import { useSocket } from "@hooks/useSocket";

export default function ClassroomMembersMain({ id, userInfo }) {
  // states
  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
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
  // const [updateRole] = useMutation(CHANGE_CLASSROOM_USER_ROLE);
  // const [removeMember] = useMutation(REMOVE_CLASSROOM_MEMBER);
  // const [inviteMember] = useMutation(INVITE_CLASSROOM_MEMBER);

  // const {
  //   data: sub_data,
  //   loading: sub_loading,
  //   error: sub_error,
  // } = useSubscription(SUB_GET_CLASSROOM, {
  //   variables: { id },
  // });

  // fetch classroom
  const fetchClassroom = React.useCallback(async () => {
    setClassroomLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/${id}`);
      setClassroom(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load classroom");
    }

    setClassroomLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  useSocket("classroom.updated", (payload) => {
    if (payload.data.id === id) {
      fetchClassroom();
    }
  });

  const handleRoleChange = async () => {
    // e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // await updateRole({
      //   variables: {
      //     id: changeID,
      //     role: changeRole[0],
      //   },
      // });
      const { data: response } = await axios.post(`/v1/classroom/member/change-role`, {
        id: changeID,
        role: changeRole[0],
      });

      if (response.status === "success") {
        setSuccess(response.message);
      } else {
        setError(response.message);
      }
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
      // const result = await removeMember({
      //   variables: {
      //     id: changeID,
      //   },
      // });
      const { data: response } = await axios.post(`/v1/classroom/member/remove`, { 
        relation_id: changeID,
      });

      if (response.status === "success") {
        setSuccess(response.message);
      } else {
        setError(response.message);
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
      // const result = await inviteMember({
      //   variables: {
      //     cid: id,
      //     email: inviteEmail,
      //     role: inviteRole[0],
      //   },
      // });

      const { data: response } = await axios.post(`/v1/classroom/member/invite`, {
        class_id: id,
        email: inviteEmail,
        role: inviteRole[0],
      });

      if (response.status === "success") {
        setSuccess(response.message);
      } else {
        setError(response.message);
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
  const userRole = classroom?.classroom_relation.find((r) => r.user._id === userInfo._id);

  return (
    <>
      <ClassroomLayout id={id} loading={classroomLoading} classroom={classroom}>
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
        <div className="flex flex-col xl:flex-row gap-5">
          {classroom?.invitation_code !== "" && (
            <div className="flex-initial">
              <InviteMemberBlock
                id={id}
                code={classroom?.invitation_code}
                handleInviteEmail={handleShowInvite}
                teacher={userRole?.role === "teacher" || userRole?.role === "owner"}
              />
            </div>
          )}
          <div className="flex-auto">
            <MembersTable
              user={userInfo}
              relations={classroom?.classroom_relation}
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
          self={userInfo._id === rmMemberID}
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
