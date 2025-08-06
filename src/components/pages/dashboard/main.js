"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader, Progress, Button, Chip, Avatar } from "@heroui/react";
import { HeaderSlot } from "@components/layout/header";
import Link from "next/link";

export default function DashboardMain({ user }) {
  const [stats, setStats] = useState({
    totalClassrooms: 0,
    activeStudents: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    upcomingExams: 0,
    recentActivities: [],
    topPerformers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const mockStats = {
        totalClassrooms: 12,
        activeStudents: 156,
        totalAssignments: 45,
        completedAssignments: 38,
        upcomingExams: 3,
        recentActivities: [
          {
            id: 1,
            type: "assignment",
            title: "Math Assignment #5 submitted",
            time: "2 hours ago",
            user: "Sarah Johnson"
          },
          {
            id: 2,
            type: "exam",
            title: "Science Exam scheduled",
            time: "4 hours ago",
            user: "Dr. Smith"
          },
          {
            id: 3,
            type: "classroom",
            title: "New student joined Physics 101",
            time: "6 hours ago",
            user: "Mike Davis"
          }
        ],
        topPerformers: [
          {
            id: 1,
            name: "Sarah Johnson",
            grade: "A+",
            subject: "Mathematics",
            progress: 95
          },
          {
            id: 2,
            name: "Alex Chen",
            grade: "A",
            subject: "Physics",
            progress: 92
          },
          {
            id: 3,
            name: "Emma Wilson",
            grade: "A-",
            subject: "Chemistry",
            progress: 88
          }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "assignment":
        return "solar:notebook-minimalistic-bold-duotone";
      case "exam":
        return "solar:test-tube-bold-duotone";
      case "classroom":
        return "solar:book-2-bold-duotone";
      default:
        return "solar:bell-bold-duotone";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "assignment":
        return "success";
      case "exam":
        return "warning";
      case "classroom":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <HeaderSlot>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon icon="solar:home-smile-angle-bold-duotone" className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </div>
      </HeaderSlot>

      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Welcome back, {user?.name || "Teacher"}! 👋
              </h2>
              <p className="text-default-600 dark:text-default-400">
                Here's what's happening in your classrooms today.
              </p>
            </div>
            <div className="hidden md:block">
              <Icon icon="solar:home-smile-angle-bold-duotone" className="w-16 h-16 text-primary/60" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-default-500">Total Classrooms</p>
                <p className="text-2xl font-bold">{stats.totalClassrooms}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon icon="solar:book-2-bold-duotone" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-default-500">Active Students</p>
                <p className="text-2xl font-bold">{stats.activeStudents}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-full">
                <Icon icon="solar:users-group-rounded-bold-duotone" className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-default-500">Total Assignments</p>
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                <p className="text-small text-success">
                  {Math.round((stats.completedAssignments / stats.totalAssignments) * 100)}% completed
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-full">
                <Icon icon="solar:notebook-minimalistic-bold-duotone" className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-danger">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-default-500">Upcoming Exams</p>
                <p className="text-2xl font-bold">{stats.upcomingExams}</p>
              </div>
              <div className="p-3 bg-danger/10 rounded-full">
                <Icon icon="solar:test-tube-bold-duotone" className="w-6 h-6 text-danger" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:clock-circle-bold-duotone" className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recent Activities</h3>
              </div>
              <Button size="sm" variant="light" color="primary">
                View All
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-4 p-6">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-default-50 dark:hover:bg-default-100/50 transition-colors">
                    <Avatar
                      name={activity.user}
                      size="sm"
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Chip
                          size="sm"
                          color={getActivityColor(activity.type)}
                          variant="flat"
                          startContent={<Icon icon={getActivityIcon(activity.type)} className="w-3 h-3" />}
                        >
                          {activity.type}
                        </Chip>
                        <span className="text-small text-default-500">{activity.time}</span>
                      </div>
                      <p className="font-medium text-default-900">{activity.title}</p>
                      <p className="text-small text-default-500">by {activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Top Performers */}
        <div>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:trophy-bold-duotone" className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-semibold">Top Performers</h3>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-4 p-6">
                {stats.topPerformers.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-default-50 dark:hover:bg-default-100/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar
                          name={student.name}
                          size="sm"
                        />
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 bg-warning rounded-full p-1">
                            <Icon icon="solar:trophy-bold-duotone" className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-default-900 truncate">{student.name}</p>
                        <p className="text-small text-default-500">{student.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{student.grade}</p>
                      <Progress
                        size="sm"
                        value={student.progress}
                        color="success"
                        aria-label={`${student.progress}%`}
                        className="w-16"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon="solar:flash-bold-duotone" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              as={Link}
              href="/classrooms"
              variant="bordered"
              color="primary"
              startContent={<Icon icon="solar:book-2-bold-duotone" />}
              className="h-16"
            >
              Create Classroom
            </Button>
            <Button
              as={Link}
              href="/notes"
              variant="bordered"
              color="success"
              startContent={<Icon icon="solar:notebook-minimalistic-bold-duotone" />}
              className="h-16"
            >
              Add Notes
            </Button>
            <Button
              as={Link}
              href="/learning"
              variant="bordered"
              color="warning"
              startContent={<Icon icon="solar:lightbulb-bold-duotone" />}
              className="h-16"
            >
              Learning Tools
            </Button>
            <Button
              as={Link}
              href="/settings"
              variant="bordered"
              color="default"
              startContent={<Icon icon="solar:settings-bold-duotone" />}
              className="h-16"
            >
              Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 