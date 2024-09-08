import { backend } from "../api";
import { UserAttributes } from "../models/User";

export async function getUserData(): Promise<Omit<UserAttributes, "password">> {
  try {
    const res = await backend.get(`/user/data`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}
