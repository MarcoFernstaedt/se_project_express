// Function to check if a string is a valid URL
module.exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}