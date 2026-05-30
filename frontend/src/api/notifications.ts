import api from "./client";

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const getUnreadNotifications = () =>
  api.get<NotificationResponse[]>("/notifications/unread");

export const getUnreadCount = () =>
  api.get<number>("/notifications/unread/count");

export const markAsRead = (id: number) =>
  api.put(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  api.put("/notifications/read-all");
