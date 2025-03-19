import pandas as pd
from utils.emotions_utils import (
    get_tokenized_text,
    get_most_common_word,
    detect_emotions,
    get_primary_emotion,
    get_vader_sentiment_label,
    get_vader_compound_score,
)


def emotion_analysis(df):
    # Sample 100,000 rows for analysis (ensuring reproducibility with random_state)
    df_copy = df.sample(n=100000, random_state=42).copy()

    # Tokenize the text
    df_copy["selftext_tokenized"] = df_copy["selftext"].map(get_tokenized_text)

    # Detect emotions and sentiment
    emotions_results = df_copy["selftext_tokenized"].map(detect_emotions)
    df_copy = df_copy.assign(
        nrc_emotion_scores=[result[0] for result in emotions_results],  # Emotion scores
        nrc_sentiment=[result[1] for result in emotions_results],  # Sentiment label
        nrc_primary_emotion=[
            get_primary_emotion(result[0]) for result in emotions_results
        ],  # Primary emotion
    )

    # Compute VADER sentiment scores
    vader_scores = df_copy["selftext"].map(get_vader_compound_score)
    df_copy = df_copy.assign(
        vader_compound_score=vader_scores,  # VADER compound score
        vader_sentiment_label=vader_scores.map(
            get_vader_sentiment_label
        ),  # Sentiment label based on VADER score
    )

    # Extract the most common word from tokenized text
    df_copy["most_common_word"] = df_copy["selftext_tokenized"].map(
        get_most_common_word
    )

    return df_copy
