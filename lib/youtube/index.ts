export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Short URL (youtu.be)
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    // Standard URL
    if (parsedUrl.searchParams.get("v")) {
      return parsedUrl.searchParams.get("v");
    }

    // Embed URL
    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1];
    }

    return null;
  } catch {
    return null;
  }
}

export const getVideoDetails = async (videoId: string) => {
  const ytRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoId}&key=${process.env.NEXT_SERVER_YOUTUBE_API_KEY}`,
  );

  return ytRes
    .json()
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching video details:", error);
      throw new Error("Failed to fetch video details");
    });
};


export function parseYouTubeDuration(duration: string): number {
  const match = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  )

  const hours = parseInt(match?.[1] || "0")
  const minutes = parseInt(match?.[2] || "0")
  const seconds = parseInt(match?.[3] || "0")

  // return in "seconds"
  return hours * 3600 + minutes * 60 + seconds
}