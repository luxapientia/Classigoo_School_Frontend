"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Badge,
  Avatar,
  Button
} from "@heroui/react";
import { useAuth } from "@contexts/AuthContext";
import Link from "next/link";
import axios from "@lib/axios";
import { useSocket } from "@hooks/useSocket";

export function NotificationDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from backend API
  const fetchNotifications = React.useCallback(async () => {
    // if (!user) return;
    
    try {
      setLoading(true);
      const { data: response } = await axios.get('/v1/notification', {
        params: {
          limit: 20,
          offset: 0
        }
      });
      
      setNotifications(response.data || []);
      setUnreadCount(response.data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notifications on mount and when user changes
  React.useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // Socket
  useSocket("notification.updated", (payload) => {
    if (payload.data.target_id === user.id.toString()) {
      fetchNotifications();
    }
  });

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.post('/v1/notification/mark-as-read', {
        notification_id: notificationId
      });
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.post('/v1/notification/mark-all-read');
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Format notification time
  const formatTime = useCallback((timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }, []);

  // Get notification icon based on content
  const getNotificationIcon = useCallback((content) => {
    if (content.toLowerCase().includes('invited')) return 'solar:user-plus-bold-duotone';
    if (content.toLowerCase().includes('assignment')) return 'solar:document-bold-duotone';
    if (content.toLowerCase().includes('exam')) return 'solar:test-tube-bold-duotone';
    if (content.toLowerCase().includes('commented')) return 'solar:chat-round-like-bold-duotone';
    if (content.toLowerCase().includes('grade')) return 'solar:star-bold-duotone';
    if (content.toLowerCase().includes('post')) return 'solar:post-bold-duotone';
    if (content.toLowerCase().includes('message')) return 'solar:chat-round-like-bold-duotone';
    return 'solar:bell-bold-duotone';
  }, []);

  // Extract sender name from content
  const getSenderName = useCallback((content) => {
    const match = content.match(/^([^]+?)\s/);
    return match ? match[1] : 'User';
  }, []);

  // Set up real-time updates (polling every 30 seconds)
  // useEffect(() => {
  //   if (!user) return;

  //   const interval = setInterval(() => {
  //     // Refresh unread count
  //     setUnreadCount(notifications.filter(n => !n.is_read).length);
  //   }, 30000); // Check every 30 seconds

  //   return () => clearInterval(interval);
  // }, [user, notifications]);

  return (
    <Dropdown 
      isOpen={isOpen} 
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Notifications"
        >
          <Badge 
            color="danger" 
            shape="circle" 
            content={unreadCount > 0 ? unreadCount : ""} 
            size="sm"
            isInvisible={unreadCount === 0}
          >
            <Icon 
              icon="solar:bell-bold" 
              className="w-6 h-6 text-gray-900 dark:text-white" 
            />
          </Badge>
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu 
        aria-label="Notifications"
        className="w-80 max-h-96 overflow-y-auto"
        emptyContent={
          <div className="text-center py-8">
            <Icon icon="solar:bell-off-bold-duotone" className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No notifications</p>
          </div>
        }
      >
        <DropdownItem key="header" className="h-12 px-4" textValue="Notifications header">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="light"
                color="primary"
                onPress={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>
        </DropdownItem>
        
        <DropdownItem key="divider" className="h-px bg-gray-200 dark:bg-gray-700" textValue="Divider" />
        
        {loading ? (
          <DropdownItem key="loading" className="py-8" textValue="Loading notifications">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          </DropdownItem>
        ) : (
          notifications.map((notification) => (
            <DropdownItem 
              key={notification.id}
              className={`px-4 py-3 transition-colors duration-200 ${
                !notification.is_read 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                  : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              onPress={() => markAsRead(notification.id)}
              textValue={`${getSenderName(notification.content)}: ${notification.content}`}
            >
              <Link href={notification.link} className="block w-full">
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar
                      size="sm"
                      src={notification.image}
                      name={getSenderName(notification.content)}
                      className="w-8 h-8 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                      classNames={{
                        base: "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
                        img: "object-cover"
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon 
                        icon={getNotificationIcon(notification.content)} 
                        className={`w-4 h-4 ${
                          !notification.is_read 
                            ? 'text-blue-500' 
                            : 'text-gray-500'
                        }`} 
                      />
                      <p className={`text-sm font-medium truncate ${
                        !notification.is_read 
                          ? 'text-gray-900 dark:text-white font-semibold' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {getSenderName(notification.content)}
                      </p>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                      )}
                    </div>
                    
                    <p className={`text-xs line-clamp-2 ${
                      !notification.is_read 
                        ? 'text-gray-800 dark:text-gray-200 font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {notification.content}
                    </p>
                    
                    <p className={`text-xs mt-1 ${
                      !notification.is_read 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500'
                    }`}>
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
            </DropdownItem>
          ))
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownItem key="divider2" className="h-px bg-gray-200 dark:bg-gray-700" textValue="Divider" />
            <DropdownItem key="view-all" className="text-center text-primary" textValue="View all notifications">
              <Link href="/notifications" className="block w-full">
                View all notifications
              </Link>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
