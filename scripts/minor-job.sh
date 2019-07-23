#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -M fanonxr@bu.edu

# project nme
#$ -P hariri

# job name
#$ -N asl_lex_minor

# Combine output and error files into a single file
#$ -j y

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python3/3.7.3

MINOR_FEATURES="MinorLocationM2.2.0,SecondMinorLocationM2.2.0,MinorLocationM3.2.0,SecondMinorLocationM3.2.0,MinorLocationM4.2.0,SecondMinorLocationM4.2.0,MinorLocationM5.2.0,SecondMinorLocationM5.2.0,MinorLocationM6.2.0,SecondMinorLocationM6.2.0"
MINOR_FILE_NAME="minor"
MINOR_MISS=0

# executing script
python app.py "$MINOR_FEATURES" $MINOR_MISS $MINOR_FILE_NAME


