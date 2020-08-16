# Neopixel display and visualization node for node-red

[![Platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![NPM](https://img.shields.io/npm/v/node-red-contrib-neopixel-display?logo=npm)](https://www.npmjs.org/package/node-red-contrib-neopixel-display)
[![Known Vulnerabilities](https://snyk.io/test/npm/node-red-contrib-neopixel-display/badge.svg)](https://snyk.io/test/npm/node-red-contrib-neopixel-display)

This package provides animated visualizations for a squared neopixel matrix to be used as a display.
It is developed to be used with the [node-red-node-pi-neopixel](https://flows.nodered.org/node/node-red-node-pi-neopixel)
package.

# Dependencies
The package was tested on a `Raspberry Pi Zero W` and `Node-Red v1.1.3`.
- [node-red-node-pi-neopixel](https://flows.nodered.org/node/node-red-node-pi-neopixel)

# Support
If you find any bugs or want to request a feature, please [open an issue](https://github.com/dlavrenuek/node-red-contrib-neopixel-display/issues).

# Supported visualization and functionality
This library supports rectangular LED Matrices (Neopixel or WS2812), multiple Matrices can be connected in row
to increase the width of the display.

## Configuration

The `neopixel display` node consumes a message with payload and produces a message that will be handled by an
`rpi neopixel` node. The payload type depends on what visualization is used.

- [Node configuration](#node-configuration)
- [Bar chart](#bar-chart)
- [Line / Progress bar](#line--progress-bar)
- [Text](#text)

### Node configuration

A simple visualization could be configured like following:

![Example](https://github.com/dlavrenuek/node-red-contrib-neopixel-display/examples/node-basic.png "Example configuration")

The configured options for `Visualization type`, `Background color` and `Foreground color` can be overwritten in the
message. Available options are:

| Option   | Message property   | Available values   |
|---|---|---|
| Visualization type   | `visualizationType`   | `bars`, `line`, `text`  |
| Background color  | `backgroundColor`  | color *  |
| Foreground color  | `foregroundColor`  | color *  |

\* A color is represented as an array in RGB format. Example: `[255, 0, 0]` for red, `[0, 255, 0]` for green.

#### Example overwriting visualization options with a function node

```javascript
return {
    visualizationType: 'bars',
    payload: [0, 1, 2, 3, 4, 5, 6, 7],
    backgroundColor: [255, 0, 0],
    foregroundColor: [0, 255, 0],
};
```

### Bar chart

A bar chart requires an array of integer numbers as the payload. Each value of the array represents the height of
the bar at the corresponding position.

Payload type: `number[]`

Example:

```javascript
return {
    payload: [0, 1, 2, 3, 4, 5, 6, 7],
};
```

### Line / Progress bar

A progress bar will fill the display vertically and display a horizontal bar of the given length in dots.

Payload type: `number`

Example:

```javascript
return {
    payload: 6,
};
```

### Text

The text will be displayed in a single line and there are currently several limitations. Only english characters are
supported and each character takes `3` columns and `5` rows with one column between characters. A single `8x8` matrix can
display `2` characters. Connecting `3` x `8x8` panels in a row increases the maximum displayed characters to `6`.

Payload type: `string`

Additional options:
- `offset: [number, number]`: offset in x, y coordinates starting at top left corner of the display

```javascript
return {
    payload: "OK",
    offset: [1, 1],
};
```
