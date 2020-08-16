const Controller = require("./dist/Controller").default;

module.exports = function (RED) {
  function neopixelAnimation(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const controller = new Controller(node, config);

    node.on("input", controller.handleInput);
  }

  RED.nodes.registerType("neopixel-display", neopixelAnimation);
};
