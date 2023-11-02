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
  // const [file, setFile] = useState<Express.Multer.File | null>(null);
  const [isPosted, setIsPosted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const safetyText = validateText(text);
      const post: Post = {
        text: safetyText,
        parentPost: id.id || "",
        // file,
      };

      axios.defaults.baseURL =  `${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORTAPI}/api`;

      const response = await axios.post("/posts", post, {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + auth.accessToken,
        },
      });
      if (response.status === 201) {
        setText("");
        socket.emit("newPost");
        setIsPosted(true)
      }
    } catch (error) {
      console.error("Error whith posting your post");
    }
  };
  while (!id.id || !isPosted)
  {
    
  
    return (
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1 },
      }}
      onSubmit={handleSubmit}
      autoComplete="off"
      >
      <div  className="post-form">
          <TextField
            placeholder="Введіть текст тут"
            fullWidth
            value={text}
            required
            multiline
            rows={4}
            onChange={(event) => setText(event.target.value)}
            />
          {/* <input
            type="file"
            name="image"
            accept=".jpg, .gif, .png, .txt"
            onChange={(event) => setFile(event.target.files[0])}
            ></input> */}
          <button type="submit">Відправити</button>
      </div>
      </Box>
    );
} 
}
  
  export default AddPost;
