export async function getURL(f: File | undefined) {
  if (f === undefined) return;
  console.log("f: ", f);

  const { url } = await fetch("http://3.145.39.154:3000/s3Url").then((res) =>
    res.json()
  );

  console.log("url", url);

  try {
    await fetch(url.uploadURL, {
      method: "PUT",
      body: f,
      headers: {
        "Content-Type": f.type === "video/mp4" ? "video/mp4" : "audio/mp3",
      },
    });
    console.log("success: ", url.imageName);
    const urlBase = "https://d1ugggz6h4f19m.cloudfront.net/";
    return urlBase + url.imageName;
    // return urlBase + "testing123";
  } catch (e) {
    console.error(e);
    return "error";
  }
}

export const uploadYoutube = async (url: string) => {
  try {
    const response = await fetch("http://3.145.39.154:3000/ytUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // This header tells the server to expect JSON data
      },
      body: JSON.stringify({ url: url }), // The body is a stringified JSON object
    });
    const data = await response.json();
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
