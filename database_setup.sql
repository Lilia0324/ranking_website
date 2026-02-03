-- create database website_board
CREATE DATABASE IF NOT EXISTS website_board
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- use database
USE website_board;

-- create rankings table (for storing rankings of Dev Tools and Productivity Apps)
CREATE TABLE IF NOT EXISTS rankings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    region VARCHAR(100) NOT NULL COMMENT '地区名称（如：china, singapore）',
    service_type VARCHAR(50) NOT NULL COMMENT '服务类型（devTools 或 productivityApps）',
    year INT NOT NULL COMMENT '年份',
    month INT NOT NULL COMMENT '月份',
    ranking_position INT NOT NULL COMMENT '排名位置（1-10）',
    tool_name VARCHAR(255) NOT NULL COMMENT '工具/应用名称',
    tool_description TEXT COMMENT '工具/应用描述',
    features JSON COMMENT 'JSON格式的特性列表',
    website_link VARCHAR(500) COMMENT '官方网站链接',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY unique_ranking (region, service_type, year, month, ranking_position),
    INDEX idx_region_service (region, service_type),
    INDEX idx_year_month (year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工具和应用排名表';

-- insert some sample data (data for February 2025)
-- China - Dev Tools
INSERT INTO rankings (region, service_type, year, month, ranking_position, tool_name, tool_description, features, website_link) VALUES
('china', 'devTools', 2025, 2, 1, 'Visual Studio Code', 'A powerful, lightweight code editor with extensive extension support', '["IntelliSense code completion", "Built-in Git integration", "Extensive marketplace", "Cross-platform support"]', 'https://code.visualstudio.com'),
('china', 'devTools', 2025, 2, 2, 'IntelliJ IDEA', 'Professional IDE for Java and other JVM languages', '["Smart code completion", "Framework support", "Database tools", "Version control"]', 'https://www.jetbrains.com/idea'),
('china', 'devTools', 2025, 2, 3, 'GitHub', 'Platform for version control and collaboration', '["Git repositories", "Code review", "CI/CD pipelines", "Project management"]', 'https://github.com'),
('china', 'devTools', 2025, 2, 4, 'Docker', 'Container platform for building and deploying applications', '["Containerization", "Microservices support", "Easy deployment", "Consistent environments"]', 'https://www.docker.com'),
('china', 'devTools', 2025, 2, 5, 'Postman', 'API development and testing platform', '["API testing", "Documentation", "Mock servers", "Collaboration tools"]', 'https://www.postman.com');

-- China - Productivity Apps
INSERT INTO rankings (region, service_type, year, month, ranking_position, tool_name, tool_description, features, website_link) VALUES
('china', 'productivityApps', 2025, 2, 1, 'Notion', 'All-in-one workspace for notes, docs, and project management', '["Flexible databases", "Real-time collaboration", "Templates", "API integration"]', 'https://www.notion.so'),
('china', 'productivityApps', 2025, 2, 2, 'Slack', 'Business communication platform', '["Channels and DMs", "File sharing", "App integrations", "Video calls"]', 'https://slack.com'),
('china', 'productivityApps', 2025, 2, 3, 'Trello', 'Visual project management tool', '["Kanban boards", "Task cards", "Team collaboration", "Power-ups"]', 'https://trello.com'),
('china', 'productivityApps', 2025, 2, 4, 'Asana', 'Work management platform for teams', '["Task management", "Timeline view", "Workload management", "Reporting"]', 'https://asana.com'),
('china', 'productivityApps', 2025, 2, 5, 'Todoist', 'Task manager and to-do list app', '["Natural language input", "Priority levels", "Recurring tasks", "Cross-platform sync"]', 'https://todoist.com');

-- Singapore - Dev Tools
INSERT INTO rankings (region, service_type, year, month, ranking_position, tool_name, tool_description, features, website_link) VALUES
('singapore', 'devTools', 2025, 2, 1, 'Visual Studio Code', 'A powerful, lightweight code editor with extensive extension support', '["IntelliSense code completion", "Built-in Git integration", "Extensive marketplace", "Cross-platform support"]', 'https://code.visualstudio.com'),
('singapore', 'devTools', 2025, 2, 2, 'GitHub', 'Platform for version control and collaboration', '["Git repositories", "Code review", "CI/CD pipelines", "Project management"]', 'https://github.com'),
('singapore', 'devTools', 2025, 2, 3, 'Docker', 'Container platform for building and deploying applications', '["Containerization", "Microservices support", "Easy deployment", "Consistent environments"]', 'https://www.docker.com'),
('singapore', 'devTools', 2025, 2, 4, 'Postman', 'API development and testing platform', '["API testing", "Documentation", "Mock servers", "Collaboration tools"]', 'https://www.postman.com'),
('singapore', 'devTools', 2025, 2, 5, 'Jenkins', 'Open source automation server for CI/CD', '["Continuous integration", "Pipeline as code", "Extensive plugins", "Distributed builds"]', 'https://www.jenkins.io');

-- Singapore - Productivity Apps
INSERT INTO rankings (region, service_type, year, month, ranking_position, tool_name, tool_description, features, website_link) VALUES
('singapore', 'productivityApps', 2025, 2, 1, 'Notion', 'All-in-one workspace for notes, docs, and project management', '["Flexible databases", "Real-time collaboration", "Templates", "API integration"]', 'https://www.notion.so'),
('singapore', 'productivityApps', 2025, 2, 2, 'Slack', 'Business communication platform', '["Channels and DMs", "File sharing", "App integrations", "Video calls"]', 'https://slack.com'),
('singapore', 'productivityApps', 2025, 2, 3, 'Monday.com', 'Work operating system for teams', '["Visual workflows", "Automation", "Integrations", "Custom dashboards"]', 'https://monday.com'),
('singapore', 'productivityApps', 2025, 2, 4, 'ClickUp', 'Project management and productivity platform', '["Multiple views", "Time tracking", "Goal tracking", "Docs and wikis"]', 'https://clickup.com'),
('singapore', 'productivityApps', 2025, 2, 5, 'Microsoft Teams', 'Collaboration platform with chat, meetings, and files', '["Video conferencing", "File collaboration", "Office 365 integration", "Team channels"]', 'https://www.microsoft.com/teams');

-- show the number of inserted records
SELECT 
    service_type,
    region,
    COUNT(*) as record_count
FROM rankings
GROUP BY service_type, region;
