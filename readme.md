# Mental Health Data Analysis on Reddit

## Project Description
This project aims to extract, transform and load (ETL) data from a Kaggle dataset that collects Reddit posts classified according to different psychological pathologies. By structuring and analyzing this data, we will seek to identify patterns and trends that contribute to the study of mental health.

## Used Technologies
- **Programming Language:** Python  
- **Database:** MySQL  
- **Data Source:** [mental_disorders_reddit.csv](https://www.kaggle.com/datasets/kamaruladha/mental-disorders-identification-reddit-nlp?select=mental_disorders_reddit.csv)

### Dependencies
This project uses the following Python libraries:

| Library      | Version  | Description |
|-------------|---------|-------------|
| `kaggle`    | 1.6.17  | API to download datasets from Kaggle |
| `pandas`    | 2.2.3   | Data manipulation and analysis |
| `PyYAML`    | 6.0.2   | YAML file parsing for configuration |
| `SQLAlchemy`| 2.0.38  | Database connection and ORM |
| `tqdm`      | 4.67.1  | Progress bar visualization |

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

### Transform Phase 
building...
### Load Phase 
building...

## Project Usage

```bash
python main.py
```

## Contact
Author: Felipe Garaycochea Lozada  
Email: fgarayco@gmail.com
