import { UUID } from "crypto";
import { backend } from "../api";
import { NotificationBackendSenderDataQuery } from "../models/Notification";

export async function getUserNotifications(page: number) {
  try {
    const res = await backend.get<NotificationBackendSenderDataQuery>(
      "/notification/user",
      {
        params: {
          page,
          limit: 1,
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}
export async function deleteNotification(notificationId: UUID) {
  try {
    if (!notificationId) throw Error("Notification id undefined");
    const res = await backend.get<{ status: string }>(
      `/notification/delete/${notificationId}`,
      {
        withCredentials: true,
      }
    );
    return;
  } catch (err) {
    throw err;
  }
}
