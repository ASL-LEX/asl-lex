from pathlib import Path

# paths - will work on all OS
old_data_folder = Path("/project/hariri/asl-lex/data-analysis/scripts/data/")
new_data_folder = Path("/project/hariri/asl-lex/data-analysis/scripts/data/generated-data/")

# files
onemiss_nd_file = old_data_folder / 'osfstorage-archive/onemiss-nd.csv'
onemiss_neighbors_file = old_data_folder / 'osfstorage-archive/onemiss-neighbors.csv'
phonology_coding_file = old_data_folder / 'osfstorage-archive/PhonologyCoding.csv'

sign_data_file = old_data_folder / 'signdata.csv'

# new files
default_nodes_file = new_data_folder / 'default-nd.csv'
default_neighbors_file = new_data_folder / 'default-neighbors.csv'

lexical_nodes_file = new_data_folder / 'lexical-nd.csv'
lexical_neighbors_file = new_data_folder / 'lexical-neighbors.csv'

major_nodes_file = new_data_folder / 'major-nd.csv'
major_neighbors_file = new_data_folder / 'major-neighbors.csv'

minor_nodes_file = new_data_folder / 'minor-nd.csv'
minor_neighbors_file = new_data_folder / 'minor-neighbors.csv'

graph_json_file = new_data_folder / 'graph.json'
constraints_json_file = new_data_folder / 'constraints.json'
sign_props_json_file = new_data_folder / 'sign_props.json' 
