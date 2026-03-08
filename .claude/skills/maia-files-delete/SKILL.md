---
name: maia-files-delete
description: Delete a file from Maia API temporary storage.
allowed-tools: Bash
---

# Maia Files Delete

Delete a file from Maia AI API temporary storage.

## API Endpoint

```
DELETE https://maia-ai-api.smartsoft.biz.pl/files/{id}
```

## Usage

```bash
curl -s -X DELETE https://maia-ai-api.smartsoft.biz.pl/files/{id}
```

## Batch Deletion

```bash
for id in id1 id2 id3; do
  curl -s -X DELETE "https://maia-ai-api.smartsoft.biz.pl/files/$id"
  echo "Deleted: $id"
done
```

## Error Handling

If deletion fails, report the error but continue with remaining files.
