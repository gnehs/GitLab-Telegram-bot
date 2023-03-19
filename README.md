# GitLab Issue Telegram Bot

這個機器人將定期從 GitLab 抓取 issue 動態，並將更新發送到指定的 Telegram 頻道。

GPT-4-0314 寫的，有問題不要找我，自己去找他修，就這樣。

## 功能

- 每分鐘獲取 GitLab issue 動態
- 將新的 issue 更新發送到指定的 Telegram 頻道
- 記住已經發送過的 issue 以避免重複發送
- 使用 Markdown 格式美化訊息內容

## 安裝與使用

1. 確保您已經安裝了 [Node.js](https://nodejs.org/)。
2. 使用以下命令安裝依賴套件：
   ```
   npm install telegraf node-fetch jsdom
   ```
3. 為機器人設置環境變數（使用實際的值替換以下示例）：
   - `TELEGRAM_BOT_TOKEN`: 您的 Telegram Bot Token
   - `TELEGRAM_CHANNEL_ID`: 要發送訊息的 Telegram 頻道 ID（例如：-1001962261708）
   - `GITLAB_FEED_URL`: GitLab RSS 連結（例如：https://gitlab.com/HacksInTaiwan/2023/board.atom?feed_token=xxxxxx）
4. 在與 `index.js` 相同的目錄中創建一個名為 `sent_issues.json` 的文件，並將其初始內容設置為 `[]`。
5. 在命令行中設置環境變數並運行此文件以啟動機器人（根據您的操作系統選擇相應的命令）：
   - 對於 Unix/Linux/macOS：
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token TELEGRAM_CHANNEL_ID=-1001962261708 GITLAB_FEED_URL=https://gitlab.com/HacksInTaiwan/2023/board.atom?feed_token=xxxxxx node index.js
     ```
   - 對於 Windows：
     ```
     set TELEGRAM_BOT_TOKEN=your_bot_token && set TELEGRAM_CHANNEL_ID=-1001962261708 && set GITLAB_FEED_URL=https://gitlab.com/HacksInTaiwan/2023/board.atom?feed_token=xxxxxx && node index.js
     ```

現在機器人將每分鐘獲取 GitLab issue 動態，並將它們發送到指定的 Telegram 頻道。