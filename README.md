# Omnivision · 360° Catch

[Play on GitHub Pages](https://frazer.github.io/VR360Vision/)

A browser-based experiment that compresses all 360° around a stationary player into a single panorama. Catch approaching balls among trees and four simple walking robots.

## Play

1. Choose a vision mapping, difficulty, and untimed practice or a 60-second challenge.
2. Start the session.
3. Click or tap a ball when its catch ring lights up (within 1.5 metres of the viewpoint). Each catch scores 10 points. Missed balls reset the streak.

The centre is ahead, the sides are left/right, and the outer edges meet behind you. Most balls pass 0.5–1.3 metres beside you; others approach more directly. Ball height also varies. Trees and robots provide direction and motion cues.

Vision mappings: uniform 360°, forward-preserving (more screen space for the front), and expanded rear vision (more screen space for the back). Sound is optional. Pause freezes gameplay; changing difficulty or session type requires a new session.

## Meta Quest / WebXR

Open the live HTTPS URL in Meta Quest Browser and press **Open in XR**. Allow the browser's immersive-session prompt, aim a controller at the panoramic display, and pull the trigger to catch. The display includes Restart, Pause, Vision mode, and Exit XR controls. Select difficulty and session type before entering XR. Exiting XR pauses a running session.

XR uses the same panoramic image for both eyes on a head-relative virtual panel. It is not a stereoscopic 3D world or physical hand-catching. Hardware validation on an actual Quest is still needed; desktop and simulation checks cannot establish headset compatibility or comfort.

WebXR requires a secure context and a compatible browser: [WebXR startup documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Startup_and_shutdown).

## Run locally

No build step, external libraries, or downloaded assets. Open `index.html` for desktop play, or serve this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8765`. For a headset, use the live HTTPS site; another device's plain HTTP LAN address does not provide a secure WebXR context.

Run simulation checks with Node.js:

```sh
node test.cjs
```

These cover vision mappings, catches and reach limits, the rear seam, score/streak/misses, pause, passing trajectories, session timing, scenery animation, canvas draw calls, and controller-to-panel projection. They use a mocked canvas and XR poses; they do not replace browser or hardware testing.

## Deployment

GitHub Pages serves `index.html` directly from the root of `main`. `.nojekyll` disables Jekyll processing. No analytics or application data storage is included.

## Provenance

Reconstructed from the recorded requirements in the “VR Vision Experiment” conversation. The original `/mnt/data/omnivision_ball_catch.html` attachment was unavailable in this workspace, so this is a fresh implementation of the described experience rather than an edit of the original source.
