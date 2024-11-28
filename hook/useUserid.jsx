import { useEffect, useState } from "react";
import { getUserIdFromCookies, setUserIdInCookies } from "../utils/cookieUtils";
import { createUser } from "../services/apiService";

const useUserId = () => {
  const [userId, setUserId] = useState(getUserIdFromCookies());

  useEffect(() => {
    const initializeUserId = async () => {
      if (!userId) {
        try {
          const newUserId = await createUser();
          setUserId(newUserId);
          setUserIdInCookies(newUserId);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };
    initializeUserId();
  }, [userId]);

  return userId;
};

export default useUserId;