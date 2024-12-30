"use client";

import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spacer,
  Divider,
  Form,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

export default function ActionCard({
  plan,
  setPlan,
  handleClose,
  handleSubmit,
  loading,
  error,
  ...props
}) {
  const bodyRef = useDetectClickOutside({ onTriggered: handleClose });

  return (
    <div className="fixed z-[999] inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-5">
      <Card className="w-full max-w-[500px]" {...props} ref={bodyRef}>
        <CardHeader className="px-6 pb-0 pt-6">
          <div className="flex flex-col items-start">
            <h4 className="text-large">Choose a Plan</h4>
          </div>
        </CardHeader>
        <Spacer y={2} />
        <CardBody className="px-4">
          <Form
            className="gap-0"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <RadioGroup
              orientation="horizontal"
              isRequired
              value={plan}
              onValueChange={setPlan}
            >
              <Radio value="monthly">Monthly</Radio>
              <Radio value="yearly">Yearly</Radio>
            </RadioGroup>
            {error && (
              <p className="text-danger bg-danger/10 text-xs px-4 py-2 mt-2 w-full rounded-lg">
                {error}
              </p>
            )}
            <Spacer y={6} />
            <Divider />
            <div className="flex w-full flex-wrap-reverse items-center justify-between gap-2 px-4 pt-4 md:flex-wrap">
              <p className="text-small text-default-400"></p>
              <div className="flex items-center gap-2">
                <Button type="reset" variant="bordered" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={!plan}
                  isLoading={loading}
                  onClick={handleSubmit}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
