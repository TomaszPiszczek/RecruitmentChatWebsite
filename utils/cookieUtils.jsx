export const getUserIdFromCookies = () => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
    return cookies.userId || null;
  };
  
  export const setUserIdInCookies = (userId) => {
    document.cookie = `userId=${userId}; path=/; max-age=31536000;`;
  };
  