"use client";
import React from "react";
import axios from "@lib/axios";
import { useSocket } from "@hooks/useSocket";
import { Input, Alert, Select, SelectItem, Button } from "@heroui/react";
import ClassroomLayout from "../layout/layout";

// graphql
// import { SUB_GET_CLASSROOM } from "@graphql/subscriptions";
// import { useMutation, useSubscription } from "@apollo/client";
// import {
//   UPDATE_CLASSROOM,
//   DELETE_CLASSROOM,
//   ENABLE_CLASSROOM_INVITATION,
//   DISABLE_CLASSROOM_INVITATION,
// } from "@graphql/mutations";
import DisableInvitation from "./show-disable";
import EnableInvitation from "./show-enable";
import DeleteConfirmation from "./show-delete";

export default function ClassroomSettingsMain({ id, userInfo }) {
  // states
  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [room, setRoom] = React.useState("");
  const [name, setName] = React.useState("");
  const [section, setSection] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [childOnly, setChildOnly] = React.useState(false);
  const [allowInvite, setAllowInvite] = React.useState(true);

  // class states
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState("");
  const [inviteLoading, setInviteLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

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

  // mutation
  // const [updateClassroom] = useMutation(UPDATE_CLASSROOM);
  // const [deleteClassroom] = useMutation(DELETE_CLASSROOM);
  // const [enableInvitation] = useMutation(ENABLE_CLASSROOM_INVITATION);
  // const [disableInvitation] = useMutation(DISABLE_CLASSROOM_INVITATION);

  // update classroom
  const updateClassroomHandler = async () => {
    try {
      setLoading(true);
      // await updateClassroom({
      //   variables: {
      //     id,
      //     name,
      //     subject,
      //     section,
      //     room,
      //     child_only: childOnly,
      //   },
      // });

      await axios.put(`/v1/classroom/update`, {
        id,
        name,
        subject,
        section,
        room,
        child_only: childOnly,
      });
      setSuccess("Classroom updated successfully");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableInvite = async () => {
    setInviteLoading(true);
    try {
      // const res = await enableInvitation({
      //   variables: {
      //     cid: id,
      //   },
      // });

      const { data } = await axios.post(`/v1/classroom/invitation/enable`, {
        classroom_id: id,
      });

      if (data.status === "success") {
        setSuccess("Invitation enabled successfully");
        setAllowInvite(true);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError(e.message);
    }
    setShowModal("");
    setInviteLoading(false);
  };

  const handleDisableInvite = async () => {
    setInviteLoading(true);
    try {
      // const res = await disableInvitation({
      //   variables: {
      //     cid: id,
      //   },
      // });

      const { data } = await axios.post(`/v1/classroom/invitation/disable`, {
        classroom_id: id,
      });

      if (data.status === "success") {
        setSuccess("Invitation disabled successfully");
        setAllowInvite(false);
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError(e.message);
    }
    setShowModal("");
    setInviteLoading(false);
  };

  const handleDeleteClassroom = async () => {
    setDeleteLoading(true);
    try {
      // const res = await deleteClassroom({
      //   variables: {
      //     cid: id,
      //   },
      // });

      const { data } = await axios.delete(`/v1/classroom/${id}`);

      if (data.status === "success") {
        setSuccess(data.message);
        setTimeout(() => {
          window.location.href = "/classrooms";
        }, 2000);
      } else {
        setError("Failed to delete classroom");
      }
    } catch (e) {
      setError(e.message);
    }
    setShowModal("");
    setDeleteLoading(false);
  };

  const showDisableModal = () => {
    setShowModal("disable");
  };

  const showEnableModal = () => {
    setShowModal("enable");
  };

  const showDeleteModal = () => {
    setShowModal("delete");
  };

  // by default set state values
  React.useEffect(() => {
    if (classroom) {
      setRoom(classroom?.room);
      setName(classroom?.name);
      setSection(classroom?.section);
      setSubject(classroom?.subject);
      setChildOnly(classroom?.child_only);
      console.log(classroom);
      setAllowInvite(classroom?.invitation_code != "" ? true : false);
    }
  }, [classroom]);

  // Msg handler
  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  }, [success]);

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  // current user's role
  const userRole = classroom?.classroom_relation.find((r) => r.user._id === userInfo._id);
  const canUserEdit = userRole?.role === "owner" || userRole?.role === "teacher";

  return (
    <>
      <ClassroomLayout id={id} loading={classroomLoading} classroom={classroom}>
        {showModal === "disable" && (
          <DisableInvitation
            handleClose={() => setShowModal("")}
            handleSubmit={handleDisableInvite}
            loading={inviteLoading}
          />
        )}

        {showModal === "enable" && (
          <EnableInvitation
            handleClose={() => setShowModal("")}
            handleSubmit={handleEnableInvite}
            loading={inviteLoading}
          />
        )}

        {showModal === "delete" && (
          <DeleteConfirmation
            handleClose={() => setShowModal("")}
            handleSubmit={handleDeleteClassroom}
            loading={deleteLoading}
          />
        )}

        <section className="mb-10">
          <div className="max-w-xl mx-auto w-full">
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
            {/* <div className="w-full">
              <p className="text-lg text-gray-500">Classroom Settings</p>
            </div> */}
            <div className="w-full mt-5">
              <Input
                isRequired
                className="w-full"
                value={name}
                label="Name"
                onChange={(e) => setName(e.target.value)}
                readOnly={!canUserEdit}
                isDisabled={!canUserEdit}
              />
            </div>

            <div className="w-full mt-5">
              <Input
                className="w-full"
                value={subject}
                label="Subject"
                onChange={(e) => setSubject(e.target.value)}
                readOnly={!canUserEdit}
                isDisabled={!canUserEdit}
              />
            </div>

            <div className="w-full mt-5">
              <Input
                className="w-full"
                value={section}
                label="Section"
                onChange={(e) => setSection(e.target.value)}
                readOnly={!canUserEdit}
                isDisabled={!canUserEdit}
              />
            </div>

            <div className="w-full mt-5">
              <Input
                className="w-full"
                value={room}
                label="Room"
                onChange={(e) => setRoom(e.target.value)}
                readOnly={!canUserEdit}
                isDisabled={!canUserEdit}
              />
            </div>

            <div className="w-full mt-5">
              <Select
                isRequired
                className="w-full"
                selectedKeys={childOnly ? ["true"] : ["false"]}
                label="Child Protection"
                placeholder="Select an option"
                onChange={(e) => {
                  setChildOnly(e.target.value === "true" ? true : false);
                }}
                isDisabled={!canUserEdit}
              >
                <SelectItem key={"true"}>Enable</SelectItem>
                <SelectItem key={"false"}>Disable</SelectItem>
              </Select>
            </div>

            <div className="w-full mt-5">
              <div
                className={`bg-default-100 p-3 rounded-xl
                ${!canUserEdit && "opacity-disabled"}
                `}
              >
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="text-foreground-500 text-xs font-medium">Allow Members to Join</h3>
                    <p
                      className="text-sm text-gray-800 dark:text-gray-200"
                      style={{
                        marginTop: "3px",
                      }}
                    >
                      Status: {allowInvite ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {canUserEdit && (
                    <div className="flex-1">
                      {allowInvite ? (
                        <Button className="w-full" color="danger" isLoading={inviteLoading} onClick={showDisableModal}>
                          Disable
                        </Button>
                      ) : (
                        <Button className="w-full" color="success" isLoading={inviteLoading} onClick={showEnableModal}>
                          Enable
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full mt-5">
              {canUserEdit && (
                <Button
                  isLoading={loading}
                  className="w-full bg-black dark:bg-white text-white dark:text-black"
                  onPress={updateClassroomHandler}
                >
                  Update
                </Button>
              )}
            </div>

            <div className="w-full mt-12">
              {userRole?.role == "owner" && (
                <div className="border-danger-500 border p-3 rounded-xl flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-danger-500 font-medium">Danger Zone</p>
                  </div>
                  <div className="flex-1">
                    <Button isLoading={loading} className="w-full" color="danger" onClick={showDeleteModal}>
                      Delete Classroom
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </ClassroomLayout>
    </>
  );
}
