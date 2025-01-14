"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { HeaderSlot } from "@components/layout/header";
import { Avatar, Button, Form, Input } from "@nextui-org/react";
import { useDetectClickOutside } from "react-detect-click-outside";

// graphql things
import { CREATE_CLASSROOM } from "@graphql/mutations";
import { SUB_LIST_CLASSROOMS } from "@graphql/subscriptions";

import { useSubscription, useMutation } from "@apollo/client";
import Loading from "@components/common/loading";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function MainClassroomsComponent({ user }) {
  // graphql
  // -> mutations
  const [createClassroom] = useMutation(CREATE_CLASSROOM);
  // -> subscriptions
  const {
    data: sub_data,
    loading: sub_loading,
    error: sub_error,
  } = useSubscription(SUB_LIST_CLASSROOMS);

  // states
  // -> data
  const [classTitle, setClassTitle] = React.useState("");
  const [classSection, setClassSection] = React.useState("");
  const [classSubject, setClassSubject] = React.useState("");
  const [classRoom, setClassRoom] = React.useState("");
  const [classCode, setClassCode] = React.useState("");
  const [createdClassroom, setCreatedClassroom] = React.useState(null);

  const [error, setError] = React.useState(sub_error ? sub_error.message : "");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // -> dropdowns
  const [showAction, setShowAction] = React.useState(false);
  const [showCreator, setShowCreator] = React.useState(false);
  const [showJoin, setShowJoin] = React.useState(false);

  // data states
  const [classrooms, setClassrooms] = React.useState([]);

  // actions
  const handleShowAction = React.useCallback(() => {
    setShowAction(true);
  }, [showAction]);

  const handleShowCreator = React.useCallback(() => {
    setShowAction(false);
    setShowCreator(true);
    setClassTitle("");
    setClassSection("");
    setClassSubject("");
    setClassRoom("");
    setError("");
    setSuccess("");
  }, [showCreator, showAction]);

  const handleShowJoin = React.useCallback(() => {
    setShowAction(false);
    setShowJoin(true);
    setClassCode("");
    setError("");
    setSuccess("");
  }, [showJoin, showAction]);

  // submitters
  const handleClassroomCreation = async () => {
    try {
      setLoading(true);
      setError("");

      if (classTitle === "") {
        setError("Classroom name is required");
        setLoading(false);
        return;
      }

      // create classroom
      const makeClassroom = await createClassroom({
        variables: {
          name: classTitle,
          section: classSection,
          subject: classSubject,
          room: classRoom,
        },
      });

      // check if classroom is created
      if (makeClassroom.data.createClassroom.status === "success") {
        setSuccess(makeClassroom.data.createClassroom.message);
        setCreatedClassroom(makeClassroom.data.createClassroom.id);
        setTimeout(() => {
          if (makeClassroom.data.createClassroom.id) {
            redirect(
              `/classroom/${makeClassroom.data.createClassroom.id}?created=true`
            );
          }
        }, 500);
      } else {
        setError(makeClassroom.data.createClassroom.message);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(e.message);
      setLoading(false);
    }
  };

  // hooks use
  const actionRef = useDetectClickOutside({
    onTriggered: () => setShowAction(false),
  });
  const creatorRef = useDetectClickOutside({
    onTriggered: () => setShowCreator(false),
  });
  const joinRef = useDetectClickOutside({
    onTriggered: () => setShowJoin(false),
  });

  return (
    <>
      <HeaderSlot>
        <Button
          size="small"
          onClick={handleShowAction}
          radius="large"
          variant="ghost"
          className="hidden md:flex items-center bg-content2 text:content1"
        >
          <Icon icon="akar-icons:plus" />
          New Classroom
        </Button>
        <button
          onClick={handleShowAction}
          className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
        >
          <Icon icon="akar-icons:plus" />
        </button>
      </HeaderSlot>

      {/* content */}
      <div>
        {sub_loading ? (
          <div className="">
            <Loading />
          </div>
        ) : sub_data?.classrooms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
            <div className="py-5 px-2 border-2 rounded-lg border-dashed w-[calc(100%-20px)] text-center">
              <p className="font-medium">No classrooms found!</p>
              <div className="flex flex-row gap-2 mt-5 p-3 justify-center">
                <button
                  className="bg-primary-500 text-white py-1.5 px-3 text-sm"
                  onClick={handleShowCreator}
                >
                  Create a classroom
                </button>
                <button
                  className="bg-success-500 text-white py-1.5 px-3 text-sm"
                  onClick={handleShowJoin}
                >
                  Join a classroom
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sub_data.classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border-2 dark:border-gray-700 overflow-hidden relative"
              >
                <Link key={classroom.id} href={`/classroom/${classroom.id}`}>
                  <div
                    className="bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${classroom.cover_img})`,
                    }}
                  >
                    <div className="py-5 px-5 min-h-[150px] bg-gradient-to-r from-[#00000080] to-[#00000020] flex flex-col justify-end">
                      <h2 className="text-white font-bold text-lg">
                        {classroom.name}
                      </h2>
                      <p className="text-white text-sm">{classroom.subject}</p>
                      <p className="text-white text-sm">
                        {classroom.section}
                        {classroom.section && classroom.room && " - "}
                        {classroom.room}
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-[10px] top-[120px]">
                    <Avatar
                      src={classroom.ownerDetails.avatar}
                      alt={classroom.ownerDetails.name}
                      name={classroom.ownerDetails.name}
                      size="lg"
                      radius="full"
                      isBordered
                    />
                  </div>
                  <div className="min-h-[50px]">
                    <p className="text-sm px-5 py-2 italic">
                      By{" "}
                      <span className="font-medium">
                        {classroom.ownerDetails.name}
                      </span>
                    </p>
                  </div>
                </Link>
                <div className="flex flex-row gap-2 px-2 py-2 border-t-2 dark:border-gray-700">
                  <div className="flex justify-end w-full">
                    <Link
                      href={`/classroom/${classroom.id}/home`}
                      className="mx-1 w-7 h-7 bg-gray-700 dark:bg-white/80 text-white dark:text-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <Icon icon="line-md:home-md" className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/classroom/${classroom.id}/assignments`}
                      className="mx-1 w-7 h-7 bg-gray-700 dark:bg-white/80 text-white dark:text-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <Icon icon="line-md:clipboard-list" className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/classroom/${classroom.id}/exams`}
                      className="mx-1 w-7 h-7 bg-gray-700 dark:bg-white/80 text-white dark:text-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <Icon
                        icon="line-md:check-list-3-filled"
                        className="h-4 w-4"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAction && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm grid justify-center content-center z-[999]">
          <div
            ref={actionRef}
            className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-lg max-w-[400px] w-[calc(100vw_-_20px)] relative"
          >
            <h1 className="text-lg font-bold text-center">Choose an action</h1>

            <div className="flex flex-col gap-3 mt-5">
              <button
                className="bg-primary-500 text-white p-3 rounded-lg"
                onClick={handleShowCreator}
              >
                Create a classroom
              </button>
              <button
                className="bg-success-500 text-white p-3 rounded-lg"
                onClick={handleShowJoin}
              >
                Join a classroom
              </button>
            </div>

            <div className="flex justify-end absolute top-2 right-2">
              <button
                onClick={() => setShowAction(false)}
                className="bg-content2 p-1 rounded-full"
              >
                <Icon icon="line-md:close-small" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreator && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm grid justify-center content-center z-[999]">
          <div
            ref={creatorRef}
            className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-lg max-w-[400px] w-[calc(100vw_-_20px)] relative"
          >
            <h1 className="text-lg font-bold text-center">
              Create a classroom
            </h1>

            <div className="flex flex-col gap-3 mt-5">
              <Input
                isRequired
                label="Classroom Name"
                type="text"
                variant="bordered"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
              />
              <Input
                label="Section"
                type="text"
                variant="bordered"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
              />
              <Input
                label="Subject"
                type="text"
                variant="bordered"
                value={classSubject}
                onChange={(e) => setClassSubject(e.target.value)}
              />
              <Input
                label="Room"
                type="text"
                variant="bordered"
                value={classRoom}
                onChange={(e) => setClassRoom(e.target.value)}
              />

              {error && (
                <p className="text-danger bg-danger/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-success bg-success/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">
                  {success}
                </p>
              )}
              <Button
                isLoading={loading}
                className="bg-primary-500 text-white p-3 rounded-lg"
                onClick={handleClassroomCreation}
              >
                Create
              </Button>
            </div>

            <div className="flex justify-end absolute top-2 right-2">
              <button
                onClick={() => setShowCreator(false)}
                className="bg-content2 p-1 rounded-full"
              >
                <Icon
                  icon="line-md:close-small"
                  className="w-6 h-6"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm grid justify-center content-center z-[999]">
          <div
            ref={joinRef}
            className="bg-white dark:bg-slate-900 p-5 rounded-lg shadow-lg max-w-[400px] w-[calc(100vw_-_20px)] relative"
          >
            <h1 className="text-lg font-bold text-center">Join a classroom</h1>

            <div className="flex flex-col gap-3 mt-5">
              <Input
                isRequired
                label="Classroom Code"
                type="text"
                variant="bordered"
              />
              <button className="bg-success-500 text-white p-3 rounded-lg">
                Join
              </button>
            </div>

            <div className="flex justify-end absolute top-2 right-2">
              <button
                onClick={() => setShowJoin(false)}
                className="bg-content2 p-1 rounded-full"
              >
                <Icon icon="line-md:close-small" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
