import React, { useState } from "react";
import { Post } from "../interfaces";
import axios from "axios";
import emailValidation from "../safety/validationEmail";
import escapeHtml from "../safety/escapeHTML";
import validateText from "../safety/validateText";
import { socket } from "../context/WebSocketContext";

const AddPost = (id?: any) => {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [homePage, setHomePage] = useState("");
  const [file, setFile] = useState<Express.Multer.File | null>(null);
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
        file,
      };

      axios.defaults.baseURL = "http://localhost:3000/api";

      const response = await axios.post("/posts", post);
      if (response.status === 201) {
        const newPost = response.data.newPost;
        setIsPosted(true);
        socket.emit("newPost", newPost);
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
          <input
            type="file"
            name="image"
            accept=".jpg, .gif, .png, .txt"
            onChange={(event) => setFile(event.target.files[0])}
          ></input>
          <button type="submit">Відправити</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="addedPost">
        Post was added!
      </div>
    );
  }
};

export default AddPost;
