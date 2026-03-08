---
name: browser-capture
description: Manage browser sessions and capture screenshots at multiple viewport sizes.
allowed-tools:
  - Bash
  - Read
  - Glob
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_take_screenshot
  - mcp__playwright__browser_resize
  - mcp__playwright__browser_close
---

# Browser Capture Skill

Capture screenshots of web pages at multiple viewport sizes using Playwright.

## Server Management

```bash
# Check if server is running
lsof -i :4200 -t

# Start if needed
npm start &
for i in {1..15}; do
  curl -s http://localhost:4200 > /dev/null && break
  sleep 2
done
```

## Screenshot Capture Process

### 1. Navigate to Page

Use `mcp__playwright__browser_navigate`.

### 2. Capture at Multiple Viewports

| Name    | Width | Height |
| ------- | ----- | ------ |
| Desktop | 1920  | 1080   |
| Tablet  | 768   | 1024   |
| Mobile  | 375   | 667    |

### 3. Upload Screenshots

Delegate upload to `maia-files-upload` skill.

## Output Format

```json
{
  "screenshots": [
    {
      "viewport": "desktop",
      "dimensions": "1920x1080",
      "localPath": "/tmp/screenshot-desktop.png"
    }
  ]
}
```
