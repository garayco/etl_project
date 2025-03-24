import html
import pandas as pd
from emotion_analysis import emotion_analysis
from mysql_db_connection.db_connection import (
    create_mental_disorders_reddit_engine,
    get_mental_disorders_processed_table_conf,
    get_mental_disorders_table_conf,
)
from utils.sql_utils import upload_table_to_db_by_chunks

# Columns to be removed after processing
columns_to_drop = [
    "over_18",
    "created_utc",
    "avg_word_length",
    "selftext_length",
    "vader_compound_score",
    "selftext_tokenized",
    "nrc_emotion_scores",
]


def repetition_ratio(text, total_words):
    unique_words = len(set(text.split()))
    return total_words / unique_words


def clean_text(text):
    return html.unescape(text) if isinstance(text, str) else text


def transformation():
    print(f"💻 Start Transformation Phase")

    engine = create_mental_disorders_reddit_engine()

    mental_disorders_table_name = get_mental_disorders_table_conf()["name"]
    with engine.connect() as conn:
        query = f"SELECT * FROM {mental_disorders_table_name}"
        df = pd.read_sql(query, conn)  # Usa `conn` en lugar de `engine`

    # Converting Unix Timestamp to DateTime Format
    df["created_utc"] = pd.to_datetime(df["created_utc"], unit="s")

    # Extract date-related features
    df["date"] = df["created_utc"].dt.date
    df["hour"] = df["created_utc"].dt.hour
    df["day_of_week"] = df["created_utc"].dt.day_name()
    df["month"] = df["created_utc"].dt.month
    df["year"] = df["created_utc"].dt.year

    # Compute selftext statistics
    df["selftext_length"] = df["selftext"].apply(len)
    df["word_count"] = df["selftext"].apply(lambda x: len(x.split()))
    df["avg_word_length"] = df["selftext_length"] / df["word_count"]
    df["repetition_ratio"] = [
        repetition_ratio(text, word_count)
        for text, word_count in zip(df["selftext"], df["word_count"])
    ]

    # Filtering rows based on selftext length (2nd and 99th percentile)
    print("Filtering rows based on selftext length (2nd and 99th percentile)")
    selftext_length_low, selftext_length_high = df["selftext_length"].quantile(
        [0.02, 0.99]
    )
    df = df.loc[
        df["selftext_length"].between(selftext_length_low, selftext_length_high)
    ]

    print(f"Remaining Rows: {len(df)}")

    # Filtering rows based on word count (2.2nd and 99.7th percentile)
    print("Filtering rows based on word count (2.2nd and 99.7th percentile)")
    word_count_low, word_count_high = df["word_count"].quantile([0.022, 0.997])
    df = df.loc[df["word_count"].between(word_count_low, word_count_high)]

    print(f"Remaining Rows: {len(df)}")

    # Filter Rows Based on repetition ratio Thresholds (99th percentile)
    print("Filtering Rows based on repetition ratio (99th percentile)")
    repetition_ratio_threshold = df["repetition_ratio"].quantile(0.99)
    df = df.loc[df["repetition_ratio"] <= repetition_ratio_threshold]

    print(f"Remaining Rows: {len(df)}")

    # Filter Rows Based on Average Word Length Threshold
    print("Filtering Rows based on average word length (99.5th percentile)")
    avg_word_length_threshold = df["avg_word_length"].quantile(0.995)
    df = df.loc[df["avg_word_length"] <= avg_word_length_threshold]

    print(f"Remaining Rows: {len(df)}")

    # Filter rows with URLs in the 'selftext' column
    df["selftext"] = df["selftext"].apply(clean_text)
    url_pattern = r"https?://\S+|www\.\S+|\[.*?\]\(https?://\S+\)"
    df = df.loc[
        ~df["selftext"].str.contains(url_pattern, case=False, na=False, regex=True)
    ]

    print(f"Remaining Rows after removing links: {len(df)}")

    print("Start analysis emotion")
    df = emotion_analysis(df)

    # Drop unnecessary columns
    df.drop(columns=columns_to_drop, inplace=True)

    # Upload transformed df to db
    mental_disorders_processed_table_name = get_mental_disorders_processed_table_conf()[
        "name"
    ]

    upload_table_to_db_by_chunks(
        df, mental_disorders_processed_table_name, engine, chunk_size=5000
    )

    engine.dispose()

    print("☑️ End of Transformation Phase")
