#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -M fanonxr@bu.edu

# project nme
#$ -P hariri

# job name
#$ -N asl_lex_handshape

# Combine output and error files into a single file
#$ -j y

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python3/3.7.3

HANDSHAPE_FEATURES="Handshape.2.0"
HANDSHAPE_FILE_NAME="handshape"
HANDSHAPE_MISS=0

python -m venv ./venv
source venv/bin/activate
pip install -r requirements.txts

# executing script
python app.py "$HANDSHAPE_FEATURES" $HANDSHAPE_MISS $HANDSHAPE_FILE_NAME


