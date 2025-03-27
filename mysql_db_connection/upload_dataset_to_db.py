from tqdm import tqdm
from utils.df_utils import clean_df_using_rules, df_format_columns


# Cleaning rules
cleaning_rules = {
    "rules": {
        "columns": {
            "selftext": {
                "remove_values": ["[removed]", "[deleted]"],
                "min_length_char": 10,
            }
        }
    }
}

def clean_df(df):

    # Format the columns
    df = df_format_columns(df)

    # Clean the df
    df = clean_df_using_rules(df, cleaning_rules)
        
    return df