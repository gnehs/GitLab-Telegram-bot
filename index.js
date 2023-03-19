import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';

// 設置你的 Telegram Bot Token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const GITLAB_FEED_URL = process.env.GITLAB_FEED_URL;
const SENT_ISSUES_FILE = 'sent_issues.json';

// 從 JSON 文件中讀取已發送的 issue ID
function loadSentIssueIds() {
  try {
    const data = fs.readFileSync(SENT_ISSUES_FILE, 'utf8');
    const issueIds = JSON.parse(data);
    return new Set(issueIds);
  } catch (error) {
    // 返回一個空的 Set
    return new Set();
  }
}

// 將新的 issue ID 添加到 JSON 文件中
function saveSentIssueId(issueId) {
  sentIssueIds.add(issueId);
  const data = JSON.stringify(Array.from(sentIssueIds));
  fs.writeFileSync(SENT_ISSUES_FILE, data);
}
// 獲取 GitLab issue 動態
async function fetchGitLabIssues() {
  const response = await fetch(GITLAB_FEED_URL);
  const text = await response.text();
  const dom = new JSDOM(text);
  const document = dom.window.document;
  const entries = document.querySelectorAll('entry');

  let issues = [];

  for (let entry of entries) {
    const linkElement = entry.querySelector('link');
    const link = linkElement ? linkElement.getAttribute('href') : '';

    issues.push({
      id: entry.querySelector('id').textContent,
      title: entry.querySelector('title').textContent,
      updated: entry.querySelector('updated').textContent,
      summary: entry.querySelector('summary').textContent,
      link,
    });
  }

  return issues;
}

// 發送 GitLab issue 至 Telegram 頻道
async function sendGitLabIssuesToTelegram() {
  const issues = await fetchGitLabIssues();

  for (let issue of issues) {
    // 檢查 issue 是否已經發送過
    if (!sentIssueIds.has(issue.id)) {
      const message = `<b>🆕 Issue 更新！</b><br><br><a href="${issue.link}">Title: ${issue.title}</a><br>Updated: ${issue.updated}<br>Summary: ${issue.summary}`;
      await bot.telegram.sendMessage(CHANNEL_ID, message, { parse_mode: 'HTML' });
      // 將 issue ID 添加到已發送集合中，並更新 JSON 文件
      saveSentIssueId(issue.id);
    }
  }
}

// 讀取已發送 issue ID
let sentIssueIds = loadSentIssueIds();

// 每分鐘獲取 GitLab issue 動態並發送至 Telegram 頻道
setInterval(sendGitLabIssuesToTelegram, 60 * 1000);

bot.launch();
sendGitLabIssuesToTelegram()