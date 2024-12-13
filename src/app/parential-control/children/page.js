"use client";
import { Table, TableHeader, TableColumn, TableBody } from "@nextui-org/react";

export default function ChildrenPage() {
  return (
    <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>Avatar</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
    </Table>
  );
}
