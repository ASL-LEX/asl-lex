#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -m fanonxr@bu.edu

# job name
#$ -N asl_lex

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python/3.7.0

DEFAULT_FEATURES = "SelectedFingers.2.0,Flexion.2.0,FlexionChange.2.0,Spread.2.0,SpreadChange.2.0,ThumbPosition.2.0,ThumbContact.2.0,SignType.2.0 Movement.2.0,MajorLocation.2.0,MinorLocation.2.0,SecondMinorLocation.2.0,Contact.2.0,NonDominantHandshape.2.0,UlnarRotation.2.0"
ALLOWED_MISSES = 1
EXPORT_FILE_NAME = "default"

# executing script
# default parameters to create neighborhood density & edges
python app.py -V DEFAULT_FEATURES ALLOWED_MISSES EXPORT_FILE_NAME



