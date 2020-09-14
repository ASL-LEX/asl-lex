#!/bin/bash -l

#Pull repo from GH
mkdir deploy && cd deploy
git clone git clone https://github.com/ASL-LEX/asl-lex
#swutch to GH pages
cd asl-lex
git checkout master

cd visualization
#delete older static files, and replace with newer genrated ones.
rm data/graph.json data/sign_props.json data/constraints.json
cp ../data-analysis/scripts/generated-data/graph.json data/
cp ../data-analysis/scripts/generated-data/sign_props.json data/
cp ../data-analysis/scripts/generated-data/constraints.json data/

cd ..
rm -rf data-analysis graph_scc_data readme.md
mv visualization/* .
git branch -D gh-pages
git checkout -b gh-pages
#push to GH pages. Git should be configured for this. Might need to push using token which should be in an env/keys file which is ignored.
git commit -am "updating files and redeploying"
git push origin head

#delete the clone of the repo.
cd ..
rm -rf deploy/
