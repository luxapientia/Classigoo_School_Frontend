import axios from "axios";
import { auth0 } from "@lib/auth0";

export async function POST(request) {
  const { user } = await auth0.getSession();

  if (!user.sub) {
    return Response.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  // get form data
  const formData = await request.formData();
  formData.append("user_id", user.sub);

  try {
    const data = await axios.post(`${process.env.CLASSROOM_ACTIONS_BASE_URL}/v1/upload-post-file`, formData, {
      headers: {
        "x-secret": process.env.CLASSROOM_ACTIONS_SECRET,
      },
    });

    return Response.json(data.data);
  } catch (error) {
    return Response.json({ status: "error", message: error.message });
  }
}
