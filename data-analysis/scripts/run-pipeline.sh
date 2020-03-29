#!/bin/bash -l

# time limit from job
#$ -l h_rt=24:00:00

# Send an email when the job finishes or if it is aborted (by default no email is sent).
#$ -M shreyap@bu.edu

# project nme
#$ -P hariri

# job name
#$ -N asl_lex_default

# Combine output and error files into a single file
#$ -j y

#$ -pe omp 8
#$ -l mem_per_core=8G

# module version to be used
module load python3/3.7.5
python -m venv ./venv
source venv/bin/activate
pip install --user -r  /project/hariri/asl-lex/data-analysis/scripts/requirements.txt

#TODO Pull data from online, preferably at a given time interval

# executing script first
#qsub -o /project/hariri/asl-lex/logs/ -N RUN_PYND /project/hariri/asl-lex/data-analysis/scripts/default-job.sh

# if above is successful, then use those files to create the graph jsons
qsub -o /project/hariri/asl-lex/logs/ -N MAKE_GRAPH_FILES /project/hariri/asl-lex/data-analysis/scripts/make_graph_files.py

#TODO Add the generated files to a certain branch called graph-data on github (mergeable with master)