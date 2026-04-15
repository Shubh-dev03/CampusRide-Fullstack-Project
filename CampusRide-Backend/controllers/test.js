const testController = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Router is Working!",
    });
  } catch (error) {
    console.log("Error Detected", error);
  }
};

module.exports = testController;
