"use client";

import React, { useState } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "@lib/axios";

export default function CreateVirtualStudent({ classroomId, onSuccess, isTeacher }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    profile_picture: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Student name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/v1/classroom/member/virtual-student/create", {
        ...formData,
        classroom_id: classroomId
      });

      if (response.data.status === "success") {
        setSuccess(response.data.message);
        setFormData({ name: "", profile_picture: "" });
        
        // Call success callback to refresh data
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create virtual student");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", profile_picture: "" });
    setError("");
    setSuccess("");
    onClose();
  };

  if (!isTeacher) return null;

  return (
    <>
      <Button
        color="primary"
        variant="flat"
        onPress={onOpen}
        startContent={<Icon icon="solar:user-plus-line-duotone" />}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      >
        Create Virtual Student
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        size="md"
        backdrop="blur"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border-none bg-background/95 dark:bg-background/95 backdrop-blur-md",
          header: "border-b-[1px] border-divider",
          body: "py-6",
          footer: "border-t-[1px] border-divider",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Create Virtual Student</h3>
            <p className="text-sm text-gray-500">Add a new virtual student to your classroom</p>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <Input
                isRequired
                label="Student Name"
                placeholder="Enter student's name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                variant="bordered"
                startContent={<Icon icon="solar:user-line-duotone" className="text-gray-400" />}
              />
              
              <Input
                label="Profile Picture URL (Optional)"
                placeholder="Enter image URL"
                value={formData.profile_picture}
                onChange={(e) => handleInputChange("profile_picture", e.target.value)}
                variant="bordered"
                startContent={<Icon icon="solar:image-line-duotone" className="text-gray-400" />}
                description="Leave empty to use default avatar"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
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
              isDisabled={!formData.name.trim()}
            >
              Create Student
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 