import { UUID } from "crypto";
import { backend } from "../api";
import { UserAttributes } from "./User";
type NotificationBackendAttributes = {
  notificationId: UUID;
  notificationType: NotificationBackendType;
  notificationMessage?: string;
  senderId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};
export type NotificationBackendType = "like" | "comment" | "follow" | "message";
export type NotificationBackendSenderDataQuery = {
  count: number;
  totalPages: number;
  rows: NotificationBackendWithSender[];
};
export interface NotificationBackendWithSender extends NotificationBackend {
  sender: Pick<UserAttributes, "name" | "picture" | "userName" | "id">;
}
export class NotificationBackend {
  public notificationId?: UUID;
  public notificationType: NotificationBackendType = "like";
  public notificationMessage: string = "";
  public senderId: string = "";
  public userId: string = "";
  public createdAt?: string;
  public updatedAt?: string;
  constructor(params: NotificationBackendAttributes) {
    Object.assign(this, params);
  }
}
