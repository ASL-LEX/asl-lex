import pandas as pd
import multiprocessing as mp
import sys
import os

from itertools import product

# sys.path(0, os.getcwd() + '/resources')

import config as CONFIG
import nd.neighbors as nd

""" Script to automate/update Nodes + edges CSV files which will be reflected on the website """

# convert the needed files into dataframes
# need to use the PyND package to get the onemiss_neighbors + onemiss_nd files
# sign_df contains all properies of each sign
sign_df = pd.read_csv(CONFIG.sign_data_file)
# get rid of the video columns
sign_df = sign_df.drop(columns=['YouTube Video', 'Vimeo Video', 'ClipLength(ms)'], axis=1)

def create_nd(feature_list, allowed_misses, file_name):
    """
        Helper function to convert into nodes + edges files

        Args:
            feature_list: (List of str) a list of features that edges will be generated from
            allowed_misses: (Int) - look at pynd Neighbors documentation
            file_name: The name of the nodes + edges file that will be generated from the features

        returns:
            Creates two csv files in the data folder named file_name-neighbors and file_name-nd
    """

    print(f"Creating nodes & edges csv files for {file_name} features ")
    print("This will take awhile...")

    # create the neighbors object
    feature_nd = nd.Neighbors(sign_df, feature_list, allowed_misses)

    # compute the neighbor density and edges
    nodes_df, edges_df = feature_nd._Compute()

    # write the nodes and edges to CSVs
    feature_nd.WriteCSVs(CONFIG.data_path, file_name)

    print("Nodes and edges files created! ")

default_features = [col for col in sign_df.columns[48:63]]
lexical_features = [col for col in sign_df.columns[4:46]]
phonological_features = [col for col in sign_df.columns[47:]]

"""
    feature list is a list of tuples
    This is needed to run parallel processing
    we pass in this list so the create_nd function
    will be able to apply these tuple values as arguments
"""
feature_list = [
    (default_features, 1, 'default'),
    (lexical_features, 0, 'lex'),
    (phonological_features, 0, 'phono')
]

def main():
    # creating pool for multiprocessing
    # will run the process in parallel
    with mp.Pool() as pool:
        results = pool.starmap(create_nd, feature_list)

if __name__ == '__main__':
    main()


