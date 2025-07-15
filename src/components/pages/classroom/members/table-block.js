"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const statusColorMap = {
  accepted: "success",
  paused: "danger",
  vacation: "warning",
};

export default function MembersTable({
  relations,
  user,
  setChangeID,
  setChangeRole,
  setShowRemove,
  setRmMemberID,
}) {
  // current user id is in user._id
  const currentUserRelation = relations.find((r) => r.user.id === user._id);

  // sort relations like owner 1st then teacher then student
  const rltns = relations.sort((a, b) => {
    if (a.role === "owner") return -1;
    if (b.role === "owner") return 1;
    if (a.role === "teacher") return -1;
    if (b.role === "teacher") return 1;
    if (a.role === "student") return -1;
    if (b.role === "student") return 1;
    return 0;
  });

  const setChangeData = (data) => {
    setChangeID(data.id);
    setChangeRole(data.role);
  };

  const setRemoveData = (id, uid) => {
    setChangeID(id);
    setRmMemberID(uid);
    setShowRemove(true);
  };

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        classNames={{
          base: "border-3 rounded-2xl dark:border-gray-700",
        }}
      >
        <TableHeader>
          <TableColumn align="start">NAME</TableColumn>
          <TableColumn align="start">ROLE</TableColumn>
          <TableColumn align="status">STATUS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {rltns.map((r) => {
            return (
              <TableRow key={r._id}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "lg", src: r.user.avatar.url }}
                    description={r.user.email}
                    name={r.user.name}
                  >
                    {r.user.email}
                  </User>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">{r.role}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[r.status?.toLowerCase()]}
                    size="sm"
                    variant="flat"
                  >
                    {r.status}
                  </Chip>
                </TableCell>
                <TableCell className="">
                  <div className="relative flex items-center justify-center gap-2">
                    <Tooltip color="success" content="Details">
                      <button>
                        <span className="text-lg text-success cursor-pointer active:opacity-50">
                          <Icon
                            icon="solar:eye-line-duotone"
                            width="24"
                            height="24"
                          />
                        </span>
                      </button>
                    </Tooltip>

                    {currentUserRelation.role === "owner" ||
                    currentUserRelation.role === "teacher" ? (
                      r.role === "owner" ? null : (
                        <Tooltip color="warning" content="Edit user">
                          <button
                            onClick={() =>
                              setChangeData({
                                id: r._id,
                                role: [r.role.toLowerCase()],
                              })
                            }
                          >
                            <span className="text-lg text-warning cursor-pointer active:opacity-50">
                              <Icon
                                icon="solar:pen-2-line-duotone"
                                width="24"
                                height="24"
                              />
                            </span>
                          </button>
                        </Tooltip>
                      )
                    ) : null}
                    {currentUserRelation.role === "owner" ||
                    currentUserRelation.role === "teacher" ||
                    currentUserRelation.user._id === r.user.id ? (
                      r.role === "owner" ? null : (
                        <Tooltip
                          color="danger"
                          content={
                            currentUserRelation.user._id === r.user.id
                              ? "Leave"
                              : "Remove user"
                          }
                        >
                          <button
                            onClick={() => setRemoveData(r._id, r.user.id)}
                          >
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                              <Icon
                                icon="solar:trash-bin-trash-line-duotone"
                                width="24"
                                height="24"
                              />
                            </span>
                          </button>
                        </Tooltip>
                      )
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
