---
title: Project AIRI Manual
authors:
  - name: MuGewRayce
    aliases:
      - MuGewRayce
    role: Lead writing team
    kind: organization
  - name: JhIcefair
    githubUsername: JhIcefair
    role: Contributing editor (primary)
    kind: person
  - name: 0xSelenicDove
    githubUsername: 0xSelenicDove
    role: Contributing editor
    kind: person
  - name: jim139129
    githubUsername: jim139129
    role: Contributing editor
    kind: person
---

This manual corresponds to AIRI 0.13.0.

::: warning Before you begin
- Some AIRI features and operations are not covered in detail in this manual.
- The Chinese edition is the source version. Other language editions are machine-translated and lightly edited manually, so their wording may differ from the app. Always refer to the app if there are discrepancies.
- This manual is based on research by its contributors and may be incomplete, inaccurate, or out of date.
- The manual focuses on the Windows desktop app and includes selected web tutorials. The versions differ in some areas, so follow the app when they conflict.
- AIRI updates may change the documented behavior. This manual describes the version current when it was written; refer to the app and current release notes for later versions.
- Some screenshots show older interfaces. Use the written instructions and current app controls when they differ.
- If you have any questions about this manual, please leave a message at @jhicefair or @0x_selenic_dove in the [Project AIRI Official Discord](https://discord.gg/TgQ3Cu2F7A) channel.
- Join the WeChat group: Open the [WeChat group description](https://github.com/moeru-ai/airi/blob/main/docs/wechat.md), scan the QR code to add the admin's WeChat, and include `AIRI` in the join request; the admin will invite you to join the group.
- Join the QQ group: Open the [QQ group invitation link](https://qun.qq.com/universal-share/share?ac=1&authKey=9g00d%2BZS7nORzcJugNNddJ7rCghZTIR7fhXabGwch2S%2BG%2BKGIKwlN1N2nIqkh2jg&busi_data=eyJncm91cENvZGUiOiIxMDU4MTU2Njk3IiwidG9rZW4iOiJmcnkra1hWNFIxNytEcG0zcHRUdVJIaldlRDFxN0dzK080QWtvTEdOQjJkNEY2eUFta1g1clNpbkxSMS9FQWFYIiwidWluIjoiMTI2MDkwNzMzNSJ9&data=b1eJrwn3GVOUh7YIxZ7l9vHQo99HPmRxKPpMKlDCmfzx8Y57IXb2EZCMaOC9rVTd2U558qpNjwUYUWlPHxVHvg&svctype=4&tempid=h5_group_info), then use QQ to confirm joining; if the link is invalid, refer to the latest link in the repository README.
- For other questions about AIRI, join the community discussion on Discord, WeChat, or QQ.
- Have fun chatting with your AI companion! :)
:::

<a id="chapter-1-installation"></a>
## Chapter 1: Installation

Go to the [latest Project AIRI release](https://github.com/moeru-ai/airi/releases/latest), expand **Assets**, and download the file for your device. Open the package and follow the installation prompts. Replace `<version>` below with the value used by the current release.

| Platform | Device | File to download |
| --- | --- | --- |
| Windows | x64 or Windows 11 ARM64 | `AIRI-<version>-windows-x64-setup.exe` |
| macOS | Apple silicon (M series) | `AIRI-<version>-darwin-arm64.dmg` |
| macOS | Intel | `AIRI-<version>-darwin-x64.dmg` |
| Linux | x64 Debian systems such as Ubuntu | `AIRI-<version>-linux-amd64.deb` |
| Linux | x64 RPM systems such as Fedora, openSUSE | `AIRI-<version>-linux-x86_64.rpm` |
| Linux | x64 systems with Flatpak installed | `AIRI-<version>-linux-x64.flatpak` |
| Linux | ARM64 Debian systems such as Ubuntu | `AIRI-<version>-linux-arm64.deb` |
| Linux | ARM64 RPM systems such as Fedora, openSUSE | `AIRI-<version>-linux-aarch64.rpm` |
| Linux | ARM64 systems with Flatpak installed | `AIRI-<version>-linux-arm64.flatpak` |
| Android | Android devices, including supported HarmonyOS devices | `AIRI-<version>-android.apk` |
| iOS/iPadOS | iPhone, iPad | `AIRI-<version>-ios.ipa` |

::: info About Windows installation
The installer can install AIRI for the current user or for everyone. A current-user installation does not require administrator rights. Installing for everyone requires administrator rights and makes AIRI available to every user on the computer.
:::

::: info About iPhone and iPad installation
Only IPA files are currently provided. They must be signed and installed manually; detailed installation instructions are not yet available.

The project team plans to release a TestFlight testing link in the future.
:::

::: info About HarmonyOS
A native HarmonyOS version is not currently available. If you use HarmonyOS NEXT, use Zhuoyitong (卓易通) to install the Android version of AIRI.
:::

<a id="chapter-2-initial-configuration"></a>
## Chapter 2: Initial configuration

Before you start using AIRI, you need at least one chat provider and an available chat model. Cloud services usually require an API key or a login account; local services require starting the model service first.

Complete the initial configuration as follows:

1. Open AIRI and start the onboarding flow.
2. Select your interface language.
3. Select **Setup with your provider** to use your own provider, or **Sign in** to use AIRI's official provider. If you are unsure which provider to use, start with [AIRI Official Provider](../../config/providers/consciousness/official.md), [OpenRouter](../../config/providers/consciousness/openrouter.md), [OpenAI Compatible](../../config/providers/consciousness/openai.md), or a local [Ollama](../../config/providers/consciousness/ollama.md) instance.
4. If you use your own provider:
    1. Select the provider you would like to use and click **Next**.
    2. Enter your API key, change the Base URL if necessary, and click **Next**.
    3. If an analytics notice is shown, review it and click **Next**.
    4. Select the chat model you plan to use and click **Save and Continue**.
5. To use AIRI's official provider, see [AIRI official provider](../../config/providers/consciousness/official.md).

Congratulations! You have completed AIRI's initial configuration.

::: tip Just configure the chat first
Once the chat provider and model are successfully configured, AIRI can reply to messages. Later, you can add capabilities such as speech synthesis (TTS), speech recognition (ASR/STT), visual understanding, and art creation. You can refer to [Voice Input and Output](../../config/audio.md), [Visual Understanding](../../config/vision.md) or [Art Creation](#chapter-4-art) to learn how to configure.
:::

::: warning API Key security
API Keys, AccessKey Secrets, and other service credentials should only be saved on your device. Do not commit them to the repository, post them to an issue, take screenshots, or send them to others.
:::

<a id="chapter-3-interface-overview"></a>
## Chapter 3: AIRI interface overview

<a id="chapter-3-main-window"></a>
### Main window

This section focuses on the desktop app. It also applies to many parts of the web and mobile apps; their unique features are introduced [here](#chapter-3-main-web).

This window displays the virtual character. It has five primary controls:

- **Expand** - Located in the lower right corner; click it to show more controls.
- **Open Chat** - Opens the chat window.
- **Open microphone** - Enables voice input so you can speak to AIRI.
- **Mute** - Not covered here; its behavior has not yet been tested by the manual's editors.
- **Drag to move window** - Hold the left mouse button and drag to move the main window.

Click **Expand** to access the following controls. Availability depends on your sign-in state:

- **Sign in** — sign in to your AIRI account.
- **Notifications** — shown only after signing in.
- **Open settings** — open AIRI's settings interface.
- **Switch character** — switch character cards.
- **Refresh** — refresh the main window.
- **Move to screen center** — moves the window to the center of the screen.
- **Theme** — switch between light, dark, and system themes.
- "Pin on top"/"Unpin from top" - control whether the AIRI window stays above other windows.
- "Auto hide"/"Always show" - control whether the AIRI window gets out of the way when you move the pointer over it.
- **Open hearing Controls** — open the voice-input controls.
- **Close** — close AIRI with one click.

::: info Hearing control
First enable microphone input and select the microphone; if prompted for permission, allow AIRI to use the microphone. After configuring the transcription service, speech can be transcribed and sent to the current chat session. AIRI pauses input while speaking to reduce feedback.

The editors have not retested this panel in the current version; its behavior may have changed. This description is retained for reference.
:::

![Expanded AIRI main-window control menu](/zh-Hans/docs/manual/tamagotchi/setup-and-use/image-17.avif)

<a id="chapter-3-system-tray"></a>
### Other system tray options

Find the AIRI icon in the Windows taskbar or macOS menu bar.

::: tip If you can't find the taskbar/menu bar icon...
On Windows, you may need to click "Show hidden icons (⌃)" on the taskbar to expand it to find the AIRI icon.

On a MacBook with a display notch, the AIRI icon may not fit in the visible menu bar. Open **System Settings → Menu Bar** and hide another menu bar item to make room.
:::

Right-click the AIRI icon to open the tray menu. The available entries depend on the current platform and app state:

- **Show** — show the main window.
- **Adjust sizes** — resize and center the main window. It contains four options:
  - **Recommended (450x600)** — Set to the recommended size of 450x600.
  - **Full Height** — Make the height of the main window fill the height of the desktop.
  - **Half Height** — Make the height of the main window half the height of the desktop.
  - **Full Screen** — Make the main window fill the entire desktop.
- **Align to** — align the main window to a specific desktop position. It contains five options:
  - **Center** — Align to the middle of the desktop.
  - **Top Left** — Align to the upper-left corner of the desktop.
  - **Top Right** — Align to the upper-right corner of the desktop.
  - **Bottom Left** — Align to the lower-left corner of the desktop.
  - **Bottom Right** — Align to the lower-right corner of the desktop.
- **Settings...** — open the settings interface.
- **About...** — open the About window to view the version, visit the project homepage, update AIRI, or select the update channel.
- **Open quick actions** — open the floating Spotlight input. Enter a short request and press Enter; the window hides and the result appears in a notification. Press Esc to cancel.
- **Open Widgets...** — open the widget window. Widgets supplied by maps, weather, art, or extensions appear here; the window may be empty when no corresponding tool or extension is running.
- **Open Caption...** / **Close Caption...** — open or close captions. When TTS is enabled, captions display AIRI's spoken text and are hidden by default while the pointer hovers over them.
- **Caption Overlay** — contains two options:
  - **Follow window** — This mode is selected by default. The caption window then moves with the main window; if unchecked, its position is independent.
  - **Reset position** — Reset the caption position.
- **Quit** — Close AIRI.



<a id="chapter-3-settings-overview"></a>
### Settings

::: info Scope of this section
This part only introduces what is in the interface. See [Chapter 5](#chapter-4-settings) for specific functions.
:::

You can open the settings interface in the following two ways:

- Click **Expand** in the main window and select **Open settings**.
- Right-click the AIRI icon in the system tray and select **Settings...**.

Use the search box at the top of the settings page to find a setting.

The settings navigation includes:

- **AIRI Card** - Select and configure the active character.
- **Modules** - Configure AIRI features such as Consciousness, Speech, Hearing, Vision, and integrations.
- **Scenes** - Configure the active character's background.
- **Models** - Select, import, and configure the character display model.
- **Memory** - View memory settings as they become available.
- **Providers** - Configure Chat, Vision, Speech, Transcription, and Artistry providers.
- **Data** - Export, reset, or remove locally stored AIRI data.
- **Connection** - Configure the AIRI WebSocket server and remote access.
- **System** - Contains **General**, **Color Scheme**, **Window Shortcuts**, **Developer**, and **Experimental Features** pages. Window Shortcuts configures Spotlight and push-to-talk shortcuts. See [Desktop Developer Tools](/en/docs/contributing/desktop-developer-tools) for the developer-only pages.

![AIRI settings overview](./assets/manual-settings-window.avif)

<a id="chapter-3-chat-window"></a>
### Chat window

Click **Open Chat** in the main window to open the chat window.

See [Chapter 4: Chatting](#chapter-s-chatstart) for the chat controls and window styles.

![AIRI chat window](./assets/manual-chat-window.avif)

Here you can chat with AIRI. After speech synthesis is enabled, **Stop speaking** appears while AIRI is reading a reply; clicking it stops the current speech playback without cancelling the generated text reply.

To open the conversation list, click the second button at the top showing the character's name in floating mode, or the character-name button in the upper-left corner in classic mode. Conversations are ordered by their most recent update and show a preview and synchronization status. You can switch or delete conversations, or create a new conversation for the current character. Deletion is usually unrecoverable, so confirm that you no longer need the content.

::: warning Check the active character
When AIRI starts, the active card may switch back to the default or first card. Check and select the intended character before chatting.

Conversations are tied to character cards. Switching characters also switches to a conversation associated with that character.
:::

<a id="chapter-s-chatstart"></a>

## Chapter 4: Chatting

You can chat using text or voice. Configure a chat provider and model first. Voice conversations also require speech synthesis (TTS) and speech recognition (STT); see [Voice Input and Output](../../config/audio.md).

### Text chat

The chat window has two styles: **Floating** (the default) and **Classic window**.

#### Floating

The chat area floats on the screen with a transparent background. Messages appear in the center, with the input box below them.

The controls at the top let you:

- collapse the chat window;
- select or manage conversations;
- mute speech output;
- enable the scrolling-message display, which also reveals an option to automatically hide read messages;
- keep the window on top;
- switch between classic and floating styles. Floating mode also offers **Snap beside character** to follow the character window.

Below the input box are four controls:

- **Add image** — attach an image after configuring the Vision module.
- **Allow this chat window to view and operate local apps** — control access to local applications.
- **Voice message** — hover to access voice-message and speech-to-text modes, microphone selection, automatic sending after recording, continuous listening, and more Hearing settings.
- **Send** — send the message; hover to configure the send-key behavior.

#### Classic window

Classic mode opens an opaque chat window. The message area and input controls work as in floating mode. The top area provides conversation management, speech muting, and the window-style selector.

#### Start chatting

Type a message and send it to interact with the character. You can also attach images if the Vision module is configured.

Hover over a message and click the three-dot menu beside it to **Reply**, **Copy**, or **Delete** it.

::: warning Deleting a message
Delete removes only the selected message, leaving neighboring messages in place. Deleted messages cannot be restored.
:::

### Voice chat

The editors have not tested voice chat extensively, and its behavior may change substantially, so this manual does not yet provide a detailed walkthrough.

<a id="chapter-4-settings"></a>

## Chapter 5: Settings

You can open the settings interface in the following two ways:

- Click **Expand** in the main window and select **Open settings**.
- Right-click the AIRI icon in the system tray and select **Settings...**.

<a id="chapter-4-airi-card"></a>
### AIRI Card

Here you can import, create, edit, and activate character cards.

![AIRI character card settings](./assets/manual-airi-card.avif)

::: info About import and export
Character cards can be imported or exported as AIRI character card packs. Card packs use Character Card V3 data and may include a Live2D, Spine, Tachie, or VRM display model. During import, AIRI validates the package manifest and character-card data; packages with an invalid format or missing required files cannot be imported. AIRI Card packs use an explicit field whitelist and are not lossless CCv3 backups; see the [Character Card Template](../character-card-template.md) for details.
:::

To create a character card:

1. Fill in the name, nickname, display model, and version.
2. Complete the identity details, including the character description and creator notes.
3. Add behavior details such as personality, scenario, and greetings.
4. Configure the character's preferred capabilities under **Modules**, if needed.
5. Configure image-generation preferences under **Artistry**, if needed.
6. Review **Settings**, including the system prompt and post-history instructions.
7. Click **Save changes** or **Save and activate**. The latter also activates the card immediately.
8. If you only saved the card, open it and click **Activate** before chatting.
9. Use **Card editor** to make further changes or **Export** to export the card.

The most important identity fields are the character's name and description:

- The name is the character's formal name. If a nickname is set, it takes precedence for display.
- The description tells the model who the character is. Use the default character card as a reference when you need an example.

::: info Editor's notes
- When using the default character card as a writing reference, you may omit its later instructions about `ACT` tokens. Keep equivalent instructions if you want the model to control those stage emotions and actions.
- Creator notes are only notes for character cards and will not affect the AIRI response results.
- Behavior defines personality, scenario, and greetings. Modules can specify chat, Vision, Speech, and display-model preferences. Artistry stores image-generation preferences. Settings contains the system prompt, post-history instructions, and card version.
:::

::: tip Saving and activating
**Save and activate** makes the card active immediately. If you use **Save changes**, activate the card separately before starting a conversation with it.
:::

<a id="chapter-4-modules"></a>
### Modules

Configure AIRI's active capabilities here.

![AIRI module settings](./assets/manual-modules.avif)

#### Consciousness

Open **Settings → Modules → Consciousness** to select the active chat provider and model. See [Chat Model](../../config/llm.md) for the complete provider-to-model flow.
![AIRI Consciousness settings](./assets/manual-consciousness.avif)

#### Speech
Open **Settings → Modules → Speech** to select the active speech provider, model, and voice. See [Voice Input and Output](../../config/audio.md) for configuration. If you do not want AIRI to speak, select **None**.
::: tip Supplementary instructions for the Speech page
- Select the provider and model first, then select a supported voice. Different providers expose different fields.
- Pitch only affects providers and models that support this parameter.
:::

![AIRI Speech settings](./assets/manual-speech.avif)

#### Hearing
Open **Settings → Modules → Hearing**. This page has five areas: **Speech recognition**, **Wake words**, **Voiceprint**, **Microphone**, and **Transcription text**.

##### Speech recognition

Select the transcription provider and model. See [Voice Input and Output](../../config/audio.md) for configuration. If you are not using voice input yet, select **None**.

::: info Speech recognition (ASR/STT)

Speech-to-text (STT), also called automatic speech recognition (ASR), converts spoken audio into text.
:::

::: info Using voice input on macOS
The first time you use voice input on macOS, allow AIRI to access the microphone when prompted.
![macOS permission prompt](image-7.png)
:::

To test the microphone and speech recognition:

1. Click **Start Monitoring**.
2. Check the recognition results below.
3. Adjust **Sensitivity** if necessary.

##### Wake words

View the character's wake words here. The editors have not yet tested this area, so detailed instructions are not included.

##### Voiceprint

This area can capture a voiceprint so AIRI can recognize you by your voice. The editors have not yet tested the complete flow.

::: info Voiceprint storage
A voiceprint is a set of numbers calculated from your speech. It does not contain audio, but it can identify you.

AIRI stores it only on this device. It is not included in character-card exports or uploaded by AIRI. To remove it, use **Delete voiceprint** on this page or **Delete all data** in Data settings.
:::

##### Microphone and transcription text

These areas configure the microphone and transcription-text behavior. The editors have not yet tested them in detail. The chat window also provides voice-input controls described in [Chapter 4](#chapter-s-chatstart).

![AIRI Hearing settings (older interface)](./assets/manual-hearing.avif)

#### Vision
Open **Settings → Modules → Vision** to select the active vision provider and image-capable model and to set **Capture interval**. See [Visual Understanding](../../config/vision.md) for the complete flow.

![AIRI Vision settings](./assets/manual-vision.avif)

::: warning Before using screen vision, you need to start Vision Capture
When configuring only the vision service provider and model, there is no need to enable this tool.

To have AIRI analyze your screen or window, open **System → Developer → Vision Capture**, grant screen-recording permission, select a window or display, and click **Start ticker**. To send the results to the current character, enable **Publish to character**.

Vision Capture is the current desktop debugging/development workflow; leaving the page will stop the capture loop. For complete instructions, see [Desktop Developer Tools](/en/docs/contributing/desktop-developer-tools#vision-capture).
:::

#### Stickers

Configure whether AIRI may use stickers and edit your own sticker collection. The editors have not yet tested this area, so detailed instructions are not included.

<a id="chapter-4-art"></a>
#### Artistry (artistic creation)

Here you can configure AIRI's ability to create art.

Open **Settings → Providers → Artistry** to configure an image provider, then enable it under **Settings → Modules → Artistry**.

::: warning Tool calling for interactive Artistry
In the ordinary interactive Artistry flow, AIRI makes the configured image tool available to the current **chat model**, which calls the tool to submit the generation task. This flow requires a provider and model that support **Tool Calling / Function Calling**.

Under **Settings → Modules → Consciousness**, select a model that the provider explicitly marks as supporting tool calling. Models limited to ordinary text conversations may respond with text without submitting a task to the selected image service.

After configuration, ask the character to generate a simple image. Confirm that AIRI initiates a tool call; if the provider offers task status, history, or a console, you can also confirm that it received the task. After the task returns an image, AIRI displays the result. See the corresponding page under **Settings → Providers → Artistry** for provider-specific verification.

The character-card option **Cinematic Autonomy (Autonomous Artist)** uses a separate text-analysis flow and invokes the selected image provider directly, so that mode does not require LLM tool calling.
:::

#### Short-term memory

This feature is under development. If you have ideas for its implementation, submit an issue or pull request.

#### Long-term memory

Enable or disable long-term memory and configure or manage recipes and memories here.

::: info Editor's notes
The Chinese edition's lead editor did not observe memory being triggered during initial testing; a developer suggested that the threshold might be too high. This module may change substantially or be renamed, and it should not be assumed to be the planned full memory system. Detailed instructions are deferred; consult the release notes when exploring it.
:::

#### Tool cards

Configure card templates that the chat model uses for tools without their own widgets. Detailed instructions are not yet included.

#### Discord

Discord integration requires running the bot service from source to allow AIRI to enter the Discord server's messaging and voice channels.

Follow the [Discord Bot Integration Guide](/en/docs/integrations/discord) to create the application, enable the required Intents, configure the Bot Token and local service credentials, and start the service. The guide contains the service's configuration and connection requirements; configuring the AIRI page alone does not start the separate bot process.

::: warning Credential security
The Bot Token, AIRI Auth Token, and optional transcription credentials should only be saved in local configuration. Do not submit, screenshot, or send these values.
:::

#### X / Twitter

See the [X / Twitter Integration Guide](/en/docs/integrations/x) for availability, implementation limitations, and configuration requirements before entering X Developer Platform credentials. Keep API keys, API secrets, and access tokens private.

#### Web search

Open **Settings → Modules → Web Search**, then follow the [Web Search Configuration Guide](../../config/web-search.md) to configure a Tavily or DeepSeek API key and learn about usage, privacy tips, and FAQs.

#### Minecraft

Minecraft integration requires running a local agent service from source. Follow the [Minecraft Agent Integration Guide](/en/docs/integrations/minecraft) to configure the trusted server, AIRI, and model services, and then start the agent.

::: warning Security reminder
Do not connect Minecraft agents to untrusted public servers. It drives local Minecraft sessions and network connections, and malicious servers can cause unexpected behavior.
:::

::: tip Integration Service Documentation
Instructions for running integration services from source are in the **Integration Services** section of the documentation sidebar.
:::

#### Factorio

Open **Settings → Modules → Factorio**, then follow the [Factorio Integration Guide](/en/docs/integrations/factorio) to enter the trusted server address, port, and in-game username. AIRI does not include a ready-to-deploy Factorio server-side integration.

#### Home Assistant

Configure AIRI's access to devices through Home Assistant here. Detailed instructions are not yet included.

#### MCP Server

MCP (Model Context Protocol) allows AIRI to use external tools through local processes. On desktop, open the MCP integration page and add a server with its command, arguments, and environment variables. Test the connection, then click **Apply and restart** to start or restart MCP. You can also open the configuration file or use the JSON editor to maintain multiple entries. Only run MCP servers that you trust: they can execute commands locally and access environment variables that you grant.

#### Beat Sync

Open **Settings → Modules → Beat Sync**. Beat Sync analyzes audio from a selected screen or window and sends beat signals to the stage effects. Click **Start screen capture** and select the source containing audio; use **Stop** to end capture. The page provides sensitivity, minimum beat interval, advanced filtering parameters, and real-time spectrum and beat visualizations. First use may require system screen-recording permission.

<a id="chapter-4-stage"></a>
### Scenes

Scenes are backgrounds for AIRI's main interface.

The **Scene Gallery** shows the backgrounds currently available to AIRI. Hover over an inactive scene and click its check button to make it the active character background.

Click **Upload to Gallery** to import an image.

To remove the active background, click **Clear Default**.

<a id="chapter-4-character-model"></a>
### Models

Here you can select and set up your character's model.

![AIRI character model settings](./assets/manual-models.avif)

AIRI supports Live2D, Spine 2D, VRM 3D, MMD, and Tachie models.

If you just want to switch an existing model, we recommend the following steps:

1. Click **Select model** to open the **Model Selector**.
2. Select the model you want to use. The version described here includes two Live2D models and two VRM models by default.
3. Click **Confirm** to complete the switch.

To import your own model, open **Model Selector** and use **Import**. The selector accepts:

- Live2D: `.zip`
- VRM: `.vrm`
- Spine: `.zip`
- MMD: `.zip`, `.pmx`, or `.pmd`
- Tachie: `.tachie.zip`

::: info Godot Stage (Experimental)
**Switch to Godot Stage (Experimental)** starts the separate Godot stage renderer; click **Back to Built-in Stage** to switch back. Godot Stage currently supports only VRM models. With a VRM model selected, you can adjust camera X/Y/Z, yaw, pitch, and field of view in Godot View. Status and model-loading errors also appear there.
:::

::: warning Before importing a model
- Older Live2D formats are not supported. The model package must include a `.moc3` file.
- Compress the complete Live2D model folder as a `.zip` file before importing it.
- Spine models also use `.zip`; VRM uses a single `.vrm` file.
:::

#### If you select a Live2D model

You can continue to adjust in the following order:

1. Expand **Scale and Position** to adjust the model's size and position. X controls horizontal position and Y controls vertical position.
2. Expand **Animation** to select the motion driver (**Generic** or **MAGIC**) and configure mouse tracking, idle eye movements, blinking and its mode, and idle animations.
3. With **MAGIC**, you can select the built-in **Idle / Calm** or **Talking / Excited** profile, ignore generated mouth opening, and force the gaze forward. The driver is intended for a half-body view: a full-body model may visibly sway up and down. This is expected behavior; use a half-body view for better results.
4. Expand **Model parameters** to adjust render scale, frame rate, shadows, and model-specific parameters, restore defaults, or clear the model cache.
5. To use an idle animation, ensure that the imported package includes animation files.
6. Expand **Expressions** and enable **Expression System** to use expressions included with the model.

When speech synthesis is enabled, AIRI automatically restores Live2D's mouth state after speech playback.

::: info Parameters and expressions
The parameters, standby animations and expressions available to the model are determined by the model file itself. After the Expression System is enabled, only the expressions actually provided by the model will be displayed; if there are no expressions or animation files, the corresponding options will have no effect.
:::

#### If you select the Spine 2D model

The Spine model provides a separate settings panel. You can adjust scaling, X/Y position, skins, variants, idle animations, animation blend time and playback speed, as well as limit frame rate and adjust render scale. If the model contains available skins, variants, or animations, they will appear in the corresponding drop-down options; missing assets will not be displayed.

#### If you select a VRM 3D model

Expand **Scene** to adjust model position, viewing angle, camera distance, Y-axis rotation, and gaze direction.

::: info VRM perspective
Position, rotation, camera distance and gaze direction in the built-in stage are saved to the current settings.
:::

<a id="chapter-4-memory-bank"></a>
### Memory

This feature is not available yet. If you have ideas for its implementation, submit an issue or pull request.

<a id="chapter-4-providers"></a>
### Providers

**Providers** is where AIRI connects to model, voice, transcription, and image services. Enter provider credentials here, then select the provider and model on the corresponding module page.

You can choose categories by purpose:

- **Chat**: Configure a chat model so AIRI can reply to messages. At least one working Chat provider is required.
- **Vision**: Configure a vision model for image understanding; then select it under **Modules → Vision**.
- **Speech**: Configure text-to-speech; then select the provider, model, and voice under **Modules → Speech**.
- **Transcription**: Configure speech-to-text; then select the provider and model under **Modules → Hearing**.
- **Artistry**: Configure an image-generation service; then select it under **Modules → Artistry**.

If you skip onboarding, configure a chat provider first: enter its API key or account details and any required advanced fields, such as Base URL or region. Wait for automatic validation and use **Ping API** when it is available. Then open **Modules → Consciousness**, select the provider and model, and send a message.

After switching chat providers, the selected chat model is cleared. Return to **Modules → Consciousness** to select a model for the new provider.

::: warning Credential security
Save API Keys, AccessKey Secrets, and other service credentials only in settings on your device. Do not commit them to the repository, post them in an issue, include them in screenshots, or send them to anyone.
:::

::: tip Configuration guide
- If you are unsure about provider fields, validation methods, or errors, read [Common Configuration Instructions](../../config/common.md).
- To configure the chat model, read [Chat Model](../../config/llm.md) and choose a provider under **Settings → Providers → Chat**.
- To configure voice input and output, read [Voice Input and Output](../../config/audio.md). Speech and Transcription providers are under **Settings → Providers** and are enabled from their corresponding module pages.
- Vision requires a model that supports image input. Use the corresponding provider's credentials and see [Visual Understanding](../../config/vision.md) for configuration details.
:::

![AIRI service provider settings](./assets/manual-providers.avif)

::: tip Technical advice
The provider list depends on the installed AIRI version. If an unlisted provider implements an OpenAI-compatible interface, use the corresponding **OpenAI Compatible** entry and enter the exact Base URL and model ID from that provider's documentation.
:::

<a id="chapter-4-data"></a>
### Data

Manage AIRI's locally stored data here.

::: warning Unrecoverable operation
Deletion and reset operations in this section cannot be undone. Confirm the selected data before continuing.
:::

![AIRI Data settings](./assets/manual-data-settings.avif)

::: tip Desktop-only data controls
**Open application data folder** and **Reset desktop settings and state** are available only in the desktop app. They are not available in the web or mobile apps; the other data controls depend on the current platform.
:::

<a id="chapter-4-connection"></a>
### Connection

**Connection** configures AIRI's service channel. Set the **WebSocket Server Address** and turn on **Enable Secure WebSocket (WSS)** when encrypted transport is required. On desktop, choose access from this device only or from the local network; the advanced hostname option is currently unavailable. You can also set an **Auth Token** and use the QR code to connect another device. Expose AIRI only on trusted networks and keep the token private.

![AIRI Connection settings](./assets/manual-websocket-settings.avif)

::: tip macOS may require administrator verification
When secure WebSockets are enabled, AIRI adds the local certificate to the macOS login keychain. You may be asked to authorize this action using Touch ID or entering your Mac login password. Verify your fingerprint or Mac login password to continue.
![macOS administrator verification](image-16.png)
:::


<a id="chapter-4-system"></a>
### System

#### General

Configure AIRI's theme, language, and general behavior here.

![AIRI System general settings](./assets/manual-system-general.avif)

- **Theme** switches between light, dark, and system themes.
- **Language** sets the interface language; the selection is retained after restarting AIRI.
- **Controls Island Icon Size** changes the desktop control-island icon size.
- **Streamer mode** hides microphone and sign-in hints in the character window.
- **Enable usage analytics** controls anonymous usage analytics when analytics are available in the current build. The description links to the privacy policy.
- **Hide taskbar / Dock icon** keeps only the tray or menu-bar icon. Use that icon to open windows or quit AIRI. Changes take effect immediately.

#### Color scheme

Configure AIRI's theme colors here.

![AIRI color scheme settings](./assets/manual-system-color-scheme.avif)

- Turn on **RGB** to cycle through theme colors automatically.
- Drag the marker below the color bar or click the bar to choose a color.
- Review the selected color in the preview.
- Click a preset swatch to apply it directly.

::: tip Color presets
Click a color swatch to apply its preset.
:::

#### Window Shortcuts
Here you can modify the **Spotlight** and **Push to talk** global shortcuts. Spotlight is the floating prompt input opened by **Open quick actions**.

1. Click the current shortcut key.
2. Press the new key combination you want to use; it must contain at least one modifier key: Cmd, Ctrl, Alt, or Super.
3. If another application already uses the shortcut, AIRI reports a conflict. Press Esc to cancel recording.
4. Click **Reset** to restore the default shortcut.

::: tip Use Spotlight
Press the configured shortcut to open Spotlight. Enter a request and press Enter; AIRI hides Spotlight and displays the result in a notification. Press Esc to close it without sending.
:::

#### Developer

This page is used to develop, troubleshoot, and verify experimental features; regular users do not need it. Complete tool descriptions are available in [Developer Guide → Developer Tools](/en/docs/contributing/desktop-developer-tools).

#### Experimental Features

Enable or disable experimental features such as character-card cloud sync, model cloud sync, and the fullscreen workspace here.

::: warning Cloud features
Cloud features are currently unavailable. Local features are unaffected.
:::

<a id="web-features"></a>
## Web-version features

<a id="chapter-3-main-web"></a>
### Web main interface

![AIRI web interface](./assets/manual-main-web.avif)

The web interface contains the character stage, chat area, and account and display controls.

#### Chat box

The upper area displays chat history. The lower area contains the message input, with controls to attach an image, record a voice message, choose how messages are sent, and send the message.

#### Other parts

##### Upper area

The upper area provides access to character cards and the account/settings menu. The account menu includes notifications, account information, **Profile**, **Flux**, **Capacitor**, **Settings**, and **Sign out**. This manual does not yet describe every entry in detail.

The top of the chat area also provides **New conversation** and **Mute speech** controls.

###### Profile

**Profile** opens account management. Depending on how the account was created, you can update the display name, manage the password and connected sign-in methods, or delete the account from the danger zone. The current avatar is displayed as account information, but this page does not provide avatar upload.

###### Flux

Flux is the balance used by AIRI's official services. After you sign in, open **Flux** to view your balance, usage statistics, and transaction history. If the current deployment supports purchases, you can select an available package. The Desktop ver. opens checkout in the system browser. Requests to official chat, vision, or speech services can consume Flux. Third-party providers bill usage separately.

###### Settings

**Settings** opens the same configuration areas described in [Chapter 5](#chapter-4-settings), although desktop-only controls are not available on the web.

##### Lower area

The lower area provides five controls. Labels may differ slightly in the app:

- **View** — adjust character position and size;
- **Background** — change the stage background;
- **Send key** — configure how to send messages;
- **Theme** — switch between light and dark themes;
- **About** — open information about AIRI.

###### Position and size

Open the position-and-size control to adjust the character's X position, Y position, and scale. The vertical control on the left side of the stage provides another way to adjust the view.

![Adjusting the main window position and size](./assets/web-position-size.avif)

###### Send key

Choose the key behavior used to send text from the input box.

###### Switch between light and dark

Select the sun or moon button to switch between the light and dark themes.

###### Background

Select the background button to choose a different stage background.

<a id="features-issues"></a>
## Troubleshooting and shortcuts

### FAQ

- After an upgrade, a model may appear to be missing if its saved size or position places it outside the visible area. Reset the model's scale and position under **Settings → Models**.
- On startup, AIRI may select the default or first character card. Check and switch to the intended card before chatting.

<a id="h3-1-1"></a>
### Connection status shortcut

On surfaces that display **WebSocket Status** in the upper-right area, click it to open **Connection** and configure the **WebSocket Server Address**.


<a id="chapter-ed-toeveryeditor"></a>
## Contributing to this manual

This community-maintained manual is published with the official AIRI documentation. Contributions that improve its accuracy, wording, screenshots, or formatting are welcome. Submit a pull request and add yourself to the author list when your contribution is substantial.

Thank you for helping improve AIRI's documentation.

——Ling Zhen

::: info Editing chapter links
The Chatting chapter was inserted as Chapter 4, moving Settings to Chapter 5. Existing Settings anchors retain their `chapter-4-` names so earlier links continue to work. Keep those anchors when editing the manual.
:::
