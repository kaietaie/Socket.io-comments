import React, { useState } from "react";
import { Post } from "../interfaces";
import axios from "axios";
import emailValidation from "../safety/validationEmail";
import escapeHtml from "../safety/escapeHTML";
import validateText from "../safety/validateText";
import { socket } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";
import { Input, TextareaAutosize } from "@mui/base";
import { Box, TextField } from "@mui/material";

const AddPost = (id?: any) => {
  const { auth } = useAuth();

  const [user, setUser] = useState(auth?.user?.username);
  const [text, setText] = useState("");
  // const [email, setEmail] = useState("");
  // const [homePage, setHomePage] = useState("");
  const [file, setFile] = useState<Express.Multer.File | null>(null);
  const [isPosted, setIsPosted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const safetyUser = escapeHtml(user);
      const safetyText = validateText(text);
      // const safetyHP = validateText(homePage);
      // const safetyEmail = emailValidation(email) || "";
      const post: Post = {
        user: safetyUser,
        text: safetyText,
        createdAt: "",
        parentPost: id.id || "",
        file,
      };

      axios.defaults.baseURL = "http://localhost:3000/api";

      const response = await axios.post("/posts", post);
      if (response.status === 201) {
        const newPost = response.data.newPost;
        setText("");
        socket.emit("newPost", newPost);
      }
    } catch (error) {
      console.error("Error whith posting your post");
    }
  };
  do {
    
  
    return (
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '75ch' },
      }}
      onSubmit={handleSubmit}
      autoComplete="off"
      >
      <div  className="post-form">
        {/* <form  className="form"> */}
          <TextField
            label="Ваше ім'я"
            type="text"
            placeholder="Ваше ім'я"
            value={user}
            required
            onChange={(event) => setUser(event.target.value)}
            />
          {/* <input
            type="email"
            placeholder="Ваша пошта"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
            />
            <input
            type="url"
            placeholder="Home page "
            value={homePage}
            onChange={(event) => setHomePage(event.target.value)}
          /> */}
        
          <TextField
            placeholder="Введіть текст тут"
            value={text}
            required
            multiline
            rows={4}
            onChange={(event) => setText(event.target.value)}
            />
          <input
            type="file"
            name="image"
            accept=".jpg, .gif, .png, .txt"
            onChange={(event) => setFile(event.target.files[0])}
            ></input>
          <button type="submit">Відправити</button>
        {/* </form> */}
      </div>
      </Box>
    );
} while (id.id && !isPosted); 
}
  
  export default AddPost;
