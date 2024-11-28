// src/services/apiService.js

export const createUser = async () => {
    const response = await fetch("/api/create", { method: "POST" });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    const data = await response.json();
    return data.userId;
  };
  
  export const sendMessage = async (prompt, userId) => {
    const response = await fetch(
      `/api/newPrompt?prompt=${encodeURIComponent(prompt)}&userId=${userId}`,
      { method: "GET" }
    );
  
    if (!response.body) {
      throw new Error("No content in response.");
    }
    return response.body.getReader();
  };
  
  export const saveVideo = async (file, userId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
  
    const response = await fetch("/api/saveVideo", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to save video");
    }
  
    if (response.headers.get("content-type")?.includes("application/json")) {
      return response.json();
    }
  
    return null;
  };
  