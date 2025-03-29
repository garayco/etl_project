# Mental Health Data Analysis on Reddit

## Project Description
This project aims to extract, transform and load (ETL) data from a Kaggle dataset that collects Reddit posts classified according to different psychological pathologies. By structuring and analyzing this data, we will seek to identify patterns and trends that contribute to the study of mental health.

## Used Technologies
- **Programming Language:** Python  
- **Database:** MySQL  
- **Data Source:** [mental_disorders_reddit.csv](https://www.kaggle.com/datasets/kamaruladha/mental-disorders-identification-reddit-nlp?select=mental_disorders_reddit.csv)

### Dependencies
This project uses the following Python libraries:
| Library                   | Version  | Description                               |
|---------------------------|---------|-------------------------------------------|
| `fastapi`                 | 0.115.11 | Web framework for building APIs          |
| `kaggle`                  | 1.6.17  | API to download datasets from Kaggle     |
| `mysql-connector-python`  | 9.2.0   | MySQL database connector for Python      |
| `nltk`                    | 3.9.1   | Natural Language Toolkit for NLP tasks   |
| `NRCLex`                  | 3.0.0   | Emotion analysis using NRC lexicon       |
| `numpy`                   | 2.2.4   | Numerical computing library              |
| `pandas`                  | 2.2.3   | Data manipulation and analysis           |
| `pydantic`                | 2.10.6  | Data validation and settings management  |
| `requests`                | 2.32.3  | HTTP library for making requests         |
| `SQLAlchemy`              | 2.0.38  | Database connection and ORM              |
| `textblob`                | 0.19.0  | NLP library for text processing          |
| `tqdm`                    | 4.67.1  | Progress bar visualization               |
| `uvicorn`                 | 0.34.0  | ASGI server for FastAPI                  |


## Installation and Configuration

1. **Clone the repository:**
   ```bash
   git clone https://github.com/garayco/etl_project.git
   cd etl_project
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Kaggle credentials:**
   - Download the `kaggle.json` file from [Kaggle](https://www.kaggle.com/) and place it in `~/.kaggle/`.

4. **Configure the Database:**
   - Edit the `config/database.yaml` file with MySQL credentials.

5. **Start the API Server:**
   - The `server/` directory contains a FastAPI application that serves the transformed data.
   - To start the server, run:
     ```bash
     uvicorn server.server:app --reload
     ```
   - The API will be available at `http://127.0.0.1:8000`.

6. **Run the Dashboard:**
   - The `dashboard/` directory contains a frontend built with Vite and React to visualize the transformed data with charts.
   - To install dependencies and start the dashboard:
     ```bash
     cd dashboard
     npm install
     npm run dev
     ```
   - The dashboard will be accessible at `http://localhost:5173`

## ETL Process

### Extraction Phase 

#### 1. Data Extraction
- **Module:** `kaggle_tools.dataset_download`
- **Function:** `dataset_download`
- **Process:** Downloading the dataset from Kaggle.

#### 2. Database Creation
- **Module:** `mysql_db_connection.db_connection`
- **Function:** `create_db`
- **Process:** Establishing a MySQL connection and creating the database using SQLAlchemy.

#### 3. Loading the dataset into the DB
- **Module:** `mysql_db_connection.upload_dataset_to_db`
- **Function:** `upload_dataset_to_db`
- **Process:**
  - Removing rows with null values (NaN or None).
  - Filtering out deleted or removed posts (`[removed]`, `[deleted]`).
  - Eliminating posts with fewer than 10 characters.
  - Inserting the cleaned data into the database.

---

### Transform Phase

In this phase, we perform **Exploratory Data Analysis (EDA)** and **data transformation** using `nltk` and `NRCLex`.

#### 1. Data Loading
- The dataset is loaded from **MySQL** using `SQLAlchemy`.
- The table **`mental_disorders`** from the database **`mental_disorders_reddit`** is used.

#### 2. Temporal Analysis
- Post timestamps are transformed to extract:
  - `year`
  - `month`
  - `day_of_week`
  - `hour`

#### 3. Text Analysis (`selftext`)
- New features are created to extract linguistic characteristics:
  - `selftext_length`: Total number of characters in the post.  
  - `word_count`: Number of words in the post.  
  - `avg_word_length`: Average length of words.  
  - `repetition_ratio`: Ratio of repeated words within the post.  
- Outlier filtering is applied using **percentile-based thresholds**.

#### 4. Emotion & Sentiment Analysis
- **NRCLex**  
  - Extracts emotion scores (`nrc_emotion_scores`).  
  - Identifies the dominant emotion (`nrc_primary_emotion`).  

- **VADER Sentiment Analysis**  
  - Computes sentiment polarity (`vader_compound_score`).  
  - Classifies posts as **positive, negative, or neutral** (`vader_sentiment_label`).  

- **Additional Feature Extraction**  
  - Identifies the **most common word** in each post (`most_common_word`).  

#### 5. Removal of Unnecessary DataFrame Columns
To optimize the dataset and focus on **key information**, irrelevant columns are removed.

**List of Removed Columns:**
- `over_18`
- `created_utc`
- `avg_word_length`
- `selftext_length`
- `vader_compound_score`
- `selftext_tokenized`
- `nrc_emotion_scores`

After this transformation phase, the **cleaned and enriched data** is ready for further analysis.

---

### Load Phase

#### Most Common Words
- **Endpoint:** `/common_words`
- **Description:** Returns the 10 most common words in the stored data.
- **Process:** Query database and return top 10 words.

#### Emotions by Subreddit
- **Endpoint:** `/emotions_by_subreddit`
- **Description:** Shows the distribution of primary emotions (NRC model) in each subreddit.
- **Process:** Group subreddit-emotion combinations.

#### Most Common Words by NRC Sentiment
- **Endpoint:** `/common_words_by_nrc_sentiment`
- **Description:** Retrieves the three most common words associated with each NRC sentiment.
- **Process:** Identify NRC sentiments and select top words.

#### Most Common Words by VADER Sentiment
- **Endpoint:** `/common_words_by_vader_sentiment`
- **Description:** Retrieves the three most common words based on VADER sentiment labels (positive, negative, neutral).
- **Process:** Filter words by sentiment category.

#### Detailed Emotion and Sentiment Distribution
- **Endpoint:** `/detailed_emotions_distribution`
- **Description:** Returns the distribution of primary NRC emotions categorized by sentiment labels from VADER and NRC.
- **Process:** Count records for each sentiment label.

#### Average Word Count per Subreddit
- **Endpoint:** `/word_count_per_subreddit`
- **Description:** Shows the average word count per post in each subreddit.
- **Process:** Calculate average words per subreddit.

#### Emotions by Month
- **Endpoint:** `/emotions_by_month`
- **Description:** Displays the count of each NRC primary emotion per month.
- **Process:** Sum occurrences per month.

#### Sentiment by Hour
- **Endpoint:** `/hourly_sentiment`
- **Description:** Returns the distribution of VADER sentiments (positive, negative, neutral) throughout the day.
- **Process:** Group posts by hour and count sentiments.

---

## Project Usage

### Running the Extraction Phase
To run the **Extraction phase** execute:

```bash
python main.py
```

### Running the Transformation Phase
The **transformation phase** is included in `main.py`, but it can also be executed separately using the Jupyter Notebook:

```bash
jupyter notebook EDA_transformation.ipynb
```

### Running the API Server
The API server, built with FastAPI, exposes endpoints for querying the processed data. To start the server, run:

```bash
uvicorn server.server:app --reload
```

### Running the Dashboard
The dashboard, developed with React and Vite, provides a graphical interface for data visualization. To run the dashboard, navigate to the `dashboard` directory and execute:

```bash
cd dashboard
npm install
npm run dev
```
---

*Note: The credentials in the config/database_config.yaml file are examples and do not represent actual credentials.* 

## Contact
Author: Felipe Garaycochea Lozada  
Email: fgarayco@gmail.com
