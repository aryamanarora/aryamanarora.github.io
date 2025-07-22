#!/bin/bash

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <markdown_file>"
    echo "Example: $0 posts/my-post.md"
    exit 1
fi

input_file="$1"
base_name=$(basename "$input_file" .md)
output_file="posts/${base_name}.html"

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Error: File '$input_file' not found."
    exit 1
fi

# Extract title from the first heading in the markdown file
title=$(head -20 "$input_file" | grep -m1 "^# " | sed 's/^# //' | tr -d '\n')
if [ -z "$title" ]; then
    echo "Warning: No title found in markdown file. Using filename as title."
    title="$base_name"
fi

# Extract date from filename if it follows the YYYY-MM-DD pattern
date_from_filename=$(echo "$base_name" | grep -o '^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}')

# Create a temporary pandoc filter to convert footnotes to sidenotes
cat > footnote_filter.lua << 'EOF'
function Note(note)
  -- Convert the note content to HTML while preserving formatting
  local content_html = pandoc.write(pandoc.Pandoc(note.content), 'html')
  -- Remove the wrapping <p> tags that pandoc adds
  content_html = content_html:gsub('^<p>', ''):gsub('</p>$', '')
  local sidenote = pandoc.RawInline('html', 
    '<span class="sidenote-number">\n      <small class="sidenote">' .. content_html .. '</small>\n    </span>')
  return sidenote
end
EOF

# Remove the first h1 heading from markdown content (we use it for title but don't want it in body)
temp_md=$(mktemp)
awk 'NR==1 && /^# / {next} {print}' "$input_file" > "$temp_md"

# Convert markdown to HTML body content using pandoc
body_content=$(pandoc "$temp_md" \
    --from markdown \
    --to html \
    --lua-filter footnote_filter.lua \
    --wrap=none)

# Clean up temporary markdown file
rm "$temp_md"

# Clean up temporary filter
rm footnote_filter.lua

# Create the full HTML file
cat > "$output_file" << EOF
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title - Aryaman Arora</title>
  <meta name="description" content="Blog post by Aryaman Arora">
  <meta property="og:title" content="$title">
  <meta property="og:type" content="article">
  <meta property="og:description" content="Blog post by Aryaman Arora">
  <meta property="og:url" content="https://aryaman.io/posts/$base_name.html">
  <meta property="og:image" content="https://aryaman.io/favicon.ico">
  <meta name="twitter:title" content="$title">
  <meta name="twitter:description" content="Blog post by Aryaman Arora">
  <meta name="twitter:image" content="https://aryaman.io/favicon.ico">
  <link rel="canonical" href="https://aryaman.io/posts/$base_name.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@aryaman2020">
  <link rel="stylesheet" href="/main.css">
</head>

<body>
  <p style="font-size: 24px; font-weight: 600;"><a href="/index.html">Aryaman Arora</a> » <a href="/blog.html">Blog</a> » $title</p>

$body_content
</body>

</html>
EOF

echo "Converted '$input_file' to '$output_file'"
echo "Title: $title" 