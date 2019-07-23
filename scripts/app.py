import pandas as pd
import config as CONFIG
import nd.neighbors as nd
import createGraph as CG

import sys
import argparse

from itertools import product

""" Script to automate/update Nodes + edges JSON csv files which will be reflected on the website """

# command line arguments for calculating neighbor density
parser = argparse.ArgumentParser(description='Filter arguments to run in order to create neighbor density values, nodes and edges')
parser.add_argument(dest="feature_list", type=lambda s:[str(feature).strip() for feature in s.split(",")], help="A list of strings containing features. This should be the exact same as the columns feed into pyND")
parser.add_argument(dest="num_pynd", type=int, help="an integer indicating how many features are allowed to differ between the target word and the candidate")
parser.add_argument(dest="export_file", type=str, help="string that will be the file name of the nodes + edges csv files generated from pyND package")

args = parser.parse_args()

# need to use the PyND package to get the onemiss_neighbors + onemiss_nd files
"""sign_df contains all properies of each sign"""
sign_df = pd.read_csv(CONFIG.sign_data_file)
subset_df = pd.read_csv(CONFIG.subset_data_file)

# get rid of the video columns
sign_df = sign_df.drop(columns=['ClipLength(ms)'], axis=1)

def create_nd(data_df, feature_list, allowed_misses, file_name):
    """
        Helper function to convert data nodes + edges files
        Args:
            data_df: Pandas dataframe containing the data
            feature_list: (List of str) a list of features that edges will be generated from
            allowed_misses: (Int) - look at pynd Neighbors documentation
            file_name: The name of the nodes + edges file that will be generated from the features

        returns:
            Creates two csv files in the data folder named file_name-neighbors and file_name-nd
    """

    print(f"Creating nodes & edges csv files for {file_name} features.")
    print("This will take awhile...")

    # create the neighbors object
    feature_nd = nd.Neighbors(data_df, feature_list, allowed_misses)

    # compute the neighbor density and edges
    nodes_df, edges_df = feature_nd._Compute()

    # write the nodes and edges to CSVs
    feature_nd.WriteCSVs(CONFIG.new_data_folder, file_name)

    print("Nodes and edges files created! ")


"""
    feature set is a list of tuples -- needed for the parallel processing
    tuple[0]: string - which represents a string, .split(",")
    tuple[1]: number
    tuple[2]: string

    running the script has to be executed as
    python3 col_name_1 col_name_2 col_name_3..etc num file_name

    example: python3 "EntryID,LemmaID,Code" 1 default
"""

# args that are passed into the command line once the script is run
features = args.feature_list
pynd_num = args.num_pynd
export_file = args.export_file


def main():
    # subset for testing
    # create_nd(subset_df, features, pynd_num, export_file)

    create_nd(sign_df, features, pynd_num, export_file)

    """Make sure you add the csv extension"""
    nodes_df = pd.read_csv(CONFIG.new_data_folder / f"{export_file + '-nd.csv'}")
    links_df = pd.read_csv(CONFIG.new_data_folder / f"{export_file + '-neighbors.csv'}")

    # create the graph file from the two csv
    g_export_name = export_file + '.json'

    CG.generate_subset(nodes_df, links_df, g_export_name)


if __name__ == '__main__':
    main()
