from kaggle.api.kaggle_api_extended import KaggleApi
import os


def dataset_download():
    dataset_url = "kamaruladha/mental-disorders-identification-reddit-nlp"
    output_dir = "dataset/"

    if os.path.exists(output_dir):
        print(f"⚠️ Already downloaded: {dataset_url}")
        return

    kaggleApi = KaggleApi()
    print(f"🗃️ Downloading from Kaggle: {dataset_url}")
    kaggleApi.dataset_download_files(dataset_url, output_dir, unzip=True)
    print("✅ Download completed")
