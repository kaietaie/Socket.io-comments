import React, { useState } from "react";
import { Post } from "../interfaces";
import validateText from "../safety/validateText";
import { socket } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";
import { Box, Button, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddPost = (id?: any) => {
  //@ts-ignore
  const { auth } = useAuth();

  const [text, setText] = useState("");
  const [file, setFile] = useState<Express.Multer.File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isPosted, setIsPosted] = useState(false);
  const [postResponse, setPostResponse] = useState<string>("");
  const [postError, setPostError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const upload = event.target.files[0];
      //@ts-ignore
      const extention = upload.name.split(".").pop().toLowerCase();
      const validFormats = ["jpeg", "jpg", "png", "gif", "txt"];

      if (extention === "txt" && upload.size > 102400) {
        setPostError("Max size 100Kb");
        setFile(null);
        setFileName("");
        setFileSize(0);
        return;
      } else if (!validFormats.includes(extention)) {
        setPostError("Invalid file format");
        setFile(null);
        setFileName("");
        setFileSize(0);
        return;
      } else {
        setPostError('')
        //@ts-ignore
        setFile(upload);
        setFileName(upload.name);
        setFileSize(upload.size);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const safetyText = validateText(text);
      const post: Post = {
        text: safetyText,
        parentPost: id.id || "",
      };
      let uploadfile = {
        fileName,
        fileSize,
        file,
      };
      socket.emit(
        "newPost",
        { post, uploadfile, authorization: "Bearer " + auth.accessToken },
        (status: any) => {
          setPostResponse(status);
        }
      );
      setText("");
      setFile(null);
      setFileName("");
      setIsPosted(true);
    } catch (error) {
      console.error("Error whith posting your post", error);
    }
  };

  while (!id.id || !isPosted) {
    return (
      <div>
        {postResponse.length > 1 ? (
          <div>
            <span className="post-response">{postResponse}</span>
          </div>
        ) : (
          <div></div>
        )}
        <Box
          component="form"
          height={"220px"}
          maxWidth={"600px"}
          m={3}
          p={2}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="post-form">
            <TextField
              placeholder="Введіть текст тут"
              fullWidth
              value={text}
              required
              multiline
              rows={4}
              onChange={(event) => setText(event.target.value)}
            />
            <div className="post-buttons">
              <div>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ marginRight: "1rem" }}
                >
                  Upload File
                  <input
                    hidden
                    type="file"
                    name="file"
                    accept=".jpg, .gif, .png, .txt"
                    onChange={handleFileChange}
                  />
                </Button>
                {fileName}
              </div>
              <Button variant="contained" type="submit">
                Відправити
              </Button>
            </div>
            <p className="error-message">{postError ? postError : ""}</p>
          </div>
        </Box>
      </div>
    );
  }
  if (postResponse) {
    return (
      <div>
        <span className="post-response">{postResponse}</span>
      </div>
    );
  }
};

export default AddPost;
