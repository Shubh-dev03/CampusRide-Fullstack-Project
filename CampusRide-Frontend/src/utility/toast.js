import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #10B981",
    },
    iconTheme: {
      primary: "#10B981",
      secondary: "#fff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: "1px solid #EF4444",
    },
    iconTheme: {
      primary: "#EF4444",
      secondary: "#fff",
    },
  });
};
