# HTTP query and CSV boundaries

HTTP CRUD lists/exports now default to and cap results at 100 records. Paginate
larger exports; offset must be a non-negative integer at most 10000. Requests are
bounded to 4096 encoded characters, scalar values of at most 1024 characters and
field names of at most 128 characters. Invalid requests return 400.

Supported generated comparisons are eq/ne/gt/gte/lt/lte/in/nin/exists. Raw Mongo
operators, prototype keys, regex values and regex search metacharacters are rejected.
Ordinary field comparisons, projection, ordering and pagination remain available.
The low-level q2m helper remains unchanged for trusted callers. Database timeouts,
indexed fields, per-customer scoping and rate limits must still be configured by the
application; bounded result size does not bound the cost of counting a collection.

CSV prefixes potentially executable text with an apostrophe, including formula
markers after whitespace and leading tabs/newlines. Numeric values remain numeric.
Consumers should import text columns as text and verify their target spreadsheet
workflow. No spreadsheet process is executed by the library tests.
