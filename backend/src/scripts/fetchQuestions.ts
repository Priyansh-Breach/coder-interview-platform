// src/scripts/fetchQuestions.ts
import { Client } from "@elastic/elasticsearch";
import { promises as fs } from "fs";

interface HitSource {
  title: string;
  description: string;
  topic_tags: string[];
  solutions: string;
}

const client = new Client({
  node: "http://localhost:9200",
  auth: {
    username: "priyansh", // replace with your Elasticsearch username
    password: "password", // replace with your Elasticsearch password
  },
});

const fetchQuestions = async () => {
  try {
    const body  = await client.search<HitSource>({
      index: "leetcode_questions",
      body: {
        query: {
          match_all: {},
        },
      },
    });
    console.log(body);
    const questions = body.hits.hits.map((hit) => hit._source);
    await fs.writeFile("questions.json", JSON.stringify(questions, null, 2));

    console.log("Questions fetched and saved to questions.json");
  } catch (error) {
    console.error("Error fetching questions:", error);
  } finally {
    await client.close();
  }
};

fetchQuestions();
