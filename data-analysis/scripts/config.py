from pathlib import Path

# paths - will work on all OS
old_data_folder = Path("../data/")
new_data_folder = Path("new-data/")

env_path = Path(".") / ".env"

# files
onemiss_nd_file = old_data_folder / 'osfstorage-archive/onemiss-nd.csv'
onemiss_neighbors_file = old_data_folder / 'osfstorage-archive/onemiss-neighbors.csv'
phonology_coding_file = old_data_folder / 'osfstorage-archive/PhonologyCoding.csv'

sign_data_file = new_data_folder / 'signdata.csv'
subset_data_file = new_data_folder / 'subsetsigndata.csv'

keys_file = old_data_folder / 'osfstorage-archive/Key/Key.csv'

english_translations_file = old_data_folder / 'old-data/osfstorage-archive/Sign-Level Data/EnglishTranslations.csv'
neighbors_file = old_data_folder / 'osfstorage-archive/Sign-Level Data/Neighbors.csv'
sign_file = old_data_folder / 'osfstorage-archive/Sign-Level Data/SignData.csv'

frequency_file = old_data_folder / 'osfstorage-archive/Trial-Level Data/FrequencyTrial.csv'
iconicity_file = old_data_folder / 'osfstorage-archive/Trial-level Data/IconicityTrial.csv'

# new files
default_nodes_file = new_data_folder / 'default-nd.csv'
default_neighbors_file = new_data_folder / 'default-neighbors.csv'

lexical_nodes_file = new_data_folder / 'lexical-nd.csv'
lexical_neighbors_file = new_data_folder / 'lexical-neighbors.csv'

major_nodes_file = new_data_folder / 'major-nd.csv'
major_neighbors_file = new_data_folder / 'major-neighbors.csv'

minor_nodes_file = new_data_folder / 'minor-nd.csv'
minor_neighbors_file = new_data_folder / 'minor-neighbors.csv'

