// Function to validate Discord invitation link
exports.isValidDiscordLink = (link) => {
    if (!link) {
      return false; // No link provided
    }
    const regex = /(?:https?:\/\/)?(?:discord\.gg|discord\.com)\/([A-Za-z0-9]+)/;
    return regex.test(link);
  };
