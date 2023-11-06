import React, { useState } from "react";
import { Post } from "../interfaces";
import axios from "axios";
import validateText from "../safety/validateText";
import { socket } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";
import { Box, TextField } from "@mui/material";

const AddPost = (id?: any) => {
  //@ts-ignore
  const { auth } = useAuth();

  const [text, setText] = useState("");
  // const [email, setEmail] = useState("");
  // const [homePage, setHomePage] = useState("");
  const [file, setFile] = useState<Express.Multer.File | null>(null);
  const [isPosted, setIsPosted] = useState(false);
  const [postResponse, setPostResponse] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const upload = event.target.files[0];
      console.log("upload");
      console.log("upload", upload);
      //@ts-ignore
      setFile(upload);
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
      console.log("post", post);

      axios.defaults.baseURL = `${import.meta.env.VITE_HOST}:${
        import.meta.env.VITE_PORTAPI
      }/api`;

      const response = await axios.post(
        "/posts",
        { post, file },
        {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: "Bearer " + auth.accessToken,
          },
        }
      );
      setPostResponse(response.data.message);
      setTimeout(() => {
        setPostResponse("");
      }, 1000);
      if (response.status === 201) {
        setText("");
        socket.emit("newPost");
        setIsPosted(true);
      }
    } catch (error) {
      console.error("Error whith posting your post");
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
          height={"180px"}
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
            <input
              type="file"
              name="file"
              accept=".jpg, .gif, .png, .txt"
              onChange={handleFileChange}
              value={file?.originalname}
            ></input>
            <button type="submit">Відправити</button>
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
