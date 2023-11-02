import React, { useState } from "react";
import { PostGraph } from "../interfaces";
import emailValidation from "../safety/validationEmail";
import escapeHtml from "../safety/escapeHTML";
import validateText from "../safety/validateText";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "./posts";
import { TextField } from "@mui/material";

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
        // file,
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
        <form onSubmit={handleSubmit}>
         <TextField
            label="Ваше ім'я"
            type="text"
            placeholder="Ваше ім'я"
            value={user}
            required
            onChange={(event) => setUser(event.target.value)}
            />
            {/* <input
            type="text"
            placeholder="Ваше ім'я"
            value={user}
            required
            onChange={(event) => setUser(event.target.value)}
          /> */}
          <input
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
          />
          <textarea
            placeholder="Введіть текст тут"
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
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default AddPost;
