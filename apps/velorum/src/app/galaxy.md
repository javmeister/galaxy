# Map/Game Behavior

## No matter what

- Data loading, game does not go into any of the scenes until galaxy data is fully loaded

## Goes to landing (new no intro completed)

- Should show the loading screen while data is being loaded and scenes are being initialized
- Wait for input to switch to Galaxy Scene

- The input event is what triggers the beginning of the intro

- Switch to Galaxy Scene
- In galaxy scene, start the intro sequence

## Goes to landing (intro completed)

- Should show the loading screen while data is being loaded and scenes are being initialized
- Autodismiss loading screen

- Switch to Galaxy Scene
- In galaxy scene, show everything

## Goes to sector view (no intro)

- Should show the loading screen while data is being loaded and scenes are being initialized
- Autodismiss loading screen

- Switch to Sector Scene

## Goes to solar system details (no intro)

- Should show the loading screen while data is being loaded and scenes are being initialized
- Autodismiss loading screen

- Switch to Sector Scene + Details (with route)

