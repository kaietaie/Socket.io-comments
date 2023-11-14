import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const ImageComponent = ({ filedest }: { filedest: string }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [extension, setExtension] = useState<string | null>(null);
  //@ts-ignore
  const { auth } = useAuth();

  useEffect(() => {
    if (filedest && filedest.length > 0) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_HOST}:${
              import.meta.env.VITE_PORTAPI
            }/api/posts/file/${filedest}`,
            {
              headers: {
                "content-type": `application/octet-stream`,
                Authorization: "Bearer " + auth.accessToken,
              },
              responseType: "arraybuffer",
            }
          );

          setExtension(filedest.split(".")[1]);

          const base64String = Buffer.from(response.data, "binary").toString(
            "base64"
          );
          setImageData(`data:${extension};base64,${base64String}`);
        } catch (error) {
          console.error("Error fetching image: ", error);
        }
      };

      fetchData();
    }
  }, [filedest, auth.accessToken]);

  if (!filedest || filedest.length === 0) {
    return null;
  }

  if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
    return (
      <div>
        <img
          src={imageData || ""}
          alt="Uploaded image"
          className="post-image"
        />
      </div>
    );
  }

  if (extension === "txt") {
    return (
      <div>
        <a
          ref={imageData}
          target="_blank"
          rel="noopener noreferrer"
          className="post-text-file"
        >
          View Text File
        </a>
      </div>
    );
  }

  return null;
};

export default ImageComponent;
