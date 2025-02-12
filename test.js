import express from "express";
import store from "app-store-scraper";
import gplay from "google-play-scraper";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/get-app", async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "App ID is required" });
  }

  try {
    // Fetch iOS app details
    let appDetailsIOS = null;
    try {
      appDetailsIOS = await store.app({ appId });
    } catch (error) {
      console.log("App not found on iOS");
    }

    // Fetch Android app details
    let appDetailsAndroid = null;
    try {
      appDetailsAndroid = await gplay.app({ appId });
    } catch (error) {
      console.log("App not found on Android");
    }

    // Construct the response
    const response = {
      status: "success",
      data: {
        ios: appDetailsIOS
          ? {
              id: appDetailsIOS.id,
              appId: appDetailsIOS.appId,
              title: appDetailsIOS.title,
              url: appDetailsIOS.url,
              developer: appDetailsIOS.developer,
              developerWebsite: appDetailsIOS.developerWebsite,
              price: appDetailsIOS.price,
              rating: appDetailsIOS.score,
              version: appDetailsIOS.version,
            }
          : null,
        android: appDetailsAndroid
          ? {
              id: appDetailsAndroid.id,
              appId: appDetailsAndroid.appId,
              title: appDetailsAndroid.title,
              url: `https://play.google.com/store/apps/details?id=${appDetailsAndroid.appId}`,
              developer: appDetailsAndroid.developer,
              developerWebsite: appDetailsAndroid.developerWebsite,
              price: appDetailsAndroid.price,
              rating: appDetailsAndroid.scoreText,
              version: appDetailsAndroid.version,
            }
          : null,
      },
    };

    return res.json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch app details",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
