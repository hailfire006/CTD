# Print js files by lines of code

cd ./js
#( find . -name '*.js' -print0 | xargs -0 cat ) | wc -l
find . -name '*.js' -print0 | xargs -0 wc -l | sort
read -p "$*"