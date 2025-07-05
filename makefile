upgrade:
	git pull origin

install_deps:
	npm ci

run_dev:
	npm run dev

build:
	npm run build

run_via_pm2:
	pm2 serve dist 3333 --name "frontend" --spa

upgrade_and_run_dev: upgrade install_deps run_dev

upgrade_and_build: upgrade install_deps build

upgrade_and_restart_pm2: upgrade_and_build
	pm2 restart frontend