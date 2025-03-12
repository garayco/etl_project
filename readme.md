# Mental Health Data Analysis on Reddit

## Project Description
This project aims to extract, transform and load (ETL) data from a Kaggle dataset that collects Reddit posts classified according to different psychological pathologies. By structuring and analyzing this data, we will seek to identify patterns and trends that contribute to the study of mental health.

## Used Technologies
- **Programming Language:** Python  
- **Database:** MySQL  
- **Data Source:** [mental_disorders_reddit.csv](https://www.kaggle.com/datasets/kamaruladha/mental-disorders-identification-reddit-nlp?select=mental_disorders_reddit.csv)

### Dependencies
This project uses the following Python libraries:

| Library      | Version  | Description                               |
|-------------|---------|-------------------------------------------|
| `kaggle`    | 1.6.17  | API to download datasets from Kaggle     |
| `nltk`      | 3.9.1   | Natural Language Toolkit for NLP tasks   |
| `NRCLex`    | 3.0.0   | Emotion analysis using NRC lexicon       |
| `pandas`    | 2.2.3   | Data manipulation and analysis           |
| `PyYAML`    | 6.0.2   | YAML file parsing for configuration      |
| `SQLAlchemy`| 2.0.38  | Database connection and ORM              |
| `tqdm`      | 4.67.1  | Progress bar visualization               |

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
🚧 *Building...*

---

## Project Usage

### Running the Extraction Phase
To run the **Extraction phase** execute:

```bash
python main.py
```

### Running the Transformation Phase

To execute the **transformation phase**, open and run the Jupyter Notebook:

```bash
jupyter notebook EDA_transformation.ipynb
```

## Contact
Author: Felipe Garaycochea Lozada  
Email: fgarayco@gmail.com
