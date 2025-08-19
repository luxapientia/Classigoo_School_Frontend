"use client";
import React from "react";
import { Icon } from "@iconify/react";
import axios from "@lib/axios";
// import { useSubscription } from "@apollo/client";
// import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
import ClassroomLayout from "../layout/layout";
import InviteMemberBlock from "./invite-block";
import MembersTable from "./table-block";
import RoleAction from "./role-action";
// import { useMutation } from "@apollo/client";
// import { CHANGE_CLASSROOM_USER_ROLE, REMOVE_CLASSROOM_MEMBER, INVITE_CLASSROOM_MEMBER } from "@graphql/mutations";
import { Alert, Tabs, Tab } from "@heroui/react";
import RemoveMember from "./remove-action";
import InvitationCard from "./invite-action";
import CreateVirtualStudent from "./create-virtual-student";
import VirtualStudentCard from "./virtual-student-card";
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

  // Virtual student states
  const [virtualStudents, setVirtualStudents] = React.useState([]);
  const [virtualStudentsLoading, setVirtualStudentsLoading] = React.useState(false);
  
  // Tab state management
  const [activeTab, setActiveTab] = React.useState("teachers");

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
      fetchVirtualStudents();
    }
  });

  // Fetch virtual students
  const fetchVirtualStudents = React.useCallback(async () => {
    setVirtualStudentsLoading(true);
    try {
      const res = await axios.get(`/v1/classroom/member/virtual-student/classroom/${id}`);
      if (res.data.status === "success") {
        setVirtualStudents(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load virtual students:", err);
    }
    setVirtualStudentsLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchVirtualStudents();
  }, [fetchVirtualStudents]);

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
      setError(err.response.data.message);
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
      setError(err.response.data.message);
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
      setError(err.response.data.message);
    } finally {
      setLoading(false);
      setShowMailInvite(false);
      setInviteEmail("");
      setInviteRole([]);
    }
  };

  // Virtual student handlers
  const handleVirtualStudentCreated = (newStudent) => {
    setVirtualStudents(prev => [...prev, newStudent]);
    // Keep Students tab active after creation
    setActiveTab("students");
  };

  const handleVirtualStudentUpdated = (updatedStudent) => {
    setVirtualStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
    // Keep Students tab active after update
    setActiveTab("students");
  };

  const handleCodeRegenerated = (studentId, newCode) => {
    setVirtualStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, invitation_code: newCode }
          : student
      )
    );
    // Keep Students tab active after code regeneration
    setActiveTab("students");
  };

  // get the current user's role
  const userRole = classroom?.classroom_relation.find((r) => r.user.id === userInfo.id);

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
        <Tabs 
          aria-label="Classroom Management" 
          className="w-full mt-4 bg-transparent flex-auto"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          // classNames={{
          //   tabList: "gap-6 w-full relative rounded-none px-4 border-b border-divider",
          //   cursor: "w-full bg-primary",
          //   tab: "max-w-fit px-0 h-12",
          //   tabContent: "group-data-[selected=true]:text-primary"
          // }}
        >
          <Tab key="teachers" title="Teachers">
            <div className="flex flex-col xl:flex-row gap-5 mt-6">
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
          </Tab>
          
          <Tab key="students" title="Students">
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Virtual Students</h3>
                <CreateVirtualStudent
                  classroomId={id}
                  onSuccess={handleVirtualStudentCreated}
                  isTeacher={userRole?.role === "teacher" || userRole?.role === "owner"}
                />
              </div>
              
              {virtualStudentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading virtual students...</p>
                </div>
              ) : virtualStudents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Icon icon="solar:users-group-line-duotone" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Virtual Students Yet</h4>
                  <p className="text-gray-500 mb-4">Create virtual students to invite parents to your classroom</p>
                  <CreateVirtualStudent
                    classroomId={id}
                    onSuccess={handleVirtualStudentCreated}
                    isTeacher={userRole?.role === "teacher" || userRole?.role === "owner"}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {virtualStudents.map((student) => (
                    <VirtualStudentCard
                      key={student.id}
                      student={student}
                      classroomId={id}
                      isTeacher={userRole?.role === "teacher" || userRole?.role === "owner"}
                      onUpdate={handleVirtualStudentUpdated}
                      onRegenerateCode={handleCodeRegenerated}
                    />
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
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
          self={userInfo.id === rmMemberID}
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
