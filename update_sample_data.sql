-- update sample data to current year and month
USE website_board;

-- clear existing data
DELETE FROM tool_rankings;

-- Update sample data to current year and month
-- China - Dev Tools
INSERT INTO tool_rankings 
(`region`, `service_type`, `year`, `month`, `ranking_position`, `tool_name`, `tool_description`, `features`, `website_link`) 
VALUES
('china', 'devTools', 2026, 2, 1, 'Visual Studio Code', 
 'A powerful, lightweight code editor with extensive extension support', 
 '["IntelliSense code completion", "Built-in Git integration", "Extensive marketplace", "Cross-platform support"]', 
 'https://code.visualstudio.com'),
 
('china', 'devTools', 2026, 2, 2, 'IntelliJ IDEA', 
 'Professional IDE for Java and other JVM languages', 
 '["Smart code completion", "Framework support", "Database tools", "Version control"]', 
 'https://www.jetbrains.com/idea'),
 
('china', 'devTools', 2026, 2, 3, 'GitHub', 
 'Platform for version control and collaboration', 
 '["Git repositories", "Code review", "CI/CD pipelines", "Project management"]', 
 'https://github.com'),

('china', 'devTools', 2026, 2, 4, 'Docker', 
 'Container platform for building and deploying applications', 
 '["Containerization", "Microservices support", "Easy deployment", "Consistent environments"]', 
 'https://www.docker.com'),

('china', 'devTools', 2026, 2, 5, 'Postman', 
 'API development and testing platform', 
 '["API testing", "Documentation", "Mock servers", "Collaboration tools"]', 
 'https://www.postman.com');

-- China - Productivity Apps
INSERT INTO tool_rankings 
(`region`, `service_type`, `year`, `month`, `ranking_position`, `tool_name`, `tool_description`, `features`, `website_link`) 
VALUES
('china', 'productivityApps', 2026, 2, 1, 'Notion', 
 'All-in-one workspace for notes, docs, and project management', 
 '["Flexible databases", "Real-time collaboration", "Templates", "API integration"]', 
 'https://www.notion.so'),
 
('china', 'productivityApps', 2026, 2, 2, 'Slack', 
 'Business communication platform', 
 '["Channels and DMs", "File sharing", "App integrations", "Video calls"]', 
 'https://slack.com'),
 
('china', 'productivityApps', 2026, 2, 3, 'Trello', 
 'Visual project management tool', 
 '["Kanban boards", "Task cards", "Team collaboration", "Power-ups"]', 
 'https://trello.com'),

('china', 'productivityApps', 2026, 2, 4, 'Asana', 
 'Work management platform for teams', 
 '["Task management", "Timeline view", "Workload management", "Reporting"]', 
 'https://asana.com'),

('china', 'productivityApps', 2026, 2, 5, 'Todoist', 
 'Task manager and to-do list app', 
 '["Natural language input", "Priority levels", "Recurring tasks", "Cross-platform sync"]', 
 'https://todoist.com');

-- Singapore - Dev Tools
INSERT INTO tool_rankings 
(`region`, `service_type`, `year`, `month`, `ranking_position`, `tool_name`, `tool_description`, `features`, `website_link`) 
VALUES
('singapore', 'devTools', 2026, 2, 1, 'Visual Studio Code', 
 'A powerful, lightweight code editor', 
 '["IntelliSense", "Git integration", "Extensions", "Cross-platform"]', 
 'https://code.visualstudio.com'),
 
('singapore', 'devTools', 2026, 2, 2, 'GitHub', 
 'Version control and collaboration platform', 
 '["Git repos", "Code review", "CI/CD", "Project management"]', 
 'https://github.com'),

('singapore', 'devTools', 2026, 2, 3, 'Docker', 
 'Container platform for applications', 
 '["Containerization", "Microservices", "Easy deployment", "Portability"]', 
 'https://www.docker.com');

-- Singapore - Productivity Apps  
INSERT INTO tool_rankings 
(`region`, `service_type`, `year`, `month`, `ranking_position`, `tool_name`, `tool_description`, `features`, `website_link`) 
VALUES
('singapore', 'productivityApps', 2026, 2, 1, 'Notion', 
 'All-in-one workspace', 
 '["Databases", "Collaboration", "Templates", "API"]', 
 'https://www.notion.so'),
 
('singapore', 'productivityApps', 2026, 2, 2, 'Slack', 
 'Business communication platform', 
 '["Channels", "File sharing", "Integrations", "Video calls"]', 
 'https://slack.com'),

('singapore', 'productivityApps', 2026, 2, 3, 'Monday.com', 
 'Work operating system', 
 '["Visual workflows", "Automation", "Integrations", "Dashboards"]', 
 'https://monday.com');

-- 查看插入的数据
SELECT 
    region,
    service_type,
    year,
    month,
    COUNT(*) as record_count
FROM tool_rankings
GROUP BY region, service_type, year, month
ORDER BY region, service_type;
