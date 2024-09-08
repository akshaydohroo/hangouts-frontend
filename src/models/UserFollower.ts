import { UserAttributes } from "./User";
export type UserFollowerAttributes = {
  connectionId?: string;
  userId: string;
  followerId: string;
  status: "accepted" | "pending";
};
export interface UserWithFollower extends UserAttributes {
  followers?: ({
    connection: UserFollowerAttributes;
  } & Omit<UserAttributes, "password">)[];
}

export type UserFollowOptionsQuery = {
  count: number;
  totalPages: number;
  rows: UserWithFollower[];
};
export class UserFollower {
  public connectionId?: string;
  public userId: string = "";
  public followerId: string = "";
  public status: "accepted" | "pending" = "pending";
  constructor(params: UserFollowerAttributes) {
    Object.assign(this, params);
  }

}
