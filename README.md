# Dev Tools & Productivity Apps Rankings

A comprehensive ranking website for development tools and productivity applications worldwide.
<img width="517" height="685" alt="homepage" src="https://github.com/user-attachments/assets/83276dd4-af6c-4aaf-a62b-310f62e41def" />
<img width="326" height="673" alt="rankingpage" src="https://github.com/user-attachments/assets/87c86392-5ebd-4c01-a6f1-86e8adaccfc8" />

## How to run
1. Install node.js
2. Database setup (table name matches the name in `database.js`)
3. Clone this repository
4. Run `npm install` in the root directory
5. Run `npm start` in the root directory
6. Open `http://localhost:3000` in your browser

## Features

The website shows top-rated development tools and productivity apps in different regions:
- **Dev Tools Rankings**: IDEs, code editors, version control tools, and more
- **Productivity Apps Rankings**: Task management, project management, collaboration tools

The website includes top 10 tools/apps in each category and region, with the top 3 featuring highlighted recommendations.

The rankings are updated monthly and stored in the database. Users can:
- Browse rankings by region
- View historical rankings from different months
- See detailed information about each tool/app including features, strengths, and official website links
- Compare tools across different categories

## Project Structure

- `index.html` - Main landing page with region selection
- `templates/dev-tools.html` - Dev tools ranking template
- `templates/productivity-apps.html` - Productivity apps ranking template
- `api/` - API endpoints for rankings data
- `services/` - Business logic and database services
- `js/` - Frontend JavaScript files
