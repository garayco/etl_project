import pandas as pd
from tqdm import tqdm
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError

types = pd.api.types


def table_exists(engine, table_name):
    return inspect(engine).has_table(table_name)


def create_table(engine, df, table_name):

    if not table_exists(engine, table_name):

        def map_dtype(dtype):
            dtype_mapping = {
                types.is_integer_dtype: "INTEGER",
                types.is_float_dtype: "REAL",
                types.is_bool_dtype: "BOOLEAN",
                types.is_datetime64_any_dtype: "DATETIME",
            }
            return next(
                (sql_type for check, sql_type in dtype_mapping.items() if check(dtype)),
                "TEXT",
            )

        with engine.connect() as conn:
            # Create a table
            print(f"🔨 Creating table: {table_name}")
            columns_def = ", ".join(
                [f"{col} {map_dtype(dtype)}" for col, dtype in df.dtypes.items()]
            )
            sql_create_table = f"CREATE TABLE {table_name} ({columns_def})"
            conn.execute(text(sql_create_table))
            conn.commit()
            print(f"✅ Table {table_name} created successfully.")
            conn.close()

    else:
        print(f"⚠️ Table: '{table_name}' already exists")


def upload_table_to_db_by_chunks(df, table_name, engine, chunk_size=5000):
    total_rows = len(df)
    
    try:
        with tqdm(
            total=total_rows, desc=f"Inserting {table_name} into DB", unit=" rows"
        ) as pbar:

            for i in range(0, total_rows, chunk_size):
                chunk = df.iloc[i : i + chunk_size]
                # Upload table to db by chunks
                chunk.to_sql(
                    table_name,
                    con=engine,
                    if_exists='append',
                    index=False,
                    method="multi",
                )
                pbar.update(len(chunk))

            print(f"✅ Insert successful: {total_rows} rows inserted")

    except SQLAlchemyError as e:
        print(f"❌ Error inserting into MySQL: {e}")
