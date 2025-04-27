upgrade:
	git pull origin

install_deps:
	npm ci

run_dev:
	npm run dev

upgrade_and_run_dev: upgrade install_deps run_dev