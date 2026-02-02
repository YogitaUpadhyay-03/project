import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, saveDoc } from "../services/api";
import socket from "../services/socket";
import EditorToolbar from "../components/EditorToolbar";

const Editor = () => {
  const { id } = useParams();
  const editorRef = useRef();
  const [content, setContent] = useState("");

  useEffect(() => {
    getDoc(id).then(d => {
      setContent(d.content);
      editorRef.current.innerHTML = d.content;
    });

    socket.onmessage = e => {
      editorRef.current.innerHTML = e.data;
    };
  }, []);

  const onChange = () => {
    const html = editorRef.current.innerHTML;
    setContent(html);

    socket.send(JSON.stringify({ docId: id, content: html }));
    saveDoc(id, html);
  };

  return (
    <div>
      <EditorToolbar />
      <div
        ref={editorRef}
        contentEditable
        className="editor"
        onInput={onChange}
      />
    </div>
  );
};

export default Editor;