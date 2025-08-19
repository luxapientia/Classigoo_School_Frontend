"use client";

import React, { useState } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Alert } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "@lib/axios";

export default function ConnectVirtualStudent({ onSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const handleSubmit = async () => {
    if (!invitationCode.trim()) {
      setError("Invitation code is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/v1/classroom/member/virtual-student/connect-parent", {
        invitation_code: invitationCode.trim()
      });

      if (response.data.status === "success") {
        setSuccess(response.data.message);
        setInvitationCode("");
        
        // Call success callback to refresh data
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to virtual student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInvitationCode("");
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <>
      <Button
        color="primary"
        variant="flat"
        onPress={onOpen}
        startContent={<Icon icon="solar:user-plus-line-duotone" />}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white"
      >
        Connect to Student
      </Button>

      <Modal isOpen={isOpen}
        onClose={handleClose}
        size="md"
        backdrop="blur"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border-none bg-background/95 dark:bg-background/95 backdrop-blur-md",
          header: "border-b-[1px] border-divider",
          body: "py-6",
          footer: "border-t-[1px] border-divider",
        }}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Connect to Virtual Student</h3>
            <p className="text-sm text-gray-500">Enter the invitation code provided by the teacher</p>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:info-circle-line-duotone" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to connect:</h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>1. Ask the teacher for your child's invitation code</li>
                      <li>2. Enter the code below</li>
                      <li>3. You'll be connected to your child's virtual student profile</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Input
                isRequired
                label="Invitation Code"
                placeholder="Enter the 10-character code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                variant="bordered"
                startContent={<Icon icon="solar:key-line-duotone" className="text-gray-400" />}
                maxLength={10}
                description="The code should be exactly 10 characters long"
              />

              {error && (
                <Alert
                  color="danger"
                  variant="flat"
                  startContent={<Icon icon="solar:close-circle-line-duotone" />}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  color="success"
                  variant="flat"
                  startContent={<Icon icon="solar:check-circle-line-duotone" />}
                >
                  {success}
                </Alert>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="light" onPress={handleClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleSubmit}
              isLoading={loading}
              isDisabled={!invitationCode.trim() || invitationCode.trim().length !== 10}
            >
              Connect to Student
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 