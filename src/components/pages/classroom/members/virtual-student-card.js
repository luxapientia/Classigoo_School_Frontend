"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Chip, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Snippet, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import axios from "@lib/axios";

export default function VirtualStudentCard({ student, classroomId, isTeacher, onUpdate, onRegenerateCode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [editData, setEditData] = useState({
    name: student.name,
    profile_picture: student.profile_picture || ""
  });

  const [inviteData, setInviteData] = useState({
    email: "",
    role: ["parent"]
  });

  const handleEdit = async () => {
    if (!editData.name.trim()) {
      setError("Student name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put("/v1/classroom/member/virtual-student/update", {
        virtual_student_id: student.id,
        name: editData.name,
        profile_picture: editData.profile_picture
      });

      if (response.data.status === "success") {
        setSuccess(response.data.message);
        if (onUpdate) {
          onUpdate(response.data.data);
        }
        
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update virtual student");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCode = async () => {
    if (student.parent_connected) {
      setError("Cannot regenerate code for connected students");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/v1/classroom/member/virtual-student/regenerate-code", {
        virtual_student_id: student.id
      });

      if (response.data.status === "success") {
        setSuccess("Code regenerated successfully");
        if (onRegenerateCode) {
          onRegenerateCode(student.id, response.data.data.invitation_code);
        }
        
        setTimeout(() => {
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to regenerate code");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    return student.parent_connected ? "success" : "warning";
  };

  const getStatusText = () => {
    return student.parent_connected ? "Connected" : "Available";
  };

  const handleEmailInvite = async () => {
    if (!inviteData.email.trim()) {
      setError("Email address is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use the new method specifically for virtual students
      const response = await axios.post("/v1/classroom/member/virtual-student/invite-parent", {
        class_id: classroomId,
        virtual_student_id: student.id,
        email: inviteData.email.trim()
      });

      if (response.data.status === "success") {
        setSuccess("Parent invited and connected successfully!");
        // setInviteData({ email: "", role: ["parent"] });
        
        // // Refresh the virtual student data to show as connected
        // if (onUpdate) {
        //   onUpdate({ 
        //     ...student, 
        //     parent_connected: true,
        //     parent: { id: 'temp', name: inviteData.email.trim() } // Temporary parent info
        //   });
        // }
        
        // setTimeout(() => {
        //   onInviteClose();
        //   setSuccess("");
        // }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to invite parent");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteClose = () => {
    setInviteData({ email: "", role: ["parent"] });
    setError("");
    setSuccess("");
    onInviteClose();
  };

  const handleRemoveParent = async () => {
    if (!confirm(`Are you sure you want to remove ${student.parent?.name} from ${student.name}?`)) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/v1/classroom/member/virtual-student/remove-parent", {
        virtual_student_id: student.id
      });

      if (response.data.status === "success") {
        setSuccess("Parent removed successfully!");
        
        // Update student data to show as disconnected with new code
        if (onUpdate) {
          onUpdate({ 
            ...student, 
            parent_connected: false,
            parent: null,
            invitation_code: response.data.data.new_invitation_code
          });
        }
        
        setTimeout(() => {
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove parent");
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithParent = () => {
    // if (student.parent?.id) {
    //   // Navigate to chat with the parent
    //   window.location.href = `/chat/${student.parent.id}`;
    // }
  };

  return (
    <>
      <Card className="w-full">
        <CardBody className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                {student.profile_picture ? (
                  <img 
                    src={student.profile_picture} 
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Icon icon="solar:user-line-duotone" className="w-6 h-6 text-white" />
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                <p className="text-sm text-gray-500">Virtual Student</p>
                <Chip 
                  size="sm" 
                  color={getStatusColor()} 
                  variant="flat"
                  className="mt-1"
                >
                  {getStatusText()}
                </Chip>
              </div>
            </div>

            {isTeacher && (
              <div className="flex items-center gap-2">
                <Tooltip content="Edit Student">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onOpen}
                  >
                    <Icon icon="solar:pen-2-line-duotone" className="w-4 h-4" />
                  </Button>
                </Tooltip>
                
                {!student.parent_connected ? (
                  <>
                    <Tooltip content="Invite Parent by Email">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={onInviteOpen}
                      >
                        <Icon icon="solar:letter-line-duotone" className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content="Regenerate Code">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleRegenerateCode}
                        isLoading={loading}
                      >
                        <Icon icon="solar:refresh-line-duotone" className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip content="Chat with Parent">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleChatWithParent}
                        color="primary"
                      >
                        {/* <Icon icon="solar:chat-line-duotone" className="w-4 h-4" /> */}
                        <Icon icon="solar:inbox-line-duotone" className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content="Remove Parent">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleRemoveParent}
                        color="danger"
                        isLoading={loading}
                      >
                        <Icon icon="solar:user-minus-line-duotone" className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </div>

          {student.parent_connected && student.parent && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Icon icon="solar:users-group-line-duotone" className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Connected to: {student.parent.name}
                </span>
              </div>
            </div>
          )}

          {!student.parent_connected && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium">Invitation Methods:</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={onInviteOpen}
                      startContent={<Icon icon="solar:letter-line-duotone" className="w-3 h-3" />}
                      className="text-xs h-6 px-2"
                    >
                      Email (Recommended)
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Or share this code directly:</p>
                  <Snippet
                    symbol=""
                    copyable
                    className="w-full"
                    classNames={{
                      base: "bg-gray-50 dark:bg-gray-800",
                      pre: "text-xs font-mono"
                    }}
                  >
                    {student.invitation_code}
                  </Snippet>
                  <p className="text-xs text-gray-500">
                    Parents can use this code to connect to {student.name} (manual method)
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Edit Virtual Student</h3>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <Input
                isRequired
                label="Student Name"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                variant="bordered"
              />
              
              <Input
                label="Profile Picture URL"
                value={editData.profile_picture}
                onChange={(e) => setEditData(prev => ({ ...prev, profile_picture: e.target.value }))}
                variant="bordered"
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
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleEdit}
              isLoading={loading}
              isDisabled={!editData.name.trim()}
            >
              Update Student
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Email Invitation Modal */}
      <Modal 
        isOpen={isInviteOpen} 
        onClose={handleInviteClose} 
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
            <h3 className="text-lg font-semibold">Invite Parent to {student.name}</h3>
            <p className="text-sm text-gray-500">Send email invitation to connect parent to this virtual student</p>
          </ModalHeader>
          
          <ModalBody>
            <div className="space-y-4">
              <Input
                isRequired
                label="Parent Email"
                placeholder="parent@example.com"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                variant="bordered"
                startContent={<Icon icon="solar:letter-line-duotone" className="text-gray-400" />}
                type="email"
              />
              
              <Select
                label="Role"
                selectedKeys={inviteData.role}
                onChange={(e) => setInviteData(prev => ({ ...prev, role: [e.target.value] }))}
                variant="bordered"
                startContent={<Icon icon="solar:user-line-duotone" className="text-gray-400" />}
              >
                <SelectItem key="parent">Parent</SelectItem>
              </Select>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:info-circle-line-duotone" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">What happens next?</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Parent receives professional email invitation</li>
                      <li>• Parent is automatically connected to {student.name}</li>
                      <li>• Parent can access the classroom immediately</li>
                      <li>• No invitation code needed - seamless connection!</li>
                    </ul>
                  </div>
                </div>
              </div>

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
            <Button variant="light" onPress={handleInviteClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleEmailInvite}
              isLoading={loading}
              isDisabled={!inviteData.email.trim()}
            >
              Send Invitation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
} 