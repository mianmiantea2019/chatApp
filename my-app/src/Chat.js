import { Avatar, IconButton,SendIcon } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import db from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';


function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("");

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>> ", input);
    if(input.length === 0){
      return;
    }
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  console.log(messages)
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>

      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${message.name === user.displayName && "chat__reciever"
              }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div style={{display: "flex", alignItems: "flex-end"}}>

        <div className={isPickerVisible ? "d-block" : "d-none"} style={{ position: "absolute" }}>
          {generatePicker((e) => { setCurrentEmoji(e.native); setPickerVisible(!isPickerVisible);setInput(input + e.native ) })}
        </div>
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon onClick={() => setPickerVisible(!isPickerVisible)} />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value )}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send
          </button>
        </form>
      </div>
      <></>
    </div>
  );
}

function generatePicker(callback) {
  return <Picker data={data} previewPosition="none" onEmojiSelect={callback} />
}

export default Chat;
