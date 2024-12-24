"use client";

import React from "react";
import { Card, CardHeader, CardBody, Button, Input, Spacer, Divider, Form } from "@nextui-org/react";

export default function ActionCard({ action, handleClose, handleSubmit, error, setError, loading, ...props }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-5">
      <Card className="w-full max-w-[500px]" {...props}>
        <CardHeader className="px-6 pb-0 pt-6">
          <div className="flex flex-col items-start">
            <h4 className="text-large">Are you sure?</h4>
          </div>
        </CardHeader>
        <CardBody className="px-4">
          <p className="text-small text-default-500 mt-1 px-2">
            You are about to delete the parential control over the child. Are you sure you want to proceed?
          </p>
          {error && <p className="text-danger bg-danger/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">{error}</p>}

          <Spacer y={6} />
          <Divider />
          <div className="flex w-full flex-wrap-reverse items-center justify-between gap-2 px-4 pt-4 md:flex-wrap">
            <p className="text-small text-default-400"></p>
            <div className="flex items-center gap-2">
              <Button type="reset" variant="bordered" onClick={handleClose}>
                Cancel
              </Button>
              <Button color="danger" type="submit" isLoading={loading} onClick={handleSubmit}>
                Remove
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
