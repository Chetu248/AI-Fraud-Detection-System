"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

import { notificationApi } from "@/lib/api/notifications";
import type { NotificationResponse } from "@/types/notification";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    NotificationResponse[] | null
  >(null);

  useEffect(() => {
    async function load() {
      setNotifications(await notificationApi.getAll());
    }

    load();
  }, []);

  const markAsRead = async (id: number) => {
    await notificationApi.markAsRead(id);

    setNotifications(
      (prev) =>
        prev?.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                status: "READ",
                readAt: new Date().toISOString(),
              }
            : notification
        ) ?? null
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your insurance activity."
      />

      {!notifications ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You're all caught up."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "glow-card",
                notification.status === "UNREAD" && "border-primary/30"
              )}
            >
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {notification.type.replaceAll("_", " ")}
                      </Badge>

                      {notification.status === "UNREAD" && <Badge>New</Badge>}
                    </div>

                    <p className="font-medium">{notification.message}</p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {notification.status === "UNREAD" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
