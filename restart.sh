GIT_CHANGES=`git pull | wc -l`
if [ $GIT_CHANGES -gt 1 ]; then
	echo 'Changes detected: $GIT_CHANGES'
	echo 'killing process'
	pkill -f 'node app.js'
	echo 're-installing'
	npm install
	echo 'firing up app'
	node app.js &
fi