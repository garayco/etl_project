import nltk
import re
from nrclex import NRCLex
from nltk.tokenize import word_tokenize
from collections import Counter
from nltk.corpus import stopwords
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from functools import lru_cache


# Downloads necessary NLTK resources for the analysis
def downloadNLTK():
    nltk.download("vader_lexicon")
    nltk.download("stopwords")
    nltk.download("punkt")


# Returns a set of stopwords in the specified language
@lru_cache(None)
def get_stopwords(lang="english"):
    return set(stopwords.words(lang))


# Tokenizes the text
def get_tokenized_text(text):
    stop_words = get_stopwords()
    text = re.sub(r"\d+", "", text)  # Remove numbers
    words = word_tokenize(text.lower())  # Convert to lowercase and tokenize

    # Filter out non-alphabetic words and stopwords
    words = [word for word in words if word.isalpha() and word not in stop_words]
    words = [
        word for word in words if len(word) > 2
    ]  # Keep words longer than 2 letters
    return words


# Returns the most common word in the tokenized word list
def get_most_common_word(tokenized_words):
    word_counts = Counter(tokenized_words)

    # Get the most frequent word
    most_common = word_counts.most_common(1)
    return most_common[0][0] if most_common else None


# Analyzes emotions in tokenized text using NRCLex
# Returns a  of emotion scores and the overall sentiment (positive, negative, or neutral)
def detect_emotions(tokenized_words):
    text = " ".join(tokenized_words)
    emotion_scores = NRCLex(text).affect_frequencies

    # Get positive and negative emotion scores
    positive_score = emotion_scores.get("positive", 0)
    negative_score = emotion_scores.get("negative", 0)

    # Determine the dominant sentiment
    nrc_sentiment = max(
        {"positive": positive_score, "negative": negative_score},
        key=lambda k: {"positive": positive_score, "negative": negative_score}[k],
    )

    if positive_score == negative_score:
        nrc_sentiment = "neutral"

    # Filter out positive and negative scores to keep only specific emotions
    filtered_emotion_scores = {
        k: v for k, v in emotion_scores.items() if k not in ["positive", "negative"]
    }

    return filtered_emotion_scores, nrc_sentiment


# Determines the primary emotion in the emotion scores
def get_primary_emotion(emotion_scores):
    if not emotion_scores:
        return "neutral"

    max_value = max(emotion_scores.values())
    top_emotions = [k for k, v in emotion_scores.items() if v == max_value]

    # Plutchik's Wheel of Emotions priority order
    priority_order = [
        "fear",
        "sadness",
        "anger",
        "disgust",
        "joy",
        "trust",
        "anticipation",
        "surprise",
    ]

    for emotion in priority_order:
        if emotion in top_emotions:
            return emotion


# Calculates the compound sentiment score of a text using VADER
def get_vader_compound_score(text):
    analyzer = SentimentIntensityAnalyzer()
    score = analyzer.polarity_scores(text)
    return score["compound"]


# Converts the VADER compound sentiment score into a label (positive, negative, or neutral)
def get_vader_sentiment_label(vader_sentiment):
    if vader_sentiment >= 0.05:
        return "positive"
    elif vader_sentiment <= -0.05:
        return "negative"
    else:
        return "neutral"
