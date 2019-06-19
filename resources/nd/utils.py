import pandas as pd
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(name)s - %(asctime)-14s %(levelname)-8s: %(message)s',
                            "%m-%d %H:%M:%S")
ch.setFormatter(formatter)
logger.handlers = []
logger.addHandler(ch)



def subsample(input: ('path to input .csv file'),
            output: ('path into which to save subsampled result'),
            n: ('number of records to include in the subsampled output', 'positional', None, int)):
    """Read a csv file, and save a random subsample
    """
    logger.debug("input: %s output: %s n: %s" % (input, output, n))
    data = pd.read_csv(input)
    sub = data.sample(n)
    sub.to_csv(output, na_rep="NA", index=False)


if __name__ == "__main__":
    import plac
    plac.call(subsample)
