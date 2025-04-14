import { User } from "@heroui/react";
import React from "react";

export default function MemberSelector({ my_id, members, setOpenPicker, audience, setAudience }) {
  console.log("members", members);

  const [selectedMembers, setSelectedMembers] = React.useState([...audience]);
  const [filteredMembers, setFilteredMembers] = React.useState([]);

  // remove all members with role as 'owner' or 'teacher' also status as 'pending' from the list
  React.useEffect(() => {
    if (members) {
      // get full filtered members
      const filteredOthers = members
        .filter((m) => m.role !== "owner" && m.role !== "teacher" && m.status !== "pending")
        .map((m) => ({
          ...m,
        }));

      // remove me if I am in the list
      const filtered = filteredOthers.filter((m) => m.user.id !== my_id);

      // remove me
      setFilteredMembers(filtered);
    }
  }, [members]);

  const handleSelect = (nid) => {
    setSelectedMembers((prev) => {
      if (prev.includes("*")) {
        // remove *
        delete prev[0];
      }

      if (prev.includes(nid)) {
        return prev.filter((p) => p !== nid);
      }
      return [...prev, nid];
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
      <div className="bg-white dark:bg-neutral-700 rounded-lg p-4 max-w-[calc(100%_-_20px)] w-[750px]">
        <h2>Select members to share this exam with</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          <div className="flex items-center w-full cursor-pointer" onClick={() => setSelectedMembers([])}>
            <div
              className={`shadow-lg rounded-lg px-4 py-2 border-2 w-full h-full grid justify-center content-center border-success-500`}
            >
              <p className="py-1 text-center font-medium font-exo h-full">Teachers</p>
            </div>
          </div>
          <div className="flex items-center w-full cursor-pointer" onClick={() => setSelectedMembers(["*"])}>
            <div
              className={`shadow-lg rounded-lg px-4 py-2 border-2 w-full h-full grid justify-center content-center ${
                selectedMembers.length !== 0 && selectedMembers[0] == "*"
                  ? "border-success-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <p className="py-1 text-center font-medium font-exo h-full">All</p>
            </div>
          </div>
          {filteredMembers.map((m) => {
            return (
              <div
                key={m.id}
                className="flex items-center w-full cursor-pointer"
                onClick={() => handleSelect(m.user.id)}
              >
                <div
                  className={`shadow-lg rounded-lg px-4 py-2 border-2 w-full h-full grid content-center ${
                    selectedMembers.includes(m.user.id) || selectedMembers[0] == "*"
                      ? "border-success-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <User
                    avatarProps={{
                      src: m.user.avatar,
                    }}
                    // description={<h4 className="text-sm text-gray-500 dark:text-gray-400">{m.user.email}</h4>}
                    name={m.user.name}
                    size="md"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <p className="italic text-xs text-gray-500 dark:text-gray-400">
            <span className="text-danger-500 text-sm">*</span>
            Though you have choosen to share this exam with selected members, the exam will still be visible to all the
            teachers and owners of the classroom.
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            className="text-sm bg-black text-white px-4 py-2 rounded-lg mr-2"
            onClick={() => setOpenPicker(false)}
          >
            Close
          </button>

          <button
            className="text-sm bg-primary text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setAudience(selectedMembers);
              setOpenPicker(false);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
