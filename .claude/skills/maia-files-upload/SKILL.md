---
name: maia-files-upload
description: Upload a file to Maia API temporary storage.
allowed-tools: Bash
---

# Maia Files Upload

Upload a file to the Maia AI API temporary storage and get a URL for use in Linear comments.

## API Endpoint

```
POST https://maia-ai-api.smartsoft.biz.pl/files
```

## Usage

```bash
curl -s -X POST https://maia-ai-api.smartsoft.biz.pl/files \
  -F "file=@/path/to/file.png"
```

## Process

1. Validate file exists: `test -f "/path/to/file"`
2. Upload file using curl
3. Extract ID from JSON response
4. Return ID and full URL

## Output Format

```
Uploaded: {filename}
ID: {id}
URL: https://maia-ai-api.smartsoft.biz.pl/files/{id}
```
