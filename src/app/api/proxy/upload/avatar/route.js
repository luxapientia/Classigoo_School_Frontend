import axios from "axios";

export async function POST(request) {

  // get form data
  const formData = await request.formData();
  formData.append("fileFolder", "profile");

  
  try {
    console.log(formData, 'formData------------');
    const data = await axios.post(`${process.env.BACKEND_API_URL}/v1/account/profile/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return Response.json(data.data);
  } catch (error) {
    return Response.json({ status: "error", message: error.message });
  }
}
