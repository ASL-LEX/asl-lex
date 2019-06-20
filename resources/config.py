from pathlib import Path
from dotenv import load_dotenv

# paths - will work on all OS
old_data_folder = Path("old-data/")
new_data_folder = Path("data/")
env_path = Path(".") / ".env"

# load in all modules need to run the script
load_dotenv(dotenv_path=env_path)

# files
onemiss_nd_file = old_data_folder / 'osfstorage-archive/onemiss-nd.csv'
onemiss_neighbors_file = old_data_folder / 'osfstorage-archive/onemiss-neighbors.csv'
phonology_coding_file = old_data_folder / 'osfstorage-archive/PhonologyCoding.csv'
sign_data_file = new_data_folder / 'signdata.csv'

keys_file = old_data_folder / 'osfstorage-archive/Key/Key.csv'

english_translations_file = old_data_folder / 'old-data/osfstorage-archive/Sign-Level Data/EnglishTranslations.csv'
neighbors_file = old_data_folder / 'osfstorage-archive/Sign-Level Data/Neighbors.csv'
sign_file = old_data_folder / 'osfstorage-archive/Sign-Level Data/SignData.csv'

frequency_file = old_data_folder / 'osfstorage-archive/Trial-Level Data/FrequencyTrial.csv'
iconicity_file = old_data_folder /'osfstorage-archive/Trial-level Data/IconicityTrial.csv'

