"use client";
import React from "react";
import axios from "@lib/axios";
import moment from "moment";
import Link from "next/link";
import { Icon } from "@iconify/react";
import EventViewer from "./event-viewer";
import EventEditor from "./event-editor";
import NotFoundPage from "@app/not-found";
import EventCreator from "./event-creator";
import DeleteEventAction from "./delete-event";
import ClassroomLayout from "../layout/layout";
import { Button, Tooltip, User } from "@heroui/react";
import { HeaderSlot } from "@components/layout/header";
import parseAbsoluteToLocal from "@internationalized/date";
import { useSocket } from "@hooks/useSocket";

// graphql imports
// import { DELETE_SCHEDULE } from "@graphql/mutations";
// import { useSubscription, useMutation } from "@apollo/client";
// import { SUB_GET_CLASSROOM, SUB_LIST_SCHEDULES } from "@graphql/subscriptions";

export default function ClassroomCalendarMain({ id, userInfo }) {

  const [classroom, setClassroom] = React.useState(null);
  const [classroomLoading, setClassroomLoading] = React.useState(false);
  const [schedules, setSchedules] = React.useState(null);
  const [schedulesLoading, setSchedulesLoading] = React.useState(false);
  const [eventCreator, setEventCreator] = React.useState(false);

  const [showEvent, setShowEvent] = React.useState({});
  const [showEventEditor, setShowEventEditor] = React.useState({});
  const [showDeleteEvent, setShowDeleteEvent] = React.useState("");

  const [pastEvents, setPastEvents] = React.useState([]);
  const [todayEvents, setTodayEvents] = React.useState([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);

  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);


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

  // const {
  //   data: sub_data_schedules,
  //   loading: sub_loading_schedules,
  //   error: sub_error_schedules,
  // } = useSubscription(SUB_LIST_SCHEDULES, {
  //   variables: { cid: id },
  // });

  // fetch schedules
  const fetchSchedules = React.useCallback(async () => {
    setSchedulesLoading(true);
    try {
      const { data: res } = await axios.get(`/v1/classroom/schedule/list/${id}`);
      setSchedules(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load Schedules");
    }

    setSchedulesLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useSocket("schedule.updated", (payload) => {
    if (payload.data.cid === id) {
      fetchSchedules();
    }
  });

  React.useEffect(() => {
    if (schedules) {
      let u = [];
      let t = [];
      let p = [];

      // console.log(schedules);

      schedules.forEach((schedule) => {
        //   const startDate = moment(parseAbsoluteToLocal(schedule.start_time));
        //   const endDate = moment(parseAbsoluteToLocal(schedule.end_time));
        // moment convert to local time
        const startDate = moment.utc(schedule.start_time).local();
        const endDate = moment.utc(schedule.end_time).local();
        const now = moment();

        // change times
        let sc = {
          ...schedule,
          start_time: startDate.format("YYYY-MM-DD HH:mm:ss"),
          end_time: endDate.format("YYYY-MM-DD HH:mm:ss"),
        };

        if (endDate.isBefore(now)) {
          p.push(sc);
        }
        // else if today date is between start and end date
        else if (startDate.isBefore(now) && endDate.isAfter(now)) {
          t.push(sc);
        } else {
          u.push(sc);
        }
      });

      setPastEvents(p);
      setTodayEvents(t);
      setUpcomingEvents(u);
      console.log("P", p);
      console.log("T", t);
      console.log("U", u);
    }
  }, [schedules]);

  const handleDeleteEvent = async () => {
    setDeleting(true);
    try {
      // const { data } = await deleteSchedule({
      //   variables: {
      //     eid: showDeleteEvent,
      //   },
      // });

      const { data: res } = await axios.delete(`/v1/classroom/schedule/${showDeleteEvent}`)

      if (res.status === "success" && res.data.id) {
        setSuccess("Event deleted successfully");
        setShowDeleteEvent("");
        setShowEvent({});
        setShowEventEditor({});
      } else {
        setError("Error deleting event");
        setShowDeleteEvent("");
        setShowEvent({});
        setShowEventEditor({});
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setShowDeleteEvent("");
      setShowEvent({});
      setShowEventEditor({});
    }
    setDeleting(false);
  };

  // Check if the current user is a member of the classroom
  const currentUser = classroom?.classroom_relation.find(
    (cr) => cr.user.id === userInfo.id
  );

  if (!classroomLoading && !classroom) return <NotFoundPage />;

  return (
    <>
      <ClassroomLayout
        id={id}
        loading={classroomLoading || schedulesLoading}
        classroom={classroom}
      >
        {(currentUser?.role === "owner" || currentUser?.role === "teacher") && (
          <HeaderSlot>
            <Button
              variant="solid"
              color="primary"
              className="hidden md:flex items-center bg-content2 text-content2-foreground dark:border-neutral-700  px-4 py-2 border-2 rounded-xl"
              onClick={() => {
                setEventCreator(true);
              }}
            >
              <Icon icon="akar-icons:plus" />
              <span className="ml-1">Add Event</span>
            </Button>
            <Button
              variant="solid"
              color="primary"
              isIconOnly
              className="grid md:hidden justify-center items-center h-[44px] w-[44px] rounded-full px-0 bg-blue-500 text-white shadow-[0px_0px_5px_1px_#3b82f6c7]"
              onClick={() => {
                setEventCreator(true);
              }}
            >
              <Icon icon="akar-icons:plus" />
            </Button>
          </HeaderSlot>
        )}

        <div className="w-[750px] max-w-[calc(100%_-_20px)] mx-auto">
          {/* ongoing */}
          <div className="p-5 rounded-3xl border-2 border-dotted">
            <div>
              <h1 className="text-xl font-bold text-left">On Going Events</h1>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
                Events that are currently happening.
              </p>
            </div>
            <div className="grid grid-rows-1 gap-4 mt-5">
              {todayEvents.length > 0 ? (
                todayEvents.map((e) => (
                  <div className="" key={e.id}>
                    <div className="flex flex-col lg:flex-row bg-gray-50 dark:bg-neutral-800 p-2 rounded-2xl lg:items-center">
                      <div className="flex-auto flex flex-col sm:flex-row">
                        <div className="flex-initial grid content-center justify-center sm:justify-normal my-5 sm:my-0">
                          <div className="bg-gray-200 dark:bg-neutral-700 w-24 p-2 rounded-xl">
                            <div className="flex flex-col">
                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("MMMM")}
                              </div>
                              <div className="py-2 text-4xl flex-initial font-black text-center">
                                {moment(e.start_time).format("DD")}
                              </div>

                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("YYYY")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-auto px-4 grid content-center">
                          <div className="">
                            <h2 className="text-base md:text-sm lg:text-base text-center sm:text-left font-semibold font-exo">
                              {e.title}
                            </h2>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Starts at:{" "}
                              {moment(e.start_time).format(
                                "DD MMM YYYY, h:mm A"
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Ends at:{" "}
                              {moment(e.end_time).format("DD MMM YYYY, h:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-initial flex-row w-full lg:flex-col flex lg:w-24 mt-5 lg:mt-0 gap-1 content-center h-full">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() =>
                            setShowEvent(
                              todayEvents.find((ev) => ev.id === e.id)
                            )
                          }
                          className="bg-gray-200 dark:bg-neutral-600 w-full lg:w-auto flex rounded-xl font-semibold px-2"
                        >
                          <Icon
                            icon="solar:eye-bold-duotone"
                            className="w-4 h-4"
                          />{" "}
                          View
                        </Button>
                        {currentUser?.role !== "parent" && (
                          <>
                            <Button
                              variant="text"
                              color="primary"
                              className="bg-yellow-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                              onClick={() => {
                                setShowEventEditor(
                                  todayEvents.find((ev) => ev.id === e.id)
                                );
                              }}
                            >
                              <Icon
                                icon="solar:pen-new-round-bold-duotone"
                                className="w-4 h-4"
                              />
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => setShowDeleteEvent(e.id)}
                              className="bg-red-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                            >
                              <Icon
                                icon="solar:trash-bin-2-bold-duotone"
                                className="w-4 h-4"
                              />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <div className="flex bg-content1 rounded-2xl border-2 border-dotted p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Icon
                        icon="duo-icons:clock"
                        className="w-4 h-4 mr-1 text-gray-500"
                      />
                      No ongoing events
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* upcoming */}
          <div className="p-5 rounded-3xl border-2 border-dotted mt-5">
            <div>
              <h1 className="text-xl font-bold text-left">Upcoming Events</h1>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
                Events that are coming up in the next days.
              </p>
            </div>
            <div className="grid grid-rows-1 gap-4 mt-5">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((e) => (
                  <div className="" key={e.id}>
                    <div className="flex flex-col lg:flex-row bg-gray-50 dark:bg-neutral-800 p-2 rounded-2xl lg:items-center">
                      <div className="flex-auto flex flex-col sm:flex-row">
                        <div className="flex-initial grid content-center justify-center sm:justify-normal my-5 sm:my-0">
                          <div className="bg-gray-200 dark:bg-neutral-700 w-24 p-2 rounded-xl">
                            <div className="flex flex-col">
                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("MMMM")}
                              </div>
                              <div className="py-2 text-4xl flex-initial font-black text-center">
                                {moment(e.start_time).format("DD")}
                              </div>

                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("YYYY")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-auto px-4 grid content-center">
                          <div className="">
                            <h2 className="text-base md:text-sm lg:text-base text-center sm:text-left font-semibold font-exo">
                              {e.title}
                            </h2>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Starts at:{" "}
                              {moment(e.start_time).format(
                                "DD MMM YYYY, h:mm A"
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Ends at:{" "}
                              {moment(e.end_time).format("DD MMM YYYY, h:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-initial flex-row w-full lg:flex-col flex lg:w-24 mt-5 lg:mt-0 gap-1 content-center h-full">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() =>
                            setShowEvent(
                              upcomingEvents.find((ev) => ev.id === e.id)
                            )
                          }
                          className="bg-gray-200 dark:bg-neutral-600 w-full lg:w-auto flex rounded-xl font-semibold px-2"
                        >
                          <Icon
                            icon="solar:eye-bold-duotone"
                            className="w-4 h-4"
                          />{" "}
                          View
                        </Button>
                        {currentUser?.role !== "parent" && (
                          <>
                            <Button
                              variant="text"
                              color="primary"
                              className="bg-yellow-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                              onClick={() => {
                                setShowEventEditor(
                                  upcomingEvents.find((ev) => ev.id === e.id)
                                );
                              }}
                            >
                              <Icon
                                icon="solar:pen-new-round-bold-duotone"
                                className="w-4 h-4"
                              />
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => setShowDeleteEvent(e.id)}
                              className="bg-red-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                            >
                              <Icon
                                icon="solar:trash-bin-2-bold-duotone"
                                className="w-4 h-4"
                              />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <div className="flex bg-content1 rounded-2xl border-2 border-dotted p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Icon
                        icon="duo-icons:clock"
                        className="w-4 h-4 mr-1 text-gray-500"
                      />
                      No upcoming events
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* past */}
          <div className="p-5 rounded-3xl border-2 border-dotted mt-5">
            <div>
              <h1 className="text-xl font-bold text-left">Past Events</h1>
              <p className="text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
                Events that have already happened.
              </p>
            </div>
            <div className="grid grid-rows-1 gap-4 mt-5">
              {pastEvents.length > 0 ? (
                pastEvents.map((e) => (
                  <div className="" key={e.id}>
                    <div className="flex flex-col lg:flex-row bg-gray-50 dark:bg-neutral-800 p-2 rounded-2xl lg:items-center">
                      <div className="flex-auto flex flex-col sm:flex-row">
                        <div className="flex-initial grid content-center justify-center sm:justify-normal my-5 sm:my-0">
                          <div className="bg-gray-200 dark:bg-neutral-700 w-24 p-2 rounded-xl">
                            <div className="flex flex-col">
                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("MMMM")}
                              </div>
                              <div className="py-2 text-4xl flex-initial font-black text-center">
                                {moment(e.start_time).format("DD")}
                              </div>

                              <div className="text-sm flex-initial font-medium text-center text-gray-600 dark:text-gray-300">
                                {moment(e.start_time).format("YYYY")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-auto px-4 grid content-center">
                          <div className="">
                            <h2 className="text-base md:text-sm lg:text-base text-center sm:text-left font-semibold font-exo">
                              {e.title}
                            </h2>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Starts at:{" "}
                              {moment(e.start_time).format(
                                "DD MMM YYYY, h:mm A"
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-left text-gray-500 dark:text-gray-300 mt-2 flex justify-center sm:justify-start">
                              <Icon
                                icon="duo-icons:clock"
                                className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-1 sm:mt-0.5"
                              />
                              Ends at:{" "}
                              {moment(e.end_time).format("DD MMM YYYY, h:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-initial flex-row w-full lg:flex-col flex lg:w-24 mt-5 lg:mt-0 gap-1 content-center h-full">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() =>
                            setShowEvent(
                              pastEvents.find((ev) => ev.id === e.id)
                            )
                          }
                          className="bg-gray-200 dark:bg-neutral-600 w-full lg:w-auto flex rounded-xl font-semibold px-2"
                        >
                          <Icon
                            icon="solar:eye-bold-duotone"
                            className="w-4 h-4"
                          />{" "}
                          View
                        </Button>
                        {currentUser?.role !== "parent" && (
                          <>
                            <Button
                              variant="text"
                              color="primary"
                              className="bg-yellow-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                              onClick={() => {
                                setShowEventEditor(
                                  pastEvents.find((ev) => ev.id === e.id)
                                );
                              }}
                            >
                              <Icon
                                icon="solar:pen-new-round-bold-duotone"
                                className="w-4 h-4"
                              />
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => setShowDeleteEvent(e.id)}
                              className="bg-red-500 w-full lg:w-auto flex rounded-xl text-white font-semibold px-2"
                            >
                              <Icon
                                icon="solar:trash-bin-2-bold-duotone"
                                className="w-4 h-4"
                              />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="">
                  <div className="flex bg-content1 rounded-2xl border-2 border-dotted p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Icon
                        icon="duo-icons:clock"
                        className="w-4 h-4 mr-1 text-gray-500"
                      />
                      No past events
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClassroomLayout>

      {eventCreator && (
        <EventCreator cid={id} setEventCreator={setEventCreator} />
      )}
      {showEvent?.id && (
        <EventViewer event={showEvent} setEventViewer={setShowEvent} />
      )}
      {showEventEditor?.id && (
        <EventEditor
          event={showEventEditor}
          setEventEditor={setShowEventEditor}
        />
      )}
      {showDeleteEvent && (
        <DeleteEventAction
          handleClose={() => setShowDeleteEvent("")}
          handleSubmit={handleDeleteEvent}
          error={error}
          loading={deleting}
        />
      )}
    </>
  );
}
