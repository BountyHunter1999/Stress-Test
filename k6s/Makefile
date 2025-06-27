stress:
	K6_BROWSER_HEADLESS=false K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_HOST=0.0.0.0 K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run ui.js


see_browser:
	K6_BROWSER_HEADLESS=false K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_HOST=0.0.0.0 K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run ui.js --browser-headless=false

setup:
	npm init --yes
	npm install --save-dev @types/k6

dashboard:
	K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_HOST=0.0.0.0 K6_WEB_DASHBOARD_OPEN=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run ui.js