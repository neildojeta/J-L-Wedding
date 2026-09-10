Drop your photos and videos into the folders here, then run:

    npm run upload-media -- --dry-run    (see what would happen)
    npm run upload-media                 (do it)

  highlight/   the sliding gallery on the invitation
  venue/       extra photos of the garden
  dress_code/  attire inspiration

The folder name IS the category, so put each file in the right one.

Naming
  Start a filename with a number to control the order:
      01 - a kiss among the flowers.jpg
  The number becomes sort_order, and the rest becomes the caption
  ("A kiss among the flowers"). Captions are also the alt text, so
  keep them descriptive.

  To set captions by hand instead, create captions.json here:
      { "highlight/01 - first look.jpg": "The first look" }

Formats
  Photos  jpg, png, webp  - resize to about 1600px wide first
  Videos  mp4 (H.264)     - .mov often will not play in browsers

Nothing in this folder is deployed; it is just the staging area.
