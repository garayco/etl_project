# This function format the columns with lowercase and underscore
def df_format_columns(df):
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    return df


# This function aplies the rules
def clean_df(df, cleaning_rules):

    # Deltete rows with NaN or None
    df = df.dropna().reset_index(drop=True)

    for col, rules in cleaning_rules["rules"]["columns"].items():
        if "remove_values" in rules:
            df = df[
                ~df[col].isin(rules["remove_values"])
            ]  # Filter rows using remove_values
        if "min_length_char" in rules:
            df = df[
                df[col].str.len() >= rules["min_length_char"]
            ]  # Filter rows using min_length_char

        return df.reset_index(drop=True)
