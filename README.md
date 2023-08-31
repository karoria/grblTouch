# grblTouch
grblTouch is a webUI optimized for 6 to 10 inch touch displays for grblHAL.

grblTouch is written in plain html, css and javascript. This makes it a very lightweight webUI. This webUI is updated in line with latest modifications in grblHAL where flash memory can be utilized to host webUI. A single webUI file in the form of "index.html.gz" is hosted from either littlefs or sdcard. This makes it simple, easy to use and easy to modify without any complex software requirements. Some parts of UI are inspired by "Shopfloor Tablet" UI by Mitch Bradley.

This is a basic but working webUI project based on websockets protocol. If you want to use grblTouch as is, then simply download "index.html.gz file from the source or releases section and put it to root of littlefs or sdcard. If you want to edit any part of this webUI, do the necessary modifications in "index.html" file and gzip it to make it "index.html.gz" and put it to root of littlefs or sdcard. We strongly recommend to use "FTP" (as there is no file upload/delete feature as of now in grblTouch) for any file transfer to and fro SD card by a suitable free software like "FileZilla".

A webUI is not a "sender" software. It runs a gcode file from SD card only. For mostly all other aspects, it acts same as sender softwares to communicate with grbl controller.

A raspberry pi 3 or 4 (recommended) with 7 inch display and combo case should be ideal for grblTouch. For MDI entries, user may require keyboard on raspberry pi and similar OS. A mini generic wireless keyboard (with USB dongle which is to be inserted to PC/raspberry pi) is highly recommended to get full benefit of this software as it will work like a pendant and mostly there will be no need to touch the screen!

Folders/Directories are now supported and they will be highlighted in yellow in files table. One can further go inside those directories to select files to run.

grblTouch also facilitates keyboard shortcuts as per following table.


Keyboard Shortcuts (Use with caution!):
------------------------------------------------------
Key: Function  

R: Reset  
U: Unlock  
H: Home  
P: Probe  
9: Program Start/Resume  
0: Feedhold  
Right Arrow: X plus jog  
Left Arrow: X minus jog  
Up Arrow: Y minus jog  
Down Arrow: Y plus jog  
Page Up: Z plus jog  
Page Down: Z minus jog
Tab + X: Set X work coordinate to zero in active coordinate system (e.g.G54)
Tab + Y: Set Y work coordinate to zero in active coordinate system
Tab + Z: Set Z work coordinate to zero in active coordinate system
Tab + A: Set A work coordinate to zero in active coordinate system
Tab + B: Set B work coordinate to zero in active coordinate system
F1: Switch to Jog Tab  
F2: Switch to Run Tab  
F5: Reload page (browser function. Don't use it when file is running. It resets websocket connection as well as controller)  
F6: Decrease screen brightness by 10% (minimum 50%)  
F7: Increase screen brightness by 10% (maximum 100%)  
F8: Coolant On  
F9: Spindle On at 6000rpm (for testing purpose)  
F10: Coolant and Spindle Off  
1: Select first jog distance (at present 0.002 mm)  
2: Select second jog distance (at present 0.01 mm)  
3: Select third jog distance (at present 0.1 mm)  
4: Select forth jog distance (at present 1 mm)  
5: Select fifth jog distance (at present 5 mm)  
6: Select sixth jog distance (at present 25 mm)  
Esc: Jog Cancel  
Q, W, E: Feedrate overrides -10%, Reset, +10% respectively  
A, S, D: Spindle RPM overrides -10%, Reset, +10% respectively  
Z, X, C: Rapid overrides 25%, 50%, 100% respectively  
-: Jog distance decrease to one level  
+: Jog distance increase to one level  




Jog Tab Screenshot:
![Jog Tab](https://user-images.githubusercontent.com/45288223/152221602-fb87cd04-639c-4972-8a08-92cd418d9057.png)



Run Tab Screenshot:
![Run Tab](https://user-images.githubusercontent.com/45288223/152221661-baeea68e-796f-4ade-b774-9b0e367e331f.png)



Running a program from SD screenshot:
![Running a program](https://user-images.githubusercontent.com/45288223/152221683-4a36266c-6830-4358-9d16-5965295ccadf.png)
