import logging
import os
import pandas as pd
import time

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)

formatter = logging.Formatter('%(name)s - %(asctime)-14s %(levelname)-8s: %(message)s', "%m-%d %H:%M:%S")

ch.setFormatter(formatter)

logger.handlers = []  # in case module is reload()'ed, start with no handlers
logger.addHandler(ch)


class Neighbors(object):
    """lexical neighborhood

    Args:
        data (pandas.DataFrame): a dataframe containing a column
            called `key`, and columns with names matching the elements of
            `features`
        features (list of str): a character vector containing the column names in
            `data` over which to calculate neighborhood densities
        allowed_misses (int): an integer indicating how many features
            are allowed to differ between the target word and the
            candidate word while still considering the candidate a
            neighbor
        allowed_matches (int): (default:`length(features)`) an integer
            indicating the maximum number of features that are allowed to
            match between the target word and the candidate word while still
            considering the candidate a neighbor
        key (str): (default: 'Code') a column to use as the key for an item
            in `data`, e.g. a Sign ID, a gloss, or some other reasonable ID.
    """
    def __init__(self, data, features, allowed_misses=0, allowed_matches=None, key='Code'):
        self.data = data
        self.features = list(features)
        self.key = key

        missing_features = [
            x for x in self.features if x not in list(self.data.columns.values)]
        if missing_features:
            msg = "Feature(s) {} not in DataFrame data".format(missing_features)
            raise ValueError(msg)

        if key not in list(self.data.columns.values):
            raise ValueError("Key {} is not a column in DataFrame data".format(key))

        self.allowed_misses = allowed_misses
        if self.allowed_misses > len(self.features)-1:
            raise ValueError("allowed_misses must be less than or equal to (length(features) - 1)")
        elif self.allowed_misses < 0:
            raise ValueError("allowed_misses must be >=0")

        self.allowed_matches = allowed_matches
        if self.allowed_matches is None:
            self.allowed_matches = len(self.features)
        elif self.allowed_matches > len(self.features):
            raise ValueError("allowed_matches cannot exceed length(features)")
        elif self.allowed_matches < 1:
            raise ValueError("allowed_matches must be greater than 1")

        logger.debug("len(data.index): %d" % len(data.index))
        logger.debug("len(features): %d" % len(features))
        logger.debug("features: %s " % features)

        self.nd, self.neighbors = self._Compute()

    def WriteCSVs(self, outputdir, basename, mirror_neighbors=True):
        """Writes neighborhood density and neighbors to CSV files

        If `outputdir` does not exist, it will be created.

        Args:
            outputdir (str): path into which to write CSV files
            basename (str): base name for results .csv files; files will be
                named [basename]-neighbors.csv and [basename]-nd.csv
            mirror_neighbors (bool): (default: True) If True, Mirror the neighbors
                DataFrame such that every A-B pair appears as both
                A(target)-B(neighbor) and B(target)-A(neighbor). If False, the pair
                will appear only once in neighbors

        """

        if not os.path.isdir(os.path.expanduser(outputdir)):
            os.mkdir(os.path.expanduser(outputdir))

        neighbor_out_path = os.path.join(os.path.expanduser(outputdir), basename + "-neighbors.csv")
        if mirror_neighbors:
            logger.debug("mirroring neighbors to write CSV")
            self._MirrorNeighbors().to_csv(neighbor_out_path, na_rep='NA', index=False)
        else:
            logger.debug("not mirroring neighbors to write CSV")
            self.neighbors.to_csv(neighbor_out_path, na_rep='NA', index=False)
        logger.info("Wrote file %s" % neighbor_out_path)

        nd_out_path = os.path.join(os.path.expanduser(outputdir), basename + "-nd.csv")
        self.nd.to_csv(nd_out_path, na_rep='', index=False)
        logger.info("wrote file %s" % nd_out_path)

    @property
    def Neighbors(self, mirror_neighbors=True):
        """Accessor for neighbors DataFrame

        """
        if mirror_neighbors:
            return(self._MirrorNeighbors())
        else:
            return(self.neighbors)

    @property
    def ND(self):
        """Accessor for neighborhood density DataFrame

        Returns:
            DataFrame: the input DataFrame, with an additional column appended
            containing the neighborhood density count for each item
        """
        return(self.nd)

    def _MatchFeature(self, i, j, feature):
        """Check whether items match on a given feature

        features are a match iff they both have values (i.e. they are
        both not NA) and their values are logically equal

        if both features are NA, this function returns `None`,
        i.e. they are neither a match nor a miss

        Args:
            i, j (int): indices of items to evaluate
            feature (str): feature on which to evaluate match

        Returns:
        str 'match' if a match is found, 'miss' if a miss is found,
        `None` otherwise

        """
        if (pd.isna(self.data.iloc[i, self.data.columns.get_loc(feature)]) and
                pd.isna(self.data.iloc[j, self.data.columns.get_loc(feature)])):
            msg = "{} and {} are both NA on feature {}"
            msg = msg.format(
                self.data.iloc[i, self.data.columns.get_loc(self.key)],
                self.data.iloc[j, self.data.columns.get_loc(self.key)],
                feature)
            logger.debug(msg)
            return(None)
        elif ((pd.notna(self.data.iloc[i, self.data.columns.get_loc(feature)]) and
            pd.notna(self.data.iloc[j, self.data.columns.get_loc(feature)])) and
            (self.data.iloc[i, self.data.columns.get_loc(feature)] ==
            self.data.iloc[j, self.data.columns.get_loc(feature)])):
            result = 'match'
        else:
            result = 'miss'

        msg = "{} and {} are a {} on feature {}, ({}, {})."
        msg = msg.format(
            self.data.iloc[i, self.data.columns.get_loc(self.key)],
            self.data.iloc[j, self.data.columns.get_loc(self.key)],
            result,
            feature,
            self.data.iloc[i, self.data.columns.get_loc(feature)],
            self.data.iloc[j, self.data.columns.get_loc(feature)],
        )
        logger.debug(msg)
        return(result)

    def _MirrorNeighbors(self):
        """Mirrors a neighbors DataFrame from MinimalPairND

        Mirror the neighbors DataFrame such that every A-B pair appears as
        both A(target)-B(neighbor) and B(target)-A(neighbor)

        Args:
            df (pandas.DataFrame): a neighbors DataFrame from MinimalPairND()

        Returns:
            A pandas.DataFrame with twice as many rows as the input df,
            sorted by target, then neighbor
        """
        fd = self.neighbors.copy()

        fd.loc[:, 'target'] = self.neighbors.loc[:, 'neighbor']
        fd.loc[:, 'neighbor'] = self.neighbors.loc[:, 'target']

        result = pd.concat([self.neighbors, fd])
        result = result.sort_values(by=['target', 'neighbor'])
        return(result)

    def _FormatHMS(self, s):
        """formats a duration in seconds into `H:MM:SS.ms`

        Args:
            s (float): time in seconds

        Returns:
            string
        """
        hours, remainder = divmod(s, 60**2)
        minutes, seconds = divmod(remainder, 60)
        return("{:.0f}:{:02.0f}:{:05.2f}".format(hours, minutes, seconds))

    def _Compute(self):
        """compute neighborhood density

        TODO: redefine logic according to the following:

        If two signs are "NA" on a given feature, this does not count
        as a "match", neither does it count as a "miss".

        If one signs is "NA" on a feature, while the other sign has a
        value for that feature, this counts as a "miss"

        also want to output the list of missed features (only for
        signs that meet the definition of neighbors

        Also include in the neighbors dataframe the number of matched
        features and the number of mis-matched features
        (i.e. len(matches) and len(misses))

        Returns:
        (DataFrame): database of items with additional column for computed
            neighborhood density
        (DataFrame): pairs of neighbors

        """
        start_time = time.monotonic()

        nbr_target = []
        nbr_neighbor = []
        nbr_num_match_features = []
        nbr_match_features = []
        nbr_num_missed_features = []
        nbr_missed_features = []
        out_df = self.data.copy()
        nd = [0] * len(self.data.index)

        # outer loop will be stepping through words (source word)
        it_start_time = time.monotonic()
        it_start_iter = 0
        for i in range(0, len(self.data.index)):
            msg = 'starting word {} of {}, "{}"'
            msg = msg.format(i+1, len(self.data.index),
                            self.data.iloc[i, self.data.columns.get_loc(self.key)])
            if i == 0:
                logger.info(msg)
            elif (i+1) % 10 == 0:
                frac_complete = i/len(self.data.index)
                et = time.monotonic() - it_start_time
                try:
                    rate = (i - it_start_iter)/et
                except ZeroDivisionError:
                    rate = float("inf")
                etc = (len(self.data.index)-i) * 1/rate
                logger.debug("i: %s etc: %s" % (i, etc))
                logger.debug("self._FormatHMS(etc): %s" % self._FormatHMS(etc))

                msg2 = (".. {complete:.1%} complete, {rate:.2f} words/sec."
                        + " Est. {etc}"
                        + " (H:MM:SS.ms) remaining.")
                msg2 = msg2.format(complete=frac_complete, rate=rate,
                                etc=self._FormatHMS(etc))
                logger.info(msg2)
                logger.info(msg)
                it_start_time = time.monotonic()
                it_start_iter = i
            else:
                logger.debug(msg)
            # second level loop will also be stepping through words (candidate word)
            # for j in range(0, len(self.data.index)):
            for j in range(i, len(self.data.index)):
                if (i != j):  # TODO: change starting index to i+1 and remove this conditional
                    matches, misses = (0, 0)
                    matched_features, missed_features = ("", "")

                    # third-level loop will step through features,
                    # counting the number of features of the candidate
                    # word that match the source word. If the matches
                    # equal or exceed (len(features) - allowed_misses),
                    # put the candidate word into the list of neighbors
                    for k in range(0, len(self.features)):
                        match_result = self._MatchFeature(i, j, self.features[k])
                        if match_result == 'match':
                            source = self.data.iloc[i, self.data.columns.get_loc(self.key)],
                            target = self.data.iloc[j, self.data.columns.get_loc(self.key)],
                            feature = self.features[k]
                            msg = "Matched {source} to {target} on feature {feature}"
                            msg = msg.format(source=source, target=target, feature=feature)
                            logger.debug(msg)
                            matches = matches + 1
                            if matched_features == "":
                                matched_features = self.features[k]
                            else:
                                matched_features = ", ".join([matched_features,
                                                            self.features[k]])
                        elif match_result == 'miss':
                            source = self.data.iloc[i, self.data.columns.get_loc(self.key)],
                            target = self.data.iloc[j, self.data.columns.get_loc(self.key)],
                            feature = self.features[k]
                            msg = "missed: {source} to {target} on feature {feature}"
                            msg = msg.format(source=source, target=target, feature=feature)
                            logger.debug(msg)
                            misses = misses + 1
                            if missed_features == "":
                                missed_features = self.features[k]
                            else:
                                missed_features = ", ".join([missed_features,
                                                            self.features[k]])
                    # TODO: This conditional will need to chage
                    if ((misses <= self.allowed_misses) and (matches >= 1)):
                        logger.debug("adding match to neighbors")
                        nbr_target.append(self.data.iloc[i, self.data.columns.get_loc(self.key)])
                        nbr_neighbor.append(self.data.iloc[j, self.data.columns.get_loc(self.key)])
                        nbr_num_match_features.append(matches)
                        nbr_match_features.append(matched_features)
                        nbr_num_missed_features.append(misses)
                        nbr_missed_features.append(missed_features)
                        logger.debug("incrementing neighborhood density"
                                    + "for both members of the pair")
                        nd[i] += 1
                        nd[j] += 1

            # back to i loop
        data_dict = {'target': nbr_target,
                    'neighbor': nbr_neighbor,
                    'num_matched_features': nbr_num_match_features,
                    'matched_features': nbr_match_features,
                    'num_missed_features': nbr_num_missed_features,
                    'missed_features': nbr_missed_features}

        neighbors = pd.DataFrame(data_dict)
        elapsed_time = time.monotonic() - start_time
        msg = "completed {words} words in {et} (H:MM:SS.ms) ({rate:.2f} word/sec)"
        msg = msg.format(words=len(self.data.index),
                        et=self._FormatHMS(elapsed_time),
                        rate=len(self.data.index)/elapsed_time)
        logger.info(msg)

        out_df['Neighborhood Density'] = nd

        return(out_df, neighbors)
