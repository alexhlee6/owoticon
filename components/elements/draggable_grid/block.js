"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var React = require("react");
var react_native_1 = require("react-native");
exports.Block = function (_a) {
    var style = _a.style, dragStartAnimationStyle = _a.dragStartAnimationStyle, onPress = _a.onPress, onLongPress = _a.onLongPress, onPressOut = _a.onPressOut, children = _a.children, panHandlers = _a.panHandlers;
    return (<react_native_1.Animated.View style={[styles.blockContainer, style, dragStartAnimationStyle]} {...panHandlers}>
      <react_native_1.Animated.View>
        <react_native_1.TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut}>
          {children}
        </react_native_1.TouchableWithoutFeedback>
      </react_native_1.Animated.View>
    </react_native_1.Animated.View>);
};
var styles = react_native_1.StyleSheet.create({
    blockContainer: {
        alignItems: 'center',
    },
});
//# sourceMappingURL=block.js.map