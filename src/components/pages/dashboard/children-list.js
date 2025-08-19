"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Avatar, Chip, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import axios from "@lib/axios";
import ConnectVirtualStudent from "./connect-virtual-student";

export default function ChildrenList({ 
  user, 
  virtualStudents = null, 
  loading: externalLoading = null, 
  onRefresh = null,
  showHeader = true
}) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/v1/classroom/member/virtual-student/parent/${user.id}`);
      
      if (response.data.status === "success") {
        setChildren(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if external data is not provided
    if (virtualStudents === null) {
      fetchChildren();
    }
  }, [user.id, virtualStudents]);

  // Use external data if provided, otherwise use internal state
  const displayChildren = virtualStudents !== null ? virtualStudents : children;
  const displayLoading = externalLoading !== null ? externalLoading : loading;

  const handleNewChildConnected = (childData) => {
    if (onRefresh) {
      onRefresh(); // Call parent refresh function if provided
    } else {
      setChildren(prev => [...prev, childData]);
    }
  };

  if (displayLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon icon="solar:close-circle-line-duotone" className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Children</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button color="primary" variant="flat" onPress={onRefresh || fetchChildren}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Children</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your children's classroom access</p>
          </div>
          <ConnectVirtualStudent onSuccess={handleNewChildConnected} />
        </div>
      )}

      {/* Children List */}
      {displayChildren.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
          <Icon icon="solar:users-group-line-duotone" className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">No Children Connected Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't connected to any virtual students yet. Ask your child's teacher for an invitation code to get started.
          </p>
          {showHeader && <ConnectVirtualStudent onSuccess={handleNewChildConnected} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayChildren.map((child) => (
            <Card key={child.id} className="w-full hover:shadow-lg transition-shadow duration-200">
              <CardBody className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={child.profile_picture}
                      name={child.name}
                      size="lg"
                      radius="full"
                      isBordered
                      className="bg-gradient-to-br from-blue-400 to-purple-600"
                    />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {child.name}
                      </h4>
                      <Chip 
                        size="sm" 
                        color="success" 
                        variant="flat"
                        startContent={<Icon icon="solar:check-circle-line-duotone" className="w-3 h-3" />}
                      >
                        Connected
                      </Chip>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon icon="solar:book-2-line-duotone" className="w-4 h-4" />
                    <span>Classroom: {child.classroom.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon icon="solar:user-line-duotone" className="w-4 h-4" />
                    <span>Teacher: {child.created_by.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Icon icon="solar:calendar-line-duotone" className="w-4 h-4" />
                    <span>Connected: {new Date(child.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href={`/classroom/${child.classroom.id}/home`}>
                    <Button 
                      color="primary" 
                      variant="flat" 
                      className="w-full"
                      startContent={<Icon icon="solar:eye-line-duotone" />}
                    >
                      View Classroom
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      {children.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Icon icon="solar:info-circle-line-duotone" className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Need to connect another child?</h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                If you have another child in a different classroom, you can connect to them using their invitation code.
              </p>
              <ConnectVirtualStudent onSuccess={handleNewChildConnected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 