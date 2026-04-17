import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDoc, saveDoc } from "../services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Editor.css";
import { getSocket } from "../services/socket";

const Editor = () => {

  const { id } = useParams();

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [cursors, setCursors] = useState({});
  const [users, setUsers] = useState([]);

  const userRef = useRef(null);
  const socketRef = useRef(null);

  /* USER (PERSIST) */
  const getOrCreateUser = () => {
    let user = localStorage.getItem("user");

    if (!user) {
      user = {
        id: "user-" + Date.now(),
        name: "User 1",
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      };
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      user = JSON.parse(user);
    }

    return user;
  };

  /* LOAD DOC */
  useEffect(() => {
    getDoc(id).then(d => {
      setContent(d.content || "");
      setTitle(d.title || "");
    });
  }, [id]);

  /* SOCKET SETUP */
  useEffect(() => {

    socketRef.current = getSocket();
    const socket = socketRef.current;

    const user = getOrCreateUser();
    userRef.current = user;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "join",
        user
      }));
    };

    socket.onmessage = (e) => {

      const data = JSON.parse(e.data);

      if (data.type === "users") {
        setUsers(data.users);
      }

      if (data.type === "content" && data.docId === id) {
        setContent(data.content);
      }

      if (data.type === "cursor" && data.docId === id) {
        setCursors(prev => ({
          ...prev,
          [data.user.id]: data
        }));
      }

    };

  }, [id]);

  /* TYPING */
  const handleChange = (value) => {

    setContent(value);

    const socket = socketRef.current;

    if (socket.readyState === 1) {
      socket.send(JSON.stringify({
        type: "content",
        docId: id,
        content: value
      }));
    }

  };

  /* CURSOR */
  const handleMouseMove = (e) => {

    const socket = socketRef.current;

    if (!userRef.current || socket.readyState !== 1) return;

    socket.send(JSON.stringify({
      type: "cursor",
      docId: id,
      user: userRef.current,
      x: e.clientX,
      y: e.clientY
    }));

  };

  /* SAVE */
  const handleSave = () => {
    saveDoc(id, content, title);
  };

  return (
    <div className="editor-page">

      <div className="editor-header">

        <input
          className="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="header-right">

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>

          <div className="users">
            {users
              .filter(u => u.id !== userRef.current?.id)
              .map(u => (
                <div
                  key={u.id}
                  className="user-avatar"
                  style={{ background: u.color }}
                >
                  {u.name[0]}
                </div>
              ))}
          </div>

        </div>

      </div>

      <div className="editor-container" onMouseMove={handleMouseMove}>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleChange}
        />

      </div>

      {Object.values(cursors)
        .filter(c => c.user.id !== userRef.current?.id)
        .map(c => (
          <div
            key={c.user.id}
            style={{
              position: "fixed",
              left: c.x,
              top: c.y,
              pointerEvents: "none",
              zIndex: 999
            }}
          >
            <div style={{
              width: "8px",
              height: "8px",
              background: c.user.color,
              borderRadius: "50%"
            }} />
            <div style={{
              fontSize: "11px",
              background: c.user.color,
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px"
            }}>
              {c.user.name}
            </div>
          </div>
        ))}

    </div>
  );
};

export default Editor;