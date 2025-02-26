import pandas as pd
from sqlalchemy.exc import SQLAlchemyError
from tqdm import tqdm
from utils.df_utils import clean_df, df_format_columns


def upload_dataset_to_db(engine, df, table_name, cleaning_rules):

    # Format the columns
    df = df_format_columns(df)

    if cleaning_rules and isinstance(cleaning_rules, dict):
        # Clean the df
        df = clean_df(df, cleaning_rules)

    try:
        total_rows = len(df)
        chunk_size = 5000

        with tqdm(total=total_rows, desc="Inserting into DB", unit=" rows") as pbar:
            for i in range(0, total_rows, chunk_size):
                chunk = df.iloc[i : i + chunk_size]
                chunk.to_sql(
                    table_name,
                    con=engine,
                    if_exists="append",
                    index=False,
                    method="multi",
                )
                pbar.update(len(chunk))
        print(f"✅ Insert successful: {total_rows} rows inserted")
    except SQLAlchemyError as e:
        print(f"❌ Error inserting into MySQL: {e}")
