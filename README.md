# grblTouch
grblTouch is a webUI optimized for 6 to 10 inch touch displays for grblHAL and FluidNC (testing and validation requested for FluidNC).

grblTouch is written in plain html, css and javascript. This makes it a very lightweight even in uncompressed form. This webUI doesn't require to be compiled to one single file like "index.html.gz". This makes it simple, easy to use and easy to modify without any complex software requirements. Some parts of UI are inspired by "Shopfloor Tablet" UI by Mitch Bradley.

This is a basic but working webUI project based on websockets protocol. Do the necessary modifications in "app.js" file within starting lines (appropriate comments are written to guide the user) and save the file. Put the "www" directory in root of SD card which is hosted in grblHAL controller. We strongly recommend to use "FTP" (as there is no file upload/delete feature as of now in grblTouch) for any file transfer to and fro SD card by a suitable free software like "FileZilla".

A webUI is not a "sender" software. It runs a gcode file from SD card only. For mostly all other aspects, it acts same as sender softwares to communicate with grbl controller.

A raspberry pi 4 (recommended) with 7 inch display and combo case should be ideal for grblTouch. For MDI entries, user may require keyboard on raspberry pi and similar OS.

grblTouch also facilitates keyboard shortcuts as per following table.


Keyboard Shortcuts (Use with caution!):
------------------------------------------------------
Key                 Function
------------------------------------------------------
R                   Reset
U                   Unlock
H                   Home
P                   Probe
9                   Program Start/Resume
0                   Feedhold
Right Arrow         X plus jog
Left Arrow          X minus jog
Up Arrow            Y minus jog
Down Arrow          Y plus jog
Page Up             Z plus jog
Page Down           Z minus jog
F1                  Switch Jog Tab
F2                  Switch Run Tab
F5                  Reload page (system function. Don't use it when file is running. It resets websocket connection as well as controller)
F6                  Decrease screen brightness by 10% (minimum 50%)
F7                  Increase screen brightness by 10% (maximum 100%)
F8                  Coolant On
F9                  Spindle On at 6000rpm (for testing purpose)
F10                 Coolant and Spindle Off
1                   Select first jog distance (at present 0.002 mm)
2                   Select second jog distance (at present 0.01 mm)
3                   Select third jog distance (at present 0.1 mm)
4                   Select forth jog distance (at present 1 mm)
5                   Select fifth jog distance (at present 5 mm)
6                   Select sixth jog distance (at present 25 mm)
Esc                 Jog Cancel
Q, W, E             Feedrate overrides -10%, Reset, +10% respectively
A, S, D             Spindle RPM overrides -10%, Reset, +10% respectively
Z, X, C             Rapid overrides 25%, 50%, 100% respectively
-                   Jog distance decrease to one level
+                   Jog distance increase to one level




Jog Tab Screenshot:
![Jog Tab](https://user-images.githubusercontent.com/45288223/152221602-fb87cd04-639c-4972-8a08-92cd418d9057.png)



Run Tab Screenshot:
![Run Tab](https://user-images.githubusercontent.com/45288223/152221661-baeea68e-796f-4ade-b774-9b0e367e331f.png)



Running a program from SD screenshot:
![Running a program](https://user-images.githubusercontent.com/45288223/152221683-4a36266c-6830-4358-9d16-5965295ccadf.png)
