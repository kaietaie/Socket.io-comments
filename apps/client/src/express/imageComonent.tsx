import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { url } from "../urlToBE";

const ImageComponent = ({ filedest }: { filedest: string }) => {
  const [imageData, setImageData] = useState<string>("");
  const [extension, setExtension] = useState<string | null>(null);
  //@ts-ignore
  const { auth } = useAuth();

  const fileExist = filedest.length > 0;
  const fetchData = async (filedest: string) => {
    try {
      const response = await axios.get(`${url}/api/posts/file/${filedest}`, {
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: "Bearer " + auth.accessToken,
        },
        responseType: "arraybuffer",
      });
      setExtension(filedest.split(".")[1]);
      let type;
      if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        type = `image/${extension}`;
      } else if (extension === "txt") {
        type = "text/plain";
      }

      const blob = new Blob([response.data], { type });
      const dataUrl = URL.createObjectURL(blob);

      setImageData(dataUrl);
    } catch (error) {
      console.error("Error fetching image: ", error);
    }
  };

  useEffect(() => {
    if (fileExist) {
      fetchData(filedest);
    }
  }, []);

  if (!filedest || filedest.length === 0) {
    return null;
  }

  if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
    return (
      <div>
        <img src={imageData} alt="Uploaded image" className="post-image" />
      </div>
    );
  }

  if (extension === "txt") {
    return (
      <div>
        <a
          href={imageData || ""}
          target="_blank"
          rel="noopener noreferrer"
          className="post-text-file"
        >
          <pre className="post-text-file-content">View text file</pre>
        </a>
      </div>
    );
  }

  return null;
};

export default ImageComponent;
