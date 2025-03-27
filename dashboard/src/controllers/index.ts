import { ChartConfig } from "@/components/ui/chart";

//const API = "http://127.0.0.1:8000";
const API = "https://b794-181-54-0-216.ngrok-free.app";

const COLORS = [
  "#93c47d", // Verde
  "#e06666", // Rosa
  "#6fa8dc", // Azul
  "#f6b26b", // Naranja
  "#ffd966", // Amarillo
  "#c27ba0", // Lila
  "#76a5af", // Azul celeste
  "#a4c2f4", // Azul medio
];

function getColor(index) {
  return COLORS[index % COLORS.length];
}

export async function getPrimaryEmotionsBySubreddit() {
  try {
    const response = await fetch(`${API}/emotions_by_subreddit`);
    const data = await response.json();

    const emotions = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "subreddit") emotions.add(key);
      });
    });

    const config = Array.from(emotions).reduce((acc, emotion, index) => {
      acc[emotion] = {
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        color: getColor(index),
      };
      return acc;
    }, {});

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getCommonWordsByNRCSentiment() {
  try {
    const response = await fetch(`${API}/common_words_by_nrc_sentiment`);
    const data = await response.json();

    return [data];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getCommonWordsByVaderSentiment() {
  try {
    const response = await fetch(`${API}/common_words_by_vader_sentiment`);
    const data = await response.json();

    return [data];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getDetailedEmotionsDistribution() {
  try {
    const response = await fetch(`${API}/detailed_emotions_distribution`);
    const data = await response.json();

    const config = {
      vader: {
        label: "VADER",
        sentiments: {
          positive: getColor(0),
          negative: getColor(1),
          neutral: getColor(2),
        },
      },
      nrc: {
        label: "NRC",
        sentiments: {
          positive: getColor(0),
          negative: getColor(1),
          neutral: getColor(2),
        },
      },
    };

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getMostCommonWordsCount() {
  try {
    const response = await fetch(`${API}/common_words`);
    const data = await response.json();

    const config = { count: { label: "Count" } };
    data.forEach((item, index) => {
      config[item.word] = {
        label: item.word.charAt(0).toUpperCase() + item.word.slice(1),
      };
      data[index].fill = getColor(index);
    });

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getAvgWordCountPerSubreddit() {
  try {
    const response = await fetch(`${API}/word_count_per_subreddit`);
    const data = await response.json();

    const config = {};
    data.forEach((item, index) => {
      item.fill = getColor(index);
      config[item.subreddit.toLowerCase()] = {
        label: item.subreddit,
        color: getColor(index),
      };
    });

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getEmotionByMonth() {
  try {
    const response = await fetch(`${API}/emotions_by_month`);
    const data = await response.json();

    const uniqueEmotions = Object.keys(data[0]).filter(
      (key) => key !== "month"
    );
    const config = uniqueEmotions.reduce((acc, emotion, index) => {
      acc[emotion] = {
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        color: getColor(index),
      };
      return acc;
    }, {});

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}

export async function getHourlySentiment() {
  try {
    const response = await fetch(`${API}/hourly_sentiment`);
    const data = await response.json();

    const uniqueEmotions = Object.keys(data[0]).filter((key) => key !== "hour");
    const config = uniqueEmotions.reduce((acc, sentiment, index) => {
      acc[sentiment] = {
        label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
        color: getColor(index),
      };
      return acc;
    }, {});

    return [data, config];
  } catch (error) {
    console.error("Error al obtener emociones:", error);
  }
}
