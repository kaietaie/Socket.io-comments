import React, { useState } from "react";
import { PostGraph } from "../interfaces";
import emailValidation from "../safety/validationEmail";
import escapeHtml from "../safety/escapeHTML";
import validateText from "../safety/validateText";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "./posts";
import { Box, TextField } from "@mui/material";

const AddPost = (id?: any) => {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  // const [file, setFile] = useState<Express.Multer.File | null>(null);
  const [isPosted, setIsPosted] = useState(false);

  const [MakePost, { loading }] = useMutation(ADD_POST);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const safetyUser = escapeHtml(user);
      const safetyText = validateText(text);
      const safetyHP = validateText(homePage) || "";
      const safetyEmail = emailValidation(email) || "";

      const post: PostGraph = {
        user: safetyUser,
        email: safetyEmail,
        text: safetyText,
        homePage: safetyHP,
        createdAt: "",
        parentPost: id.id || "",
        filedest: {
          bucket: "comments-ws", 
          key: ""
        }
      };

      MakePost({ variables: { $data: post } });

      if (loading) {
        setIsPosted(!isPosted);
        return "Submitting...";
      }
    } catch (error) {
      console.error("Error whith posting your post", error);
    }
  };
  if (!isPosted) {
    return (
      <div className="post-form">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <TextField
            label="Ваше ім'я"
            type="text"
            placeholder="Ваше ім'я"
            value={user}
            required
            onChange={(event) => setUser(event.target.value)}
          />

          <TextField
            label="Ваша пошта"
            type="email"
            placeholder="Ваша пошта"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Home page"
            type="url"
            placeholder="Home page "
            value={homePage}
            onChange={(event) => setHomePage(event.target.value)}
          />
          <TextField
            placeholder="Введіть текст тут"
            fullWidth
            value={text}
            required
            onChange={(event) => setText(event.target.value)}
          />
          {/* <input
            type="file"
            name="image"
            accept=".jpg, .gif, .png, .txt"
            onChange={(e) => setFile(e.target.files[0]) }
          ></input> */}
          <button type="submit">Відправити</button>
        </Box>
      </div>
    );
  } else {
    return null;
  }
};

export default AddPost;
