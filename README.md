# Fellowsnip

![GitHub all releases](https://img.shields.io/github/downloads/fellowsguide/fellowship-recorder/total)
![Version](https://img.shields.io/github/package-json/v/fellowsguide/fellowship-recorder?filename=release%2Fapp%2Fpackage.json)
[![](https://dcbadge.limes.pink/api/server/SfqzdHrht2)](https://discord.gg/SfqzdHrht2)

Fellowsnip is a desktop screen recorder. It watches the Fellowship combat log
file for interesting events, records them, and presents a user interface in
which the recordings can be viewed.

![](https://kobefjwggjgeiaojcccf.supabase.co/storage/v1/object/public/fellowsnip/fellowsnip_preview.png)

# How to Use

1. Download and run the most recent
   [Fellowsnip installer](https://github.com/fellowsguide/fellowship-recorder/releases/latest).
2. Launch the application and click the Settings button.
   - Create a folder on your PC to store the recordings.
   - Set the Storage Path to the folder you just created.
   - Enable recording and set the location of your Fellowship logs folder.
   - Modify any other settings as desired.
3. Click the Scene button and configure the Scene and Recording settings.
   - Select your desired output resolution.
   - Add your speakers and/or microphone if you want to include audio.
   - Recommend selecting a hardware encoder, if available.
   - Modify any other settings as desired.
4. Enable advance combat logging in Fellowship.
   - Open the settings menu in Fellowship.
   - Scroll down and find the "Advanced Combat Logging" option.
   - Enable it.

# Supported Platforms

| OS      | Support |
| ------- | ------- |
| Windows | Yes     |
| Mac     | No      |
| Linux   | No      |

| Flavour | Support |
| ------- | ------- |
| Retail  | Yes     |

# Testing It Works

You can test that Fellowsnip works by clicking the test icon with Fellowship
running after you have completed the above setup steps. This runs a short test
of the recording function. (NYI)

# Bug Reports & Suggestions

Please create an issue, I will get to it eventually. Bear in mind maintaining
this is a hobby for me, so it may take me some time to comment. If you think you
can improve something, feel free to submit a PR.

I've created a dedicated discord for this project, feel free to join
[here](https://discord.gg/SfqzdHrht2).

# Contributing

If you're interested in getting involved please drop me a message on discord and
I can give you access to our development channel. Also see
[contributing](https://github.com/fellowsguide/fellowship-recorder/blob/main/docs/CONTRIBUTING.md)
docs.

# Mentions

The recording done by Fellowsnip is made possible by packaging up
[OBS](https://obsproject.com/). We wouldn't stand a chance at providing
something useful without it. Big thanks to the OBS developers.

The app is built with [Electron](https://www.electronjs.org/) and
[React](https://react.dev/), using the boilerplate provided by the
[ERB](https://electron-react-boilerplate.js.org/) project.

Drawing overlay created using
[Excalidraw](https://github.com/excalidraw/excalidraw).

# Most importantly, thanks to [Aza](https://github.com/aza547) for developing Warcraft Recorder! Go show him some love when you get a chance.
