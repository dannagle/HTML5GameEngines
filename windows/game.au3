; AutoIt Script
If FileExists("nw.exe") Then
    Run ("nw.exe")
Else
    MsgBox(4096, "Error", "Could not find nw.exe!")
EndIf



