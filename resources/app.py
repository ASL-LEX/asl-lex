import config
import nd.neighbors as nd

import pandas as pd
import multiprocessing as mp
import sys
import argparse

from itertools import product

parser = argparse.ArgumentParser(description='Filter arguments to run in order to create neighbor density values, nodes and edges')
parser.add_argument("feature_list",type=str, help="A list of strings containing features. This should be the exact same as the columns feed into pyND", nargs='+')
parser.add_argument("num_pynd",type=int, help="an integer indicating how many features are allowed to differ between the target word and the candidate")
parser.add_argument("file_name",type=str, help="string that will be the file name of the nodes + edges csv files generated from pyND package")

args = parser.parse_args()


""" Script to automate/update Nodes + edges JSON csv files which will be reflected on the website """

# convert the needed files into dataframes
# need to use the PyND package to get the onemiss_neighbors + onemiss_nd files
# sign_df contains all properies of each sign
sign_df = pd.read_csv(config.sign_data_file)
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
    feature_nd.WriteCSVs(config.data_path, file_name)

    print("Nodes and edges files created! ")
# add major location & minor location
default_features = [col for col in sign_df.columns[48:63]]
lexical_features = [col for col in sign_df.columns[4:46]]
phonological_features = [col for col in sign_df.columns[47:]]

"""
    feature set is a list of tuples -- needed for the parallel processing
    tuple[0]: a list of strings
    tuple[1]: number
    tuple[2]: a string

    running the script has to be executed as
    python3 col_name_1 col_name_2 col_name_3..etc num file_name

    example: python3 EntryID LemmaID Code 1 default
"""

# args that are passed into the command line once the script is run
features = args.feature_list
pynd_num = args.num_pynd
export_file = args.file_name

# have to wrap it in a list of tuples in order to complete parallel processing
feature_set = [(features, pynd_num, export_file)]


def main():
    # creating pool for multiprocessing
    # will run the process in parallel

    # with mp.Pool() as pool:
    #     results = pool.map(create_nd, feature_set)

    with mp.Pool() as pool:
        results = pool.starmap(create_nd, feature_set)


if __name__ == '__main__':
    main()
