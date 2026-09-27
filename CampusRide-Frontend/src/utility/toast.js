import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #6FA77A",
    },
    iconTheme: {
      primary: "#6FA77A",
      secondary: "#fff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: "1px solid #C15C4C",
    },
    iconTheme: {
      primary: "#C15C4C",
      secondary: "#fff",
    },
  });
};
