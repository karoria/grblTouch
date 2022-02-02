# grblTouch
grblTouch is a webUI optimized for 6 to 10 inch touch displays for grblHAL and FluidNC (testing and validation requested for FluidNC).

grblTouch is written in plain html, css and javascript. This makes it a very lightweight even in uncompressed form. This webUI doesn't require to be compiled to one single file like "index.html.gz". This makes it simple, easy to use and easy to modify without any complex software requirements. Some parts of UI are inspired by "Shopfloor Tablet" UI by Mitch Bradley.

This is a basic but working webUI project based on websockets protocol. Do the necessary modifications in "app.js" file within starting lines (appropriate comments are written to guide the user) and save the file. Put the "www" directory in root of SD card which is hosted in grblHAL controller. We strongly recommend to use "FTP" (as there is no file upload/delete feature as of now in grblTouch) for any file transfer to and fro SD card by a suitable free software like "FileZilla".

A raspberry pi 4 (recommended) with 7 inch display and combo case should be ideal for grblTouch. For MDI entries, user may require keyboard on raspberry pi and similar OS.

grblTouch also facilitates keyboard shortcuts. diagram or description to be added soon.