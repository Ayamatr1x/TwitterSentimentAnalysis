const Twitter = require("twitter-lite");
const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();


async function getSentiment(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const [result] = await languageClient.analyzeSentiment({ document });
  const sentiment = result.documentSentiment;

  return sentiment.score; 
}


const client = new Twitter({
  version: "2",
  extension: false,
  bearer_token: "AAAAAAAAAAAAAAAAAAAAAKUs3wEAAAAA%2Fd5TbfXoR%2Bk2xWUF%2B2tW1RwHBWg%3DKenkXDAULw6RHadDuD8YdXB2hROrSjFRj9w67Cs5UWZwlQyrwG"
});

(async function () {
  try {
    // 1. Fetch recent tweets
    const query = "Lionel Messi";
    const tweets = await client.get("tweets/search/recent", {
      query: `${query} lang:en`,
      max_results: 10,
      "tweet.fields": "created_at,text,author_id"
    });

    console.log("Fetched Tweets:");
    let allTweets = "";
    tweets.data.forEach((tweet) => {
      console.log(`- (${tweet.created_at}) ${tweet.text}`);
      allTweets += tweet.text + "\n"; // collect text for sentiment analysis
    });

    // 2. Run sentiment analysis
    const sentimentScore = await getSentiment(allTweets);
    console.log(`\n🧠 The overall sentiment about "${query}" is: ${sentimentScore}`);

  } catch (e) {
    console.error("Error calling Twitter API:", e);
  }
})();
