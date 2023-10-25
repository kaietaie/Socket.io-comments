import React, { useState } from "react";
import { Post } from "../interfaces";
import emailValidation from "../safety/validationEmail";
import escapeHtml from "../safety/escapeHTML";
import validateText from "../safety/validateText";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "./posts";

const AddPost = (id?: any) => {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [isPosted, setIsPosted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const safetyUser = escapeHtml(user);
      const safetyText = validateText(text);
      const safetyHP = validateText(homePage);
      const safetyEmail = emailValidation(email) || "";

      const post: Post = {
        user: safetyUser,
        email: safetyEmail,
        text: safetyText,
        homePage: safetyHP,
        createdAt: "",
        parentPost: id.id || "",
      };
      const [MakePost, {  loading }] = useMutation(ADD_POST);
      
      MakePost({ variables: { $data: post } });

      if (loading) {
        setIsPosted(!isPosted)
        return "Submitting...";
      }
     
    } catch (error) {
      console.error("Error whith posting your post");
    }
  };
  if (!isPosted) {
    return (
      <div className="post-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={user}
            required
            onChange={(event) => setUser(event.target.value)}
          />
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

          <button type="submit">Відправити</button>
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default AddPost;
