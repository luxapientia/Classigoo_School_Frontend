"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import useAISidebar from "@hooks/useAISidebar";
import { useRouter } from "nextjs-toploader/app";
import Loading from "@components/common/loading";
import { Button, Avatar, cn, Textarea, Alert } from "@heroui/react";

// graphql imports
import { useMutation } from "@apollo/client";
import { RETRIEVE_AI_BUDDY_HISTORY } from "@graphql/mutations";

export default function PhysicsLayoutComponent({
  user_data,
  children,
  setError,
  isLoading,
  active = "none",
}) {
  // hooks
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { collapsed, toggleSidebar } = useAISidebar();

  //refs
  const sidebarHistoryRef = React.useRef(null);
  const sidebarHistoryMobileRef = React.useRef(null);

  // states
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);
  const [history, setHistory] = React.useState([]);
  const [nextPage, setNextPage] = React.useState(true);
  const [initialLoad, setInitialLoad] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = React.useState(false);

  const [retrieveHistory] = useMutation(RETRIEVE_AI_BUDDY_HISTORY);

  React.useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const { data } = await retrieveHistory({
          variables: {
            page: page,
            limit: limit,
            model: "physics",
          },
        });
        if (data.aiBuddyHistory.status === "success") {
          setPage((prev) => prev + 1);
          setHistory(data.aiBuddyHistory.history);
          setNextPage(data.aiBuddyHistory.pagination.has_next_page);
          setInitialLoad(true);
        } else {
          setError(data.aiBuddyHistory.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setHistoryLoading(false);
      }
    };

    if (history.length === 0 && !initialLoad) {
      fetchHistory();
    }
  }, [page, limit, initialLoad]);

  const handleLoadMore = async () => {
    if (nextPage && !historyLoadingMore) {
      setHistoryLoadingMore(true);
      try {
        const { data } = await retrieveHistory({
          variables: {
            page: page,
            limit: limit,
            model: "physics",
          },
        });
        if (data.aiBuddyHistory.status === "success") {
          setHistory((prev) => [...prev, ...data.aiBuddyHistory.history]);
          setNextPage(data.aiBuddyHistory.pagination.has_next_page);
          setPage((prev) => prev + 1);
        } else {
          setError(data.aiBuddyHistory.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setHistoryLoadingMore(false);
      }
    }
  };

  const handleScroll = () => {
    if (initialLoad) {
      if (
        sidebarHistoryRef.current.scrollTop +
          sidebarHistoryRef.current.clientHeight >=
        sidebarHistoryRef.current.scrollHeight - 10
      ) {
        nextPage && handleLoadMore();
      }
      if (showMobileSidebar) {
        if (
          sidebarHistoryMobileRef.current.scrollTop +
            sidebarHistoryMobileRef.current.clientHeight >=
          sidebarHistoryMobileRef.current.scrollHeight - 10
        ) {
          nextPage && handleLoadMore();
        }
      }
    }
  };

  return (
    <section className="overflow-hidden max-h-screen">
      <div className="flex h-screen items-center justify-center dark:bg-neutral-800 overflow-hidden">
        {/* normal sidebar */}
        <div
          className={cn(
            "h-screen w-72 flex-initial bg-white dark:bg-neutral-900 shadow-md",
            collapsed ? "hidden" : "hidden lg:block"
          )}
        >
          <div className="flex flex-col overflow-hidden h-full">
            <div className="flex-initial p-4">
              <div className="flex">
                <div className="flex-initial flex gap-2">
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                    onClick={() => router.push("/")}
                    isIconOnly
                  >
                    <Icon
                      icon="material-symbols:arrow-back-ios-new"
                      className="text-lg"
                    />
                  </Button>
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                    isIconOnly
                    onClick={toggleSidebar}
                  >
                    <Icon icon="mynaui:sidebar" className="text-lg" />
                  </Button>
                </div>
                <div className="flex-auto"></div>
                <div className="flex-initial flex gap-2">
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                    isIconOnly
                  >
                    <Icon icon="mynaui:search" className="text-lg" />
                  </Button>
                  <Button
                    variant="text"
                    className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                    isIconOnly
                    onClick={() => router.push("/buddy/physics")}
                  >
                    <Icon icon="jam:write" className="text-md" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-auto overflow-hidden">
              {/* history */}
              <ul
                className="px-3 mt-4 overflow-y-auto h-full pb-6"
                ref={sidebarHistoryRef}
                onScroll={handleScroll}
              >
                {historyLoading ? (
                  <div className="">
                    <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                      Loading...
                    </p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <li key={index} className="w-full my-1">
                      <Link href={`/buddy/physics/${item._id}`} className="">
                        <div
                          className={cn(
                            "py-2.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 group rounded-xl overflow-hidden relative",
                            active === item._id
                              ? "bg-gray-200 dark:bg-neutral-700"
                              : ""
                          )}
                        >
                          <p
                            className={cn(
                              "text-sm font-medium whitespace-nowrap overflow-hidden relative before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:bg-[linear-gradient(270deg,_#ffffff,_transparent)] before:dark:bg-[linear-gradient(270deg,_#171717,_transparent)] before:w-3 before:h-5 group-hover:before:bg-[linear-gradient(270deg,_#e5e7eb,_transparent)] group-hover:before:dark:bg-[linear-gradient(270deg,_#404040,_transparent)]",
                              active === item._id
                                ? "before:bg-[linear-gradient(270deg,_#e5e7eb,_transparent)] before:dark:bg-[linear-gradient(270deg,_#404040,_transparent)]"
                                : ""
                            )}
                          >
                            {item?.chat_name}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
                {historyLoadingMore && (
                  <div className="flex justify-center items-center py-4">
                    <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                      Loading more...
                    </p>
                  </div>
                )}
                {initialLoad && !historyLoading && history.length === 0 && (
                  <div className="flex justify-center items-center py-4">
                    <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                      No history found.
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* mobile sidebar */}
        <div
          className={cn(
            "lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/10 backdrop-blur-lg",
            showMobileSidebar ? "block" : "hidden"
          )}
        >
          <div
            className={cn(
              "h-screen w-72 flex-initial bg-white dark:bg-neutral-900 shadow-md"
            )}
          >
            <div className="flex flex-col overflow-hidden h-full">
              <div className="flex-initial p-4">
                <div className="flex">
                  <div className="flex-initial flex gap-2">
                    <Button
                      variant="text"
                      className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                      onClick={() => router.push("/")}
                      isIconOnly
                    >
                      <Icon
                        icon="material-symbols:arrow-back-ios-new"
                        className="text-lg"
                      />
                    </Button>
                    <Button
                      variant="text"
                      className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                      isIconOnly
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <Icon icon="mynaui:sidebar" className="text-lg" />
                    </Button>
                  </div>
                  <div className="flex-auto"></div>
                  <div className="flex-initial flex gap-2">
                    <Button
                      variant="text"
                      className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                      isIconOnly
                    >
                      <Icon icon="mynaui:search" className="text-lg" />
                    </Button>
                    <Button
                      variant="text"
                      className="flex items-center gap-2 text-gray-700 dark:text-white bg-content2 rounded-full"
                      isIconOnly
                      onClick={() => router.push("/buddy/physics")}
                    >
                      <Icon icon="jam:write" className="text-md" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-auto overflow-hidden">
                {/* history */}
                <ul
                  className="px-3 mt-4 overflow-y-auto h-full pb-6"
                  ref={sidebarHistoryMobileRef}
                  onScroll={handleScroll}
                >
                  {historyLoading ? (
                    <div className="">
                      <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                        Loading...
                      </p>
                    </div>
                  ) : (
                    history.map((item, index) => (
                      <li key={index} className="w-full my-1">
                        <Link
                          href={`/buddy/physics/${item._id}`}
                          onClick={() => setShowMobileSidebar(false)}
                        >
                          <div
                            className={cn(
                              "py-2.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 group rounded-xl overflow-hidden",
                              active === item._id
                                ? "bg-gray-200 dark:bg-neutral-700"
                                : ""
                            )}
                          >
                            <p
                              className={cn(
                                "text-sm font-medium whitespace-nowrap overflow-hidden relative before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:bg-[linear-gradient(270deg,_#ffffff,_transparent)] before:dark:bg-[linear-gradient(270deg,_#171717,_transparent)] before:w-3 before:h-5 group-hover:before:bg-[linear-gradient(270deg,_#e5e7eb,_transparent)] group-hover:before:dark:bg-[linear-gradient(270deg,_#404040,_transparent)]",
                                active === item._id
                                  ? "before:bg-[linear-gradient(270deg,_#e5e7eb,_transparent)] before:dark:bg-[linear-gradient(270deg,_#404040,_transparent)]"
                                  : ""
                              )}
                            >
                              {item?.chat_name}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))
                  )}
                  {historyLoadingMore && (
                    <div className="flex justify-center items-center py-4">
                      <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                        Loading more...
                      </p>
                    </div>
                  )}
                  {initialLoad && !historyLoading && history.length === 0 && (
                    <div className="flex justify-center items-center py-4">
                      <p className="text-center text-neutral-800 dark:text-neutral-100 font-medium text-xs">
                        No history found.
                      </p>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="h-screen flex-auto p-4 bg-gray-100 dark:bg-neutral-700 shadow-md flex flex-col">
          <div className="flex-initial border-b pb-4 border-b-gray-200 dark:border-b-neutral-600">
            <div className="flex">
              <div
                className={cn(
                  "flex-initial flex-row gap-2",
                  !collapsed ? "hidden" : "hidden lg:flex"
                )}
              >
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  onClick={() => router.push("/")}
                  isIconOnly
                >
                  <Icon
                    icon="material-symbols:arrow-back-ios-new"
                    className="text-lg"
                  />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                  onClick={toggleSidebar}
                >
                  <Icon icon="mynaui:sidebar" className="text-lg" />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                >
                  <Icon icon="mynaui:search" className="text-lg" />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                  onClick={() => router.push("/buddy/physics")}
                >
                  <Icon icon="jam:write" className="text-lg" />
                </Button>
              </div>
              <div
                className={cn(
                  "flex-initial flex-row gap-2",
                  showMobileSidebar ? "hidden" : "flex lg:hidden"
                )}
              >
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  onClick={() => router.push("/")}
                  isIconOnly
                >
                  <Icon
                    icon="material-symbols:arrow-back-ios-new"
                    className="text-lg"
                  />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                  onClick={() => setShowMobileSidebar(true)}
                >
                  <Icon icon="mynaui:sidebar" className="text-lg" />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                >
                  <Icon icon="mynaui:search" className="text-lg" />
                </Button>
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                  onClick={() => router.push("/buddy/physics")}
                >
                  <Icon icon="jam:write" className="text-lg" />
                </Button>
              </div>
              <div className="flex-auto"></div>
              <div className="flex-initial flex gap-2">
                {/* darkmode toggeler */}
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-gray-700 dark:text-white bg-content1 rounded-full"
                  isIconOnly
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Icon
                    icon={
                      theme === "dark"
                        ? "material-symbols:dark-mode-outline-rounded"
                        : "material-symbols:light-mode-outline-rounded"
                    }
                    className="text-lg"
                  />
                </Button>
                <Link href="/account/profile">
                  <div className="grid justify-center content-center h-10 w-10 border-2 border-content1 rounded-full">
                    {!user_data?.users_by_pk?.avatar ? (
                      <div className="h-[inherit] w-[inherit] bg-content1 rounded-full"></div>
                    ) : (
                      <img
                        src={user_data?.users_by_pk?.avatar}
                        alt="user avatar"
                        className="rounded-full h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="h-full">{isLoading ? <Loading /> : children}</div>
        </div>
      </div>
    </section>
  );
}
