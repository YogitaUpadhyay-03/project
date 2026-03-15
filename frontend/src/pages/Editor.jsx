import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, saveDoc } from "../services/api";
import socket from "../services/socket";
import EditorToolbar from "../components/EditorToolbar";

const Editor = () => {

  const { id } = useParams();

  const editorRef = useRef(null);

  const [content, setContent] = useState("");

  /* Load document */

  useEffect(() => {

    const loadDoc = async () => {

      const doc = await getDoc(id);

      if (doc && doc.content) {
        setContent(doc.content);
        editorRef.current.innerHTML = doc.content;
      }

    };

    loadDoc();

    /* realtime updates */

    socket.onmessage = (e) => {

      const data = JSON.parse(e.data);

      if (data.docId === id) {
        editorRef.current.innerHTML = data.content;
      }

    };

  }, [id]);


  /* typing handler */

  const onChange = () => {

    const html = editorRef.current.innerHTML;

    setContent(html);

    /* realtime send */

    socket.send(JSON.stringify({
      docId: id,
      content: html
    }));

    /* save to database */

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
        suppressContentEditableWarning={true}
      />

    </div>

  );

};

export default Editor;