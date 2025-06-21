import axios from "axios";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token").value;
  return token;
}

export async function getUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  try {
    const { data: response } = await axios.get(`${process.env.BACKEND_API_URL}/v1/account/me`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });
  
    if (response.status === "success") {
      return response.data;
    }

    return null;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return { status: "error", message: "Unauthorized" };
    } else {
      return { status: "error", message: error.message };
    }
  }
}