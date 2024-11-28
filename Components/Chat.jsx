
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useUserId from "../hook/useUserid";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import FileUpload from "./FileUpload";
import { sendMessage, saveVideo } from "../services/apiService";
import "../css/Home/chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); 
  const userId = useUserId();

  const handleSendMessage = async (input) => {
    if (loading || input.trim() === "") return; 

    const userMessage = {
      id: uuidv4(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const reader = await sendMessage(input, userId);

      let partialResponse = "";
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleanChunk = chunk
          .split("\n")
          .map((line) => line.replace(/^data:\s*/, "").trim())
          .filter((line) => line !== "")
          .join(" ");

        partialResponse += cleanChunk + " ";

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages.find(
            (msg) => msg.sender === "assistant" && msg.temp
          );

          if (lastMessage) {
            lastMessage.text = partialResponse.trim();
          } else {
            updatedMessages.push({
              id: uuidv4(),
              text: partialResponse.trim(),
              sender: "assistant",
              temp: true,
            });
          }

          return updatedMessages;
        });
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.temp ? { ...msg, temp: false } : msg))
      );
    } catch (error) {
      console.error("Error during response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Error occurred. Contact: https://www.linkedin.com/in/inksolutions/ to continue the recruitment process.",
          sender: "assistant",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleSendVideo = async (file) => {
    if (!file || loading) return; // Blokuj w trakcie przetwarzania
  
    const tempVideoMessage = {
      id: uuidv4(),
      text: "Uploading video...",
      sender: "user",
      temp: true,
    };
  
    setMessages((prev) => [...prev, tempVideoMessage]);
    setLoading(true);
  
    try {
      // Przesyłanie wideo
      await saveVideo(file, userId);
  
      // Zastąp "Uploading video..." wiadomością "Video uploaded successfully."
      setMessages((prev) =>
        prev.map((msg) =>
          msg.temp
            ? {
                ...msg,
                text: "Video uploaded successfully.",
                temp: false,
              }
            : msg
        )
      );
  
      // Dodaj nową wiadomość "Verifying video..."
      const verifyingMessage = {
        id: uuidv4(),
        text: "Verifying video...",
        sender: "assistant",
        temp: true,
      };
  
      setMessages((prev) => [...prev, verifyingMessage]);
  
      // Wysłanie wiadomości `verifyvideo` na endpoint `/newPrompt`
      const response = await fetch(
        `/api/newPrompt?prompt=verifyvideo&userId=${encodeURIComponent(userId)}`,
        { method: "GET" }
      );
  
      if (!response.ok) {
        throw new Error("Failed to verify video");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialResponse = "";
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
        const cleanChunk = chunk
          .split("\n")
          .map((line) => line.replace(/^data:\s*/, "").trim())
          .filter((line) => line !== "")
          .join(" ");
  
        partialResponse += cleanChunk + " ";
  
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages.find(
            (msg) => msg.sender === "assistant" && msg.temp
          );
  
          if (lastMessage) {
            lastMessage.text = partialResponse.trim();
          } else {
            updatedMessages.push({
              id: uuidv4(),
              text: partialResponse.trim(),
              sender: "assistant",
              temp: true,
            });
          }
  
          return updatedMessages;
        });
      }
  
      setMessages((prev) =>
        prev.map((msg) => (msg.temp ? { ...msg, temp: false } : msg))
      );
    } catch (error) {
      console.error("Error during video upload or verification:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.temp
            ? {
                ...msg,
                text: "Error verifying video. Please try again.",
                temp: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };
  
      
  
  return (
    <div className="chat-container">
      <MessageList messages={messages} loading={loading} />
      <div className="input-container">
        <MessageInput onSendMessage={handleSendMessage} loading={loading} />
        <FileUpload onFileUpload={handleSendVideo} />
      </div>
    </div>
  );
};

export default Chat;
