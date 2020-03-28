// Type definitions for react-native 0.61
// Project: https://github.com/facebook/react-native
// Definitions by: Eloy Durán <https://github.com/alloy>
//                 HuHuanming <https://github.com/huhuanming>
//                 Kyle Roach <https://github.com/iRoachie>
//                 Simon Knott <https://github.com/skn0tt>
//                 Tim Wang <https://github.com/timwangdev>
//                 Kamal Mahyuddin <https://github.com/kamal>
//                 Alex Dunne <https://github.com/alexdunne>
//                 Manuel Alabor <https://github.com/swissmanu>
//                 Michele Bombardi <https://github.com/bm-software>
//                 Alexander T. <https://github.com/a-tarasyuk>
//                 Martin van Dam <https://github.com/mvdam>
//                 Kacper Wiszczuk <https://github.com/esemesek>
//                 Ryan Nickel <https://github.com/mrnickel>
//                 Souvik Ghosh <https://github.com/souvik-ghosh>
//                 Cheng Gibson <https://github.com/nossbigg>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Francesco Moro <https://github.com/franzmoro>
//                 Wojciech Tyczynski <https://github.com/tykus160>
//                 Jake Bloom <https://github.com/jakebloom>
//                 Ceyhun Ozugur <https://github.com/ceyhun>
//                 Mike Martin <https://github.com/mcmar>
//                 Theo Henry de Villeneuve <https://github.com/theohdv>
//                 Eli White <https://github.com/TheSavior>
//                 Romain Faust <https://github.com/romain-faust>
//                 Be Birchall <https://github.com/bebebebebe>
//                 Jesse Katsumata <https://github.com/Naturalclar>
//                 Xianming Zhong <https://github.com/chinesedfan>
//                 Valentyn Tolochko <https://github.com/vtolochk>
//                 Sergey Sychev <https://github.com/SychevSP>
//                 Kelvin Chu <https://github.com/RageBill>
//                 Daiki Ihara <https://github.com/sasurau4>
//                 Abe Dolinger <https://github.com/256hz>
//                 Dominique Richard <https://github.com/doumart>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// USING: these definitions are meant to be used with the TSC compiler target set to at least ES2015.
//
// USAGE EXAMPLES: check the RNTSExplorer project at https://github.com/bgrieder/RNTSExplorer
//
// CONTRIBUTING: please open pull requests
//
// CREDITS: This work is based on an original work made by Bernd Paradies: https://github.com/bparadie
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import * as React from 'react';

type Constructor<T> = new (...args: any[]) => T;

export type MeasureOnSuccessCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

export type MeasureInWindowOnSuccessCallback = (x: number, y: number, width: number, height: number) => void;

export type MeasureLayoutOnSuccessCallback = (left: number, top: number, width: number, height: number) => void;

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
interface EventSubscription {
  eventType: string;
  key: number;
  subscriber: EventSubscriptionVendor;

  /**
   * @param subscriber the subscriber that controls
   *   this subscription.
   */
  new (subscriber: EventSubscriptionVendor): EventSubscription;

  /**
   * Removes this subscription from the subscriber that controls it.
   */
  remove(): void;
}

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */
declare class EventSubscriptionVendor {
  constructor();

  /**
   * Adds a subscription keyed by an event type.
   *
   */
  addSubscription(eventType: string, subscription: EventSubscription): EventSubscription;

  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */
  removeAllSubscriptions(eventType?: string): void;

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   */
  removeSubscription(subscription: any): void;

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   */
  getSubscriptionsForType(eventType: string): EventSubscription[];
}

/**
 * EmitterSubscription represents a subscription with listener and context data.
 */
interface EmitterSubscription extends EventSubscription {
  emitter: EventEmitter;
  listener: () => any;
  context: any;

  /**
   * @param emitter - The event emitter that registered this
   *   subscription
   * @param subscriber - The subscriber that controls
   *   this subscription
   * @param listener - Function to invoke when the specified event is
   *   emitted
   * @param context - Optional context object to use when invoking the
   *   listener
   */
  new (
    emitter: EventEmitter,
    subscriber: EventSubscriptionVendor,
    listener: () => any,
    context: any
  ): EmitterSubscription;

  /**
   * Removes this subscription from the emitter that registered it.
   * Note: we're overriding the `remove()` method of EventSubscription here
   * but deliberately not calling `super.remove()` as the responsibility
   * for removing the subscription lies with the EventEmitter.
   */
  remove(): void;
}

interface EventEmitterListener {
  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. An optional calling context may be provided. The data arguments
   * emitted will be passed to the listener function.
   *
   * @param eventType - Name of the event to listen to
   * @param listener - Function to invoke when the specified event is
   *   emitted
   * @param context - Optional context object to use when invoking the
   *   listener
   */
  addListener(eventType: string, listener: (...args: any[]) => any, context?: any): EmitterSubscription;
}

interface EventEmitter extends EventEmitterListener {
  /**
   *
   * @param subscriber - Optional subscriber instance
   *   to use. If omitted, a new subscriber will be created for the emitter.
   */
  new (subscriber?: EventSubscriptionVendor): EventEmitter;

  /**
   * Similar to addListener, except that the listener is removed after it is
   * invoked once.
   *
   * @param eventType - Name of the event to listen to
   * @param listener - Function to invoke only once when the
   *   specified event is emitted
   * @param context - Optional context object to use when invoking the
   *   listener
   */
  once(eventType: string, listener: (...args: any[]) => any, context: any): EmitterSubscription;

  /**
   * Removes all of the registered listeners, including those registered as
   * listener maps.
   *
   * @param eventType - Optional name of the event whose registered
   *   listeners to remove
   */
  removeAllListeners(eventType?: string): void;

  /**
   * Provides an API that can be called during an eventing cycle to remove the
   * last listener that was invoked. This allows a developer to provide an event
   * object that can remove the listener (or listener map) during the
   * invocation.
   *
   * If it is called when not inside of an emitting cycle it will throw.
   *
   * @throws {Error} When called not during an eventing cycle
   *
   * @example
   *   const subscription = emitter.addListenerMap({
   *     someEvent: function(data, event) {
   *       console.log(data);
   *       emitter.removeCurrentListener();
   *     }
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   *   emitter.emit('someEvent', 'def'); // does not log anything
   */
  removeCurrentListener(): void;

  /**
   * Removes a specific subscription. Called by the `remove()` method of the
   * subscription itself to ensure any necessary cleanup is performed.
   */
  removeSubscription(subscription: EmitterSubscription): void;

  /**
   * Returns an array of listeners that are currently registered for the given
   * event.
   *
   * @param eventType - Name of the event to query
   */
  listeners(eventType: string): EmitterSubscription[];

  /**
   * Emits an event of the given type with the given data. All handlers of that
   * particular type will be notified.
   *
   * @param eventType - Name of the event to emit
   * @param Arbitrary arguments to be passed to each registered listener
   *
   * @example
   *   emitter.addListener('someEvent', function(message) {
   *     console.log(message);
   *   });
   *
   *   emitter.emit('someEvent', 'abc'); // logs 'abc'
   */
  emit(eventType: string, ...params: any[]): void;

  /**
   * Removes the given listener for event of specific type.
   *
   * @param eventType - Name of the event to emit
   * @param listener - Function to invoke when the specified event is
   *   emitted
   *
   * @example
   *   emitter.removeListener('someEvent', function(message) {
   *     console.log(message);
   *   }); // removes the listener if already registered
   *
   */
  removeListener(eventType: string, listener: (...args: any[]) => any): void;
}

/** NativeMethodsMixin provides methods to access the underlying native component directly.
 * This can be useful in cases when you want to focus a view or measure its on-screen dimensions,
 * for example.
 * The methods described here are available on most of the default components provided by React Native.
 * Note, however, that they are not available on composite components that aren't directly backed by a
 * native view. This will generally include most components that you define in your own app.
 * For more information, see [Direct Manipulation](http://facebook.github.io/react-native/docs/direct-manipulation.html).
 * @see https://github.com/facebook/react-native/blob/master/Libraries/ReactIOS/NativeMethodsMixin.js
 */
export interface NativeMethodsMixinStatic {
  /**
   * Determines the location on screen, width, and height of the given view and
   * returns the values via an async callback. If successful, the callback will
   * be called with the following arguments:
   *
   *  - x
   *  - y
   *  - width
   *  - height
   *  - pageX
   *  - pageY
   *
   * Note that these measurements are not available until after the rendering
   * has been completed in native. If you need the measurements as soon as
   * possible, consider using the [`onLayout`
   * prop](docs/view.html#onlayout) instead.
   */
  measure(callback: MeasureOnSuccessCallback): void;

  /**
   * Determines the location of the given view in the window and returns the
   * values via an async callback. If the React root view is embedded in
   * another native view, this will give you the absolute coordinates. If
   * successful, the callback will be called with the following
   * arguments:
   *
   *  - x
   *  - y
   *  - width
   *  - height
   *
   * Note that these measurements are not available until after the rendering
   * has been completed in native.
   */
  measureInWindow(callback: MeasureInWindowOnSuccessCallback): void;

  /**
   * Like [`measure()`](#measure), but measures the view relative an ancestor,
   * specified as `relativeToNativeNode`. This means that the returned x, y
   * are relative to the origin x, y of the ancestor view.
   *
   * As always, to obtain a native node handle for a component, you can use
   * `React.findNodeHandle(component)`.
   */
  measureLayout(
    relativeToNativeNode: number,
    onSuccess: MeasureLayoutOnSuccessCallback,
    onFail: () => void /* currently unused */
  ): void;

  /**
   * This function sends props straight to native. They will not participate in
   * future diff process - this means that if you do not include them in the
   * next render, they will remain active (see [Direct
   * Manipulation](docs/direct-manipulation.html)).
   */
  setNativeProps(nativeProps: Object): void;

  /**
   * Requests focus for the given input or view. The exact behavior triggered
   * will depend on the platform and type of view.
   */
  focus(): void;

  /**
   * Removes focus from an input or view. This is the opposite of `focus()`.
   */
  blur(): void;

  refs: {
    [key: string]: React.Component<any, any>;
  };
}

interface CreateElementProps {
  [key: string]: mixed;
}
// see react-jsx.d.ts
export function unstable_createElement(
  type: React.ReactType,
  props?: CreateElementProps,
  ...children: React.ReactNode[]
): React.ReactElement<CreateElementProps>;

export type Runnable = (appParameters: any) => void;

type Task = (taskData: any) => Promise<void>;
type TaskProvider = () => Task;

type NodeHandle = number;

// Similar to React.SyntheticEvent except for nativeEvent
export interface NativeSyntheticEvent<T> extends React.BaseSyntheticEvent<T, NodeHandle, NodeHandle> {}

export interface NativeTouchEvent {
  /**
   * Array of all touch events that have changed since the last event
   */
  changedTouches: NativeTouchEvent[];

  /**
   * The ID of the touch
   */
  identifier: string;

  /**
   * The X position of the touch, relative to the element
   */
  locationX: number;

  /**
   * The Y position of the touch, relative to the element
   */
  locationY: number;

  /**
   * The X position of the touch, relative to the screen
   */
  pageX: number;

  /**
   * The Y position of the touch, relative to the screen
   */
  pageY: number;

  /**
   * The node id of the element receiving the touch event
   */
  target: string;

  /**
   * A time identifier for the touch, useful for velocity calculation
   */
  timestamp: number;

  /**
   * Array of all current touches on the screen
   */
  touches: NativeTouchEvent[];
}

export interface GestureResponderEvent extends NativeSyntheticEvent<NativeTouchEvent> {}

// See https://facebook.github.io/react-native/docs/scrollview.html#contentoffset
export interface PointPropType {
  x: number;
  y: number;
}

export interface Insets {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

/**
 * //FIXME: need to find documentation on which component is a TTouchable and can implement that interface
 * @see React.DOMAtributes
 */
export interface Touchable {
  autoFocus?: boolean;
  onTouchStart?: (event: GestureResponderEvent) => void;
  onTouchMove?: (event: GestureResponderEvent) => void;
  onTouchEnd?: (event: GestureResponderEvent) => void;
  onTouchCancel?: (event: GestureResponderEvent) => void;
  onTouchEndCapture?: (event: GestureResponderEvent) => void;
  // mouse
  onContextMenu?: (event: GestureResponderEvent) => void;
}

export type ComponentProvider = () => React.ComponentType<any>;

export type AppConfig = {
  appKey: string;
  component?: ComponentProvider;
  run?: Runnable;
};

// https://github.com/facebook/react-native/blob/master/Libraries/AppRegistry/AppRegistry.js
/**
 * `AppRegistry` is the JS entry point to running all React Native apps.  App
 * root components should register themselves with
 * `AppRegistry.registerComponent`, then the native system can load the bundle
 * for the app and then actually run the app when it's ready by invoking
 * `AppRegistry.runApplication`.
 *
 * To "stop" an application when a view should be destroyed, call
 * `AppRegistry.unmountApplicationComponentAtRootTag` with the tag that was
 * pass into `runApplication`. These should always be used as a pair.
 *
 * `AppRegistry` should be `require`d early in the `require` sequence to make
 * sure the JS execution environment is setup before other modules are
 * `require`d.
 */
export namespace AppRegistry {
  function registerConfig(config: AppConfig[]): void;

  function registerComponent(appKey: string, getComponentFunc: ComponentProvider): string;

  function registerRunnable(appKey: string, func: Runnable): string;

  function getAppKeys(): string[];

  function unmountApplicationComponentAtRootTag(rootTag: number): void;

  function runApplication(appKey: string, appParameters: any): void;

  function registerHeadlessTask(appKey: string, task: TaskProvider): void;

  function getRunnable(appKey: string): Runnable | undefined;

  function getApplication(
    appKey: string,
    appParams: any
  ): { element: React.ReactElement; getStyleElement: (any) => React.ReactElement };
}

export interface LayoutAnimationTypes {
  spring: string;
  linear: string;
  easeInEaseOut: string;
  easeIn: string;
  easeOut: string;
  keyboard: string;
}

export interface LayoutAnimationProperties {
  opacity: string;
  scaleXY: string;
}

export interface LayoutAnimationAnim {
  duration?: number;
  delay?: number;
  springDamping?: number;
  initialVelocity?: number;
  type?: string; //LayoutAnimationTypes
  property?: string; //LayoutAnimationProperties
}

export interface LayoutAnimationConfig {
  duration: number;
  create?: LayoutAnimationAnim;
  update?: LayoutAnimationAnim;
  delete?: LayoutAnimationAnim;
}

/** Automatically animates views to their new positions when the next layout happens.
 * A common way to use this API is to call LayoutAnimation.configureNext before
 * calling setState. */
export interface LayoutAnimationStatic {
  /** Schedules an animation to happen on the next layout.
   * @param config Specifies animation properties:
   * `duration` in milliseconds
   * `create`, config for animating in new views (see Anim type)
   * `update`, config for animating views that have been updated (see Anim type)
   * @param onAnimationDidEnd Called when the animation finished. Only supported on iOS.
   */
  configureNext: (config: LayoutAnimationConfig, onAnimationDidEnd?: () => void) => void;
  /** Helper for creating a config for configureNext. */
  create: (duration: number, type?: string, creationProp?: string) => LayoutAnimationConfig;
  Types: LayoutAnimationTypes;
  Properties: LayoutAnimationProperties;
  configChecker: (shapeTypes: { [key: string]: any }) => any;
  Presets: {
    easeInEaseOut: LayoutAnimationConfig;
    linear: LayoutAnimationConfig;
    spring: LayoutAnimationConfig;
  };
  easeInEaseOut: (onAnimationDidEnd?: () => void) => void;
  linear: (onAnimationDidEnd?: () => void) => void;
  spring: (onAnimationDidEnd?: () => void) => void;
}

type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

/**
 * Flex Prop Types
 * @see https://facebook.github.io/react-native/docs/flexbox.html#proptypes
 * @see https://facebook.github.io/react-native/docs/layout-props.html
 * @see https://github.com/facebook/react-native/blob/master/Libraries/StyleSheet/LayoutPropTypes.js
 */
export interface FlexStyle {
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';
  alignItems?: FlexAlignType;
  alignSelf?: 'auto' | FlexAlignType;
  animationKeyframes?: Array<{ [key: string]: mixed }>;
  animationDuration?: string;
  animationIterationCount?: number;
  aspectRatio?: number;
  borderBottomWidth?: number;
  borderEndWidth?: number | string;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderStartWidth?: number | string;
  borderTopWidth?: number;
  borderWidth?: number;
  bottom?: number | string;
  display?: 'none' | 'flex' | 'inline-flex' | 'block' | 'inline-block';
  end?: number | string;
  flex?: number;
  flexBasis?: number | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  height?: number | string;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  left?: number | string;
  margin?: number | string;
  marginBottom?: number | string;
  marginEnd?: number | string;
  marginHorizontal?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginStart?: number | string;
  marginTop?: number | string;
  marginVertical?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  overflow?: 'visible' | 'hidden' | 'scroll';
  outlineStyle?: string;
  padding?: number | string;
  paddingBottom?: number | string;
  paddingEnd?: number | string;
  paddingHorizontal?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingStart?: number | string;
  paddingTop?: number | string;
  paddingVertical?: number | string;
  position?: 'absolute' | 'relative' | 'static' | 'fixed' | 'sticky';
  right?: number | string;
  start?: number | string;
  top?: number | string;
  transform?: Array<{}>;
  transformOrigin?: string;
  transitionDelay?: string;
  transitionDuration?: string;
  transitionProperty?: string;
  transitionTimingFunction?: string;
  width?: number | string;
  zIndex?: number;

  /**
   * @platform ios
   */
  direction?: 'inherit' | 'ltr' | 'rtl';
}

interface PerpectiveTransform {
  perspective: number;
}

interface RotateTransform {
  rotate: string;
}

interface RotateXTransform {
  rotateX: string;
}

interface RotateYTransform {
  rotateY: string;
}

interface RotateZTransform {
  rotateZ: string;
}

interface ScaleTransform {
  scale: number;
}

interface ScaleXTransform {
  scaleX: number;
}

interface ScaleYTransform {
  scaleY: number;
}

interface TranslateXTransform {
  translateX: number;
}

interface TranslateYTransform {
  translateY: number;
}

interface SkewXTransform {
  skewX: string;
}

interface SkewYTransform {
  skewY: string;
}

export interface TransformsStyle {
  transform?: (
    | PerpectiveTransform
    | RotateTransform
    | RotateXTransform
    | RotateYTransform
    | RotateZTransform
    | ScaleTransform
    | ScaleXTransform
    | ScaleYTransform
    | TranslateXTransform
    | TranslateYTransform
    | SkewXTransform
    | SkewYTransform
  )[];
  transformMatrix?: Array<number>;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
}

export interface StyleSheetProperties {
  hairlineWidth: number;
  flatten<T extends string>(style: T): T;
}

export interface LayoutRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// @see TextProps.onLayout
export interface LayoutChangeEvent {
  nativeEvent: {
    layout: LayoutRectangle;
  };
}

export type FontVariant = 'small-caps' | 'oldstyle-nums' | 'lining-nums' | 'tabular-nums' | 'proportional-nums';

// @see https://facebook.github.io/react-native/docs/text.html#style
export interface TextStyle extends ViewStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontStyle?: 'normal' | 'italic';
  fontVariant?: FontVariant[];
  /**
   * Specifies font weight. The values 'normal' and 'bold' are supported
   * for most fonts. Not all fonts have a variant for each of the numeric
   * values, in that case the closest one is chosen.
   */
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  letterSpacing?: number;
  letterSpacing?: number;
  lineHeight?: number;
  testID?: string;
  textAlign?: 'center' | 'end' | 'inherit' | 'justify' | 'justify-all' | 'left' | 'right' | 'start';
  textDecorationColor?: string;
  textDecorationColor?: string;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textShadowColor?: string;
  textShadowOffset?: { width: number; height: number };
  textShadowRadius?: number;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  writingDirection?: 'auto' | 'ltr' | 'rtl';
  writingDirection?: 'auto' | 'ltr' | 'rtl';
}

// https://facebook.github.io/react-native/docs/text.html#props
export interface TextProps extends AccessibilityProps {
  /**
   * Specifies whether fonts should scale to respect Text Size accessibility settings.
   * The default is `true`.
   */
  allowFontScaling?: boolean;

  /**
   * This can be one of the following values:
   *
   * - `head` - The line is displayed so that the end fits in the container and the missing text
   * at the beginning of the line is indicated by an ellipsis glyph. e.g., "...wxyz"
   * - `middle` - The line is displayed so that the beginning and end fit in the container and the
   * missing text in the middle is indicated by an ellipsis glyph. "ab...yz"
   * - `tail` - The line is displayed so that the beginning fits in the container and the
   * missing text at the end of the line is indicated by an ellipsis glyph. e.g., "abcd..."
   * - `clip` - Lines are not drawn past the edge of the text container.
   *
   * The default is `tail`.
   *
   * `numberOfLines` must be set in conjunction with this prop.
   *
   * > `clip` is working only for iOS
   */
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

  href?: string;

  /**
   * Line Break mode. Works only with numberOfLines.
   * clip is working only for iOS
   */
  lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip';

  /**
   * Used to truncate the text with an ellipsis after computing the text
   * layout, including line wrapping, such that the total number of lines
   * does not exceed this number.
   *
   * This prop is commonly used with `ellipsizeMode`.
   */
  numberOfLines?: number;

  /**
   * Invoked on mount and layout changes with
   *
   * {nativeEvent: { layout: {x, y, width, height}}}.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * This function is called on press.
   * Text intrinsically supports press handling with a default highlight state (which can be disabled with suppressHighlighting).
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * This function is called on long press.
   * e.g., `onLongPress={this.increaseSize}>``
   */
  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * @see https://facebook.github.io/react-native/docs/text.html#style
   */
  style?: StyleProp<TextStyle>;

  target?: string;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;

  /**
   * Used to reference react managed views from native code.
   */
  nativeID?: string;

  /**
   * Specifies largest possible scale a font can reach when allowFontScaling is enabled. Possible values:
   * - null/undefined (default): inherit from the parent node or the global default (0)
   * - 0: no max, ignore parent/global default
   * - >= 1: sets the maxFontSizeMultiplier of this node to this value
   */
  maxFontSizeMultiplier?: number | null;
}

/**
 * A React component for displaying text which supports nesting, styling, and touch handling.
 */
declare class TextComponent extends React.Component<TextProps> {}
declare const TextBase: Constructor<NativeMethodsMixin> & typeof TextComponent;
export class Text extends TextBase {}

type DataDetectorTypes = 'phoneNumber' | 'link' | 'address' | 'calendarEvent' | 'none' | 'all';

/**
 * DocumentSelectionState is responsible for maintaining selection information
 * for a document.
 *
 * It is intended for use by AbstractTextEditor-based components for
 * identifying the appropriate start/end positions to modify the
 * DocumentContent, and for programatically setting browser selection when
 * components re-render.
 */
export interface DocumentSelectionState extends EventEmitter {
  new (anchor: number, focus: number): DocumentSelectionState;

  /**
   * Apply an update to the state. If either offset value has changed,
   * set the values and emit the `change` event. Otherwise no-op.
   *
   */
  update(anchor: number, focus: number): void;

  /**
   * Given a max text length, constrain our selection offsets to ensure
   * that the selection remains strictly within the text range.
   *
   */
  constrainLength(maxLength: number): void;

  focus(): void;
  blur(): void;
  hasFocus(): boolean;
  isCollapsed(): boolean;
  isBackward(): boolean;

  getAnchorOffset(): number;
  getFocusOffset(): number;
  getStartOffset(): number;
  getEndOffset(): number;
  overlaps(start: number, end: number): boolean;
}

export type KeyboardType = 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';

export type KeyboardTypeOptions = KeyboardType;

export type ReturnKeyType = 'done' | 'go' | 'next' | 'search' | 'send';
export type ReturnKeyTypeOptions = ReturnKeyType;

export interface TargetedEvent {
  target: number;
}

/**
 * @see TextInputProps.onFocus
 */
export interface TextInputFocusEventData extends TargetedEvent {
  text: string;
  eventCount: number;
}

/**
 * @see TextInputProps.onScroll
 */
export interface TextInputScrollEventData {
  contentOffset: { x: number; y: number };
}

/**
 * @see TextInputProps.onSelectionChange
 */
export interface TextInputSelectionChangeEventData extends TargetedEvent {
  selection: {
    start: number;
    end: number;
  };
}

/**
 * @see TextInputProps.onKeyPress
 */
export interface TextInputKeyPressEventData {
  key: string;
}

/**
 * @see TextInputProps.onChange
 */
export interface TextInputChangeEventData extends TargetedEvent {
  eventCount: number;
  text: string;
}

/**
 * @see TextInputProps.onContentSizeChange
 */
export interface TextInputContentSizeChangeEventData {
  contentSize: { width: number; height: number };
}

/**
 * @see TextInputProps.onEndEditing
 */
export interface TextInputEndEditingEventData {
  text: string;
}

/**
 * @see TextInputProps.onSubmitEditing
 */
export interface TextInputSubmitEditingEventData {
  text: string;
}

/**
 * @see https://facebook.github.io/react-native/docs/textinput.html#props
 */
export interface TextInputProps extends ViewProps, TextInputIOSProps, AccessibilityProps {
  /**
   * Specifies whether fonts should scale to respect Text Size accessibility settings.
   * The default is `true`.
   */
  allowFontScaling?: boolean;

  /**
   * Can tell TextInput to automatically capitalize certain characters.
   *      characters: all characters,
   *      words: first letter of each word
   *      sentences: first letter of each sentence (default)
   *      none: don't auto capitalize anything
   *
   * https://facebook.github.io/react-native/docs/textinput.html#autocapitalize
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * If false, disables auto-correct.
   * The default value is true.
   */
  autoCorrect?: boolean;

  /**
   * If true, focuses the input on componentDidMount.
   * The default value is false.
   */
  autoFocus?: boolean;

  /**
   * If true, the text field will blur when submitted.
   * The default value is true.
   */
  blurOnSubmit?: boolean;

  /**
   * If true, caret is hidden. The default value is false.
   */
  caretHidden?: boolean;

  /**
   * If true, context menu is hidden. The default value is false.
   */
  contextMenuHidden?: boolean;

  /**
   * Provides an initial value that will change when the user starts typing.
   * Useful for simple use-cases where you don't want to deal with listening to events
   * and updating the value prop to keep the controlled state in sync.
   */
  defaultValue?: string;

  /**
   * If false, text is not editable. The default value is true.
   */
  editable?: boolean;

  /**
   * enum("default", 'numeric', 'email-address', "ascii-capable", 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad',
   * 'decimal-pad', 'twitter', 'web-search', 'visible-password')
   * Determines which keyboard to open, e.g.numeric.
   * The following values work across platforms: - default - numeric - email-address - phone-pad
   * The following values work on iOS: - ascii-capable - numbers-and-punctuation - url - number-pad - name-phone-pad - decimal-pad - twitter - web-search
   * The following values work on Android: - visible-password
   */
  keyboardType?: KeyboardTypeOptions;

  /**
   * Limits the maximum number of characters that can be entered.
   * Use this instead of implementing the logic in JS to avoid flicker.
   */
  maxLength?: number;

  /**
   * If true, the text input can be multiple lines. The default value is false.
   */
  multiline?: boolean;

  /**
   * Callback that is called when the text input is blurred
   */
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * Callback that is called when the text input's text changes.
   */
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;

  /**
   * Callback that is called when the text input's text changes.
   * Changed text is passed as an argument to the callback handler.
   */
  onChangeText?: (text: string) => void;

  /**
   * Callback that is called when the text input's content size changes.
   * This will be called with
   * `{ nativeEvent: { contentSize: { width, height } } }`.
   *
   * Only called for multiline text inputs.
   */
  onContentSizeChange?: (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => void;

  /**
   * Callback that is called when text input ends.
   */
  onEndEditing?: (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void;

  /**
   * Callback that is called when the text input is focused
   */
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * Callback that is called when the text input selection is changed.
   */
  onSelectionChange?: (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;

  /**
   * Callback that is called when the text input's submit button is pressed.
   */
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;

  /**
   * Invoked on content scroll with
   *  `{ nativeEvent: { contentOffset: { x, y } } }`.
   *
   * May also contain other properties from ScrollEvent but on Android contentSize is not provided for performance reasons.
   */
  onScroll?: (e: NativeSyntheticEvent<TextInputScrollEventData>) => void;

  /**
   * Callback that is called when a key is pressed.
   * This will be called with
   *  `{ nativeEvent: { key: keyValue } }`
   * where keyValue is 'Enter' or 'Backspace' for respective keys and the typed-in character otherwise including ' ' for space.
   *
   * Fires before onChange callbacks.
   * Note: on Android only the inputs from soft keyboard are handled, not the hardware keyboard inputs.
   */
  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;

  /**
   * The string that will be rendered before text input has been entered
   */
  placeholder?: string;

  /**
   * The text color of the placeholder string
   */
  placeholderTextColor?: string;

  /**
   * enum('default', 'go', 'google', 'join', 'next', 'route', 'search', 'send', 'yahoo', 'done', 'emergency-call')
   * Determines how the return key should look.
   */
  returnKeyType?: ReturnKeyTypeOptions;

  /**
   * If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
   * The default value is false.
   */
  secureTextEntry?: boolean;

  /**
   * If true, all text will automatically be selected on focus
   */
  selectTextOnFocus?: boolean;

  /**
   * The start and end of the text input's selection. Set start and end to
   * the same value to position the cursor.
   */
  selection?: { start: number; end?: number };

  /**
   * The highlight (and cursor on ios) color of the text input
   */
  selectionColor?: string;

  /**
   * Styles
   */
  style?: StyleProp<TextStyle>;

  /**
   * Used to locate this view in end-to-end tests
   */
  testID?: string;

  /**
   * Used to connect to an InputAccessoryView. Not part of react-natives documentation, but present in examples and
   * code.
   * See https://facebook.github.io/react-native/docs/inputaccessoryview.html for more information.
   */
  inputAccessoryViewID?: string;

  /**
   * The value to show for the text input. TextInput is a controlled component,
   * which means the native value will be forced to match this value prop if provided.
   * For most uses this works great, but in some cases this may cause flickering - one common cause is preventing edits by keeping value the same.
   * In addition to simply setting the same value, either set editable={false},
   * or set/update maxLength to prevent unwanted edits without flicker.
   */
  value?: string;

  /**
   * Specifies largest possible scale a font can reach when allowFontScaling is enabled. Possible values:
   * - null/undefined (default): inherit from the parent node or the global default (0)
   * - 0: no max, ignore parent/global default
   * - >= 1: sets the maxFontSizeMultiplier of this node to this value
   */
  maxFontSizeMultiplier?: number | null;
}

/**
 * This class is responsible for coordinating the "focused"
 * state for TextInputs. All calls relating to the keyboard
 * should be funneled through here
 */
interface TextInputState {
  /**
   * Returns the ID of the currently focused text field, if one exists
   * If no text field is focused it returns null
   */
  currentlyFocusedField(): number;

  /**
   * @deprecated Use ref.focus instead
   * @param TextInputID id of the text field to focus
   * Focuses the specified text field
   * noop if the text field was already focused
   */
  focusTextInput(textFieldID?: number): void;

  /**
   * @deprecated Use ref.blur instead
   * @param textFieldID id of the text field to focus
   * Unfocuses the specified text field
   * noop if it wasn't focused
   */
  blurTextInput(textFieldID?: number): void;
}

/**
 * @see https://facebook.github.io/react-native/docs/textinput.html#methods
 */
declare class TextInputComponent extends React.Component<TextInputProps> {}
declare const TextInputBase: Constructor<NativeMethodsMixin> & Constructor<TimerMixin> & typeof TextInputComponent;
export class TextInput extends TextInputBase {
  /**
   * Access the current focus state.
   */
  static State: TextInputState;

  /**
   * Returns if the input is currently focused.
   */
  isFocused: () => boolean;

  /**
   * Removes all text from the input.
   */
  clear: () => void;
}

/**
 * Gesture recognition on mobile devices is much more complicated than web.
 * A touch can go through several phases as the app determines what the user's intention is.
 * For example, the app needs to determine if the touch is scrolling, sliding on a widget, or tapping.
 * This can even change during the duration of a touch. There can also be multiple simultaneous touches.
 *
 * The touch responder system is needed to allow components to negotiate these touch interactions
 * without any additional knowledge about their parent or child components.
 * This system is implemented in ResponderEventPlugin.js, which contains further details and documentation.
 *
 * Best Practices
 * Users can feel huge differences in the usability of web apps vs. native, and this is one of the big causes.
 * Every action should have the following attributes:
 *      Feedback/highlighting- show the user what is handling their touch, and what will happen when they release the gesture
 *      Cancel-ability- when making an action, the user should be able to abort it mid-touch by dragging their finger away
 *
 * These features make users more comfortable while using an app,
 * because it allows people to experiment and interact without fear of making mistakes.
 *
 * TouchableHighlight and Touchable*
 * The responder system can be complicated to use.
 * So we have provided an abstract Touchable implementation for things that should be "tappable".
 * This uses the responder system and allows you to easily configure tap interactions declaratively.
 * Use TouchableHighlight anywhere where you would use a button or link on web.
 */
export interface GestureResponderHandlers {
  /**
   * A view can become the touch responder by implementing the correct negotiation methods.
   * There are two methods to ask the view if it wants to become responder:
   */

  /**
   * Does this view want to become responder on the start of a touch?
   */
  onStartShouldSetResponder?: (event: GestureResponderEvent) => boolean;

  /**
   * Called for every touch move on the View when it is not the responder: does this view want to "claim" touch responsiveness?
   */
  onMoveShouldSetResponder?: (event: GestureResponderEvent) => boolean;

  /**
   * If the View returns true and attempts to become the responder, one of the following will happen:
   */

  onResponderEnd?: (event: GestureResponderEvent) => void;

  /**
   * The View is now responding for touch events.
   * This is the time to highlight and show the user what is happening
   */
  onResponderGrant?: (event: GestureResponderEvent) => void;

  /**
   * Something else is the responder right now and will not release it
   */
  onResponderReject?: (event: GestureResponderEvent) => void;

  /**
   * If the view is responding, the following handlers can be called:
   */

  /**
   * The user is moving their finger
   */
  onResponderMove?: (event: GestureResponderEvent) => void;

  /**
   * Fired at the end of the touch, ie "touchUp"
   */
  onResponderRelease?: (event: GestureResponderEvent) => void;

  onResponderStart?: (event: GestureResponderEvent) => void;

  /**
   *  Something else wants to become responder.
   *  Should this view release the responder? Returning true allows release
   */
  onResponderTerminationRequest?: (event: GestureResponderEvent) => boolean;

  /**
   * The responder has been taken from the View.
   * Might be taken by other views after a call to onResponderTerminationRequest,
   * or might be taken by the OS without asking (happens with control center/ notification center on iOS)
   */
  onResponderTerminate?: (event: GestureResponderEvent) => void;

  /**
   * onStartShouldSetResponder and onMoveShouldSetResponder are called with a bubbling pattern,
   * where the deepest node is called first.
   * That means that the deepest component will become responder when multiple Views return true for *ShouldSetResponder handlers.
   * This is desirable in most cases, because it makes sure all controls and buttons are usable.
   *
   * However, sometimes a parent will want to make sure that it becomes responder.
   * This can be handled by using the capture phase.
   * Before the responder system bubbles up from the deepest component,
   * it will do a capture phase, firing on*ShouldSetResponderCapture.
   * So if a parent View wants to prevent the child from becoming responder on a touch start,
   * it should have a onStartShouldSetResponderCapture handler which returns true.
   */
  onStartShouldSetResponderCapture?: (event: GestureResponderEvent) => boolean;

  /**
   * onStartShouldSetResponder and onMoveShouldSetResponder are called with a bubbling pattern,
   * where the deepest node is called first.
   * That means that the deepest component will become responder when multiple Views return true for *ShouldSetResponder handlers.
   * This is desirable in most cases, because it makes sure all controls and buttons are usable.
   *
   * However, sometimes a parent will want to make sure that it becomes responder.
   * This can be handled by using the capture phase.
   * Before the responder system bubbles up from the deepest component,
   * it will do a capture phase, firing on*ShouldSetResponderCapture.
   * So if a parent View wants to prevent the child from becoming responder on a touch start,
   * it should have a onStartShouldSetResponderCapture handler which returns true.
   */
  onMoveShouldSetResponderCapture?: (event: GestureResponderEvent) => boolean;
}

/**
 * @see https://facebook.github.io/react-native/docs/view.html#style
 * @see https://github.com/facebook/react-native/blob/master/Libraries/Components/View/ViewStylePropTypes.js
 */
export interface ViewStyle extends FlexStyle, ShadowStyleIOS, SvgStyle, TransformsStyle {
  backfaceVisibility?: 'visible' | 'hidden';
  backgroundColor?: string;
  borderBottomColor?: string;
  borderBottomEndRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomStartRadius?: number;
  borderBottomWidth?: number;
  borderColor?: string;
  borderEndColor?: string;
  borderLeftColor?: string;
  borderLeftWidth?: number;
  borderRadius?: number;
  borderRightColor?: string;
  borderRightWidth?: number;
  borderStartColor?: string;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  borderTopColor?: string;
  borderTopEndRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderTopStartRadius?: number;
  borderTopWidth?: number;
  borderWidth?: number;
  opacity?: number;
  testID?: string;
  /**
   * Sets the elevation of a view, using Android's underlying
   * [elevation API](https://developer.android.com/training/material/shadows-clipping.html#Elevation).
   * This adds a drop shadow to the item and affects z-order for overlapping views.
   * Only supported on Android 5.0+, has no effect on earlier versions.
   *
   * @platform android
   */
  elevation?: number;
}

interface SvgStyle {
  color?: string;
  fill?: string;
  stroke?: string;
}

interface TableStyle extends FlexStyle, TextStyle {
  display?: 'table' | 'table-cell' | 'table-row';
  borderCollapse?: string;
}

export type TVParallaxProperties = {
  /**
   * If true, parallax effects are enabled.  Defaults to true.
   */
  enabled?: boolean;

  /**
   * Defaults to 2.0.
   */
  shiftDistanceX?: number;

  /**
   * Defaults to 2.0.
   */
  shiftDistanceY?: number;

  /**
   * Defaults to 0.05.
   */
  tiltAngle?: number;

  /**
   * Defaults to 1.0
   */
  magnification?: number;

  /**
   * Defaults to 1.0
   */
  pressMagnification?: number;

  /**
   * Defaults to 0.3
   */
  pressDuration?: number;

  /**
   * Defaults to 0.3
   */
  pressDelay?: number;
};

type Falsy = undefined | null | false;
interface RecursiveArray<T> extends Array<T | ReadonlyArray<T> | RecursiveArray<T>> {}
/** Keep a brand of 'T' so that calls to `StyleSheet.flatten` can take `RegisteredStyle<T>` and return `T`. */
type RegisteredStyle<T> = number & { __registeredStyleBrand: T };
export type StyleProp<T> = T | RegisteredStyle<T> | RecursiveArray<T | RegisteredStyle<T> | Falsy> | Falsy;

/**
 * @see https://facebook.github.io/react-native/docs/accessibility.html#accessibility-properties
 */
export interface AccessibilityProps {
  /**
   * When true, indicates that the view is an accessibility element.
   * By default, all the touchable elements are accessible.
   */
  accessible?: boolean;

  /**
   * Provides an array of custom actions available for accessibility.
   */
  accessibilityActions?: ReadonlyArray<AccessibilityActionInfo>;

  /**
   * Overrides the text that's read by the screen reader when the user interacts with the element. By default, the
   * label is constructed by traversing all the children and accumulating all the Text nodes separated by space.
   */
  accessibilityLabel?: string;

  /**
   * Accessibility Role tells a person using either VoiceOver on iOS or TalkBack on Android the type of element that is focused on.
   */
  accessibilityRole?: AccessibilityRole;
  /**
   * Accessibility State tells a person using either VoiceOver on iOS or TalkBack on Android the state of the element currently focused on.
   * @deprecated: accessibilityState available in 0.60+
   */
  accessibilityStates?: AccessibilityStates[];
  /**
   * Accessibility State tells a person using either VoiceOver on iOS or TalkBack on Android the state of the element currently focused on.
   */
  accessibilityState?: AccessibilityState;
  /**
   * An accessibility hint helps users understand what will happen when they perform an action on the accessibility element when that result is not obvious from the accessibility label.
   */
  accessibilityHint?: string;

  /**
   * When `accessible` is true, the system will try to invoke this function when the user performs an accessibility custom action.
   */
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
}

export type AccessibilityActionInfo = Readonly<{
  name: AccessibilityActionName;
  label?: string;
}>;

export type AccessibilityActionName =
  /**
   * Generated when a screen reader user double taps the component.
   */
  | 'activate'
  /**
   * Gererated when a screen reader user increments an adjustable component.
   */
  | 'increment'
  /**
   * Gererated when a screen reader user decrements an adjustable component.
   */
  | 'decrement'
  /**
   * Generated when a TalkBack user places accessibility focus on the component and double taps and holds one finger on the screen.
   * @platform android
   */
  | 'longpress'
  /**
   * Generated when a VoiceOver user places focus on or inside the component and double taps with two fingers.
   * @platform ios
   * */
  | 'magicTap'
  /**
   * Generated when a VoiceOver user places focus on or inside the component and performs a two finger scrub gesture (left, right, left).
   * @platform ios
   * */
  | 'escape';

export type AccessibilityActionEvent = NativeSyntheticEvent<
  Readonly<{
    actionName: string;
  }>
>;

// @deprecated: use AccessibilityState available in 0.60+
export type AccessibilityStates =
  | 'disabled'
  | 'selected'
  | 'checked'
  | 'unchecked'
  | 'busy'
  | 'expanded'
  | 'collapsed'
  | 'hasPopup';

export interface AccessibilityState {
  /**
   * When true, informs accessible tools if the element is disabled
   */
  disabled?: boolean;
  /**
   * When true, informs accessible tools if the element is selected
   */
  selected?: boolean;
  /**
   * For items like Checkboxes and Toggle switches, reports their state to accessible tools
   */
  checked?: boolean | 'mixed';
  /**
   *  When present, informs accessible tools if the element is busy
   */
  busy?: boolean;
  /**
   *  When present, informs accessible tools the element is expanded or collapsed
   */
  expanded?: boolean;
}

export type AccessibilityRole =
  | 'none'
  | 'adjustable'
  | 'alert'
  | 'alert'
  | 'button'
  | 'checkbox'
  | 'combobox'
  | 'dialog'
  | 'header'
  | 'image'
  | 'imagebutton'
  | 'keyboardkey'
  | 'label'
  | 'link'
  | 'main'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'nav'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'scrollbar'
  | 'search'
  | 'spinbutton'
  | 'summary'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'text'
  | 'timer'
  | 'toolbar'
  | 'tooltip';

type AccessibilityTrait =
  | 'none'
  | 'button'
  | 'link'
  | 'header'
  | 'search'
  | 'image'
  | 'selected'
  | 'plays'
  | 'key'
  | 'text'
  | 'summary'
  | 'disabled'
  | 'frequentUpdates'
  | 'startsMedia'
  | 'adjustable'
  | 'allowsDirectInteraction'
  | 'pageTurn';

/**
 * @see https://facebook.github.io/react-native/docs/view.html#props
 */
export interface ViewProps extends GestureResponderHandlers, Touchable, AccessibilityProps {
  /**
   * This defines how far a touch event can start away from the view.
   * Typical interface guidelines recommend touch targets that are at least
   * 30 - 40 points/density-independent pixels. If a Touchable view has
   * a height of 20 the touchable height can be extended to 40 with
   * hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}
   * NOTE The touch area never extends past the parent view bounds and
   * the Z-index of sibling views always takes precedence if a touch
   * hits two overlapping views.
   */
  hitSlop?: Insets;

  href?: string;

  onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;

  /**
   * Invoked on mount and layout changes with
   *
   * {nativeEvent: { layout: {x, y, width, height}}}.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   *
   * In the absence of auto property, none is much like CSS's none value. box-none is as if you had applied the CSS class:
   *
   * .box-none {
   *   pointer-events: none;
   * }
   * .box-none * {
   *   pointer-events: all;
   * }
   *
   * box-only is the equivalent of
   *
   * .box-only {
   *   pointer-events: all;
   * }
   * .box-only * {
   *   pointer-events: none;
   * }
   *
   * But since pointerEvents does not affect layout/appearance, and we are already deviating from the spec by adding additional modes,
   * we opt to not include pointerEvents on style. On some platforms, we would need to implement it as a className anyways. Using style or not is an implementation detail of the platform.
   */
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';

  /**
   *
   * This is a special performance property exposed by RCTView and is useful for scrolling content when there are many subviews,
   * most of which are offscreen. For this property to be effective, it must be applied to a view that contains many subviews that extend outside its bound.
   * The subviews must also have overflow: hidden, as should the containing view (or one of its superviews).
   */
  removeClippedSubviews?: boolean;

  style?: StyleProp<ViewStyle>;

  target?: string;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;

  /**
   * Used to reference react managed views from native code.
   */
  nativeID?: string;
}

/**
 * The most fundamental component for building UI, View is a container that supports layout with flexbox, style, some touch handling,
 * and accessibility controls, and is designed to be nested inside other views and to have 0 to many children of any type.
 * View maps directly to the native view equivalent on whatever platform React is running on,
 * whether that is a UIView, <div>, android.view, etc.
 */
declare class ViewComponent extends React.Component<ViewProps> {}
declare const ViewBase: Constructor<NativeMethodsMixin> & typeof ViewComponent;
export class View extends ViewBase {
  /**
   * Is 3D Touch / Force Touch available (i.e. will touch events include `force`)
   * @platform ios
   */
  static forceTouchAvailable: boolean;
}

/**
 * It is a component to solve the common problem of views that need to move out of the way of the virtual keyboard.
 * It can automatically adjust either its position or bottom padding based on the position of the keyboard.
 */
declare class KeyboardAvoidingViewComponent extends React.Component<KeyboardAvoidingViewProps> {}
declare const KeyboardAvoidingViewBase: Constructor<TimerMixin> & typeof KeyboardAvoidingViewComponent;
export class KeyboardAvoidingView extends KeyboardAvoidingViewBase {}

export interface KeyboardAvoidingViewProps extends ViewProps {
  behavior?: 'height' | 'position' | 'padding';

  /**
   * The style of the content container(View) when behavior is 'position'.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * This is the distance between the top of the user screen and the react native view,
   * may be non-zero in some use cases.
   */
  keyboardVerticalOffset?: number;

  /**
   * Enables or disables the KeyboardAvoidingView.
   *
   * Default is true
   */
  enabled?: boolean;
}

/**
 * Renders nested content and automatically applies paddings reflect the portion of the view
 * that is not covered by navigation bars, tab bars, toolbars, and other ancestor views.
 * Moreover, and most importantly, Safe Area's paddings reflect physical limitation of the screen,
 * such as rounded corners or camera notches (aka sensor housing area on iPhone X).
 */
declare class SafeAreaViewComponent extends React.Component<ViewProps> {}
declare const SafeAreaViewBase: Constructor<NativeMethodsMixin> & typeof SafeAreaViewComponent;
export class SafeAreaView extends SafeAreaViewBase {}

/**
 * A component which enables customization of the keyboard input accessory view on iOS. The input accessory view is
 * displayed above the keyboard whenever a TextInput has focus. This component can be used to create custom toolbars.
 *
 * To use this component wrap your custom toolbar with the InputAccessoryView component, and set a nativeID. Then, pass
 * that nativeID as the inputAccessoryViewID of whatever TextInput you desire.
 */
export class InputAccessoryView extends React.Component<InputAccessoryViewProps> {}

export interface InputAccessoryViewProps {
  backgroundColor?: string;

  /**
   * An ID which is used to associate this InputAccessoryView to specified TextInput(s).
   */
  nativeID?: string;

  style?: StyleProp<ViewStyle>;
}

/**
 * @see https://facebook.github.io/react-native/docs/activityindicator.html#props
 */
export interface ActivityIndicatorProps extends ViewProps {
  /**
   * Whether to show the indicator (true, the default) or hide it (false).
   */
  animating?: boolean;

  /**
   * The foreground color of the spinner (default is gray).
   */
  color?: string;

  /**
   * Whether the indicator should hide when not animating (true by default).
   */
  hidesWhenStopped?: boolean;

  /**
   * Size of the indicator.
   * Small has a height of 20, large has a height of 36.
   *
   * enum('small', 'large')
   */
  size?: number | 'small' | 'large';

  style?: StyleProp<ViewStyle>;
}

declare class ActivityIndicatorComponent extends React.Component<ActivityIndicatorProps> {}
declare const ActivityIndicatorBase: Constructor<NativeMethodsMixin> & typeof ActivityIndicatorComponent;
export class ActivityIndicator extends ActivityIndicatorBase {}

export interface DrawerSlideEvent extends NativeSyntheticEvent<NativeTouchEvent> {}

interface DrawerPosition {
  Left: number;
  Right: number;
}

/**
 * @see Picker.js
 */
export interface PickerItemProps {
  testID?: string;
  color?: string;
  label: string;
  value?: any;
}

/**
 * @see https://facebook.github.io/react-native/docs/picker.html
 * @see Picker.js
 */
export interface PickerProps extends ViewProps {
  /**
   * Callback for when an item is selected. This is called with the
   * following parameters:
   * - itemValue: the value prop of the item that was selected
   * - itemPosition: the index of the selected item in this picker
   */
  onValueChange?: (itemValue: any, itemPosition: number) => void;

  /**
   * Value matching value of one of the items.
   * Can be a string or an integer.
   */
  selectedValue?: any;

  style?: StyleProp<TextStyle>;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testId?: string;
}

/**
 * @see https://facebook.github.io/react-native/docs/picker.html
 * @see Picker.js
 */
export class Picker extends React.Component<PickerProps> {
  /**
   * On Android, display the options in a dialog.
   */
  static MODE_DIALOG: string;

  /**
   * On Android, display the options in a dropdown (this is the default).
   */
  static MODE_DROPDOWN: string;

  static Item: React.ComponentType<PickerItemProps>;
}

export interface RefreshControlProps extends ViewProps {
  /**
   * Called when the view starts refreshing.
   */
  onRefresh?: () => void;

  /**
   * Whether the view should be indicating an active refresh.
   */
  refreshing: boolean;
}

/**
 * This component is used inside a ScrollView or ListView to add pull to refresh
 * functionality. When the ScrollView is at `scrollY: 0`, swiping down
 * triggers an `onRefresh` event.
 *
 * __Note:__ `refreshing` is a controlled prop, this is why it needs to be set to true
 * in the `onRefresh` function otherwise the refresh indicator will stop immediately.
 */
declare class RefreshControlComponent extends React.Component<RefreshControlProps> {}
declare const RefreshControlBase: Constructor<NativeMethodsMixin> & typeof RefreshControlComponent;
export class RefreshControl extends RefreshControlBase {
  static SIZE: Object; // Undocumented
}

export interface RecyclerViewBackedScrollViewProps extends ScrollViewProps {}

/**
 * Wrapper around android native recycler view.
 *
 * It simply renders rows passed as children in a separate recycler view cells
 * similarly to how `ScrollView` is doing it. Thanks to the fact that it uses
 * native `RecyclerView` though, rows that are out of sight are going to be
 * automatically detached (similarly on how this would work with
 * `removeClippedSubviews = true` on a `ScrollView.js`).
 *
 * CAUTION: This is an experimental component and should only be used together
 * with javascript implementation of list view (see ListView.js). In order to
 * use it pass this component as `renderScrollComponent` to the list view. For
 * now only horizontal scrolling is supported.
 */
declare class RecyclerViewBackedScrollViewComponent extends React.Component<RecyclerViewBackedScrollViewProps> {}
declare const RecyclerViewBackedScrollViewBase: Constructor<ScrollResponderMixin> &
  typeof RecyclerViewBackedScrollViewComponent;
export class RecyclerViewBackedScrollView extends RecyclerViewBackedScrollViewBase {
  /**
   * A helper function to scroll to a specific point  in the scrollview.
   * This is currently used to help focus on child textviews, but can also
   * be used to quickly scroll to any element we want to focus. Syntax:
   *
   * scrollResponderScrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as an alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo(y?: number | { x?: number; y?: number; animated?: boolean }, x?: number, animated?: boolean): void;

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder(): JSX.Element;
}

export interface SliderProps extends ViewProps {
  /**
   * If true the user won't be able to move the slider.
   * Default value is false.
   */
  disabled?: boolean;

  /**
   * The color used for the track to the right of the button.
   * Overrides the default blue gradient image.
   */
  maximumTrackTintColor?: string;

  /**
   * Initial maximum value of the slider. Default value is 1.
   */
  maximumValue?: number;

  /**
   * The color used for the track to the left of the button.
   * Overrides the default blue gradient image.
   */
  minimumTrackTintColor?: string;

  /**
   * Initial minimum value of the slider. Default value is 0.
   */
  minimumValue?: number;

  /**
   * Callback called when the user finishes changing the value (e.g. when the slider is released).
   */
  onSlidingComplete?: (value: number) => void;

  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onValueChange?: (value: number) => void;

  /**
   * Step value of the slider. The value should be between 0 and (maximumValue - minimumValue). Default value is 0.
   */
  step?: number;

  /**
   * Used to style and layout the Slider. See StyleSheet.js and ViewStylePropTypes.js for more info.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Used to locate this view in UI automation tests.
   */
  testID?: string;

  /**
   * Initial value of the slider. The value should be between minimumValue
   * and maximumValue, which default to 0 and 1 respectively.
   * Default value is 0.
   * This is not a controlled component, you don't need to update
   * the value during dragging.
   */
  value?: number;
}

/**
 * A component used to select a single value from a range of values.
 */
declare class SliderComponent extends React.Component<SliderProps> {}
declare const SliderBase: Constructor<NativeMethodsMixin> & typeof SliderComponent;
export class Slider extends SliderBase {}

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

/**
 * @see ImageResizeMode.js
 */
export interface ImageResizeModeStatic {
  /**
   * contain - The image will be resized such that it will be completely
   * visible, contained within the frame of the View.
   */
  contain: ImageResizeMode;
  /**
   * cover - The image will be resized such that the entire area of the view
   * is covered by the image, potentially clipping parts of the image.
   */
  cover: ImageResizeMode;
  /**
   * stretch - The image will be stretched to fill the entire frame of the
   * view without clipping.  This may change the aspect ratio of the image,
   * distoring it.  Only supported on iOS.
   */
  stretch: ImageResizeMode;
  /**
   * center - The image will be scaled down such that it is completely visible,
   * if bigger than the area of the view.
   * The image will not be scaled up.
   */
  center: ImageResizeMode;

  /**
   * repeat - The image will be repeated to cover the frame of the View. The
   * image will keep it's size and aspect ratio.
   */
  repeat: ImageResizeMode;
}

/**
 * Image style
 * @see https://facebook.github.io/react-native/docs/image.html#style
 * @see https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageStylePropTypes.js
 */
export interface ImageStyle extends FlexStyle, TransformsStyle {
  resizeMode?: ImageResizeMode;
  backfaceVisibility?: 'visible' | 'hidden';
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  boxSizing?: 'border-box' | 'content-box';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  overflow?: 'visible' | 'hidden';
  overlayColor?: string;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  tintColor?: string;
  opacity?: number;
}

/*
 * @see https://github.com/facebook/react-native/blob/master/Libraries/Image/ImageSourcePropType.js
 */
export interface ImageURISource {
  /**
   * `uri` is a string representing the resource identifier for the image, which
   * could be an http address, a local file path, or the name of a static image
   * resource (which should be wrapped in the `require('./path/to/image.png')`
   * function).
   */
  uri?: string;
  /**
   * `bundle` is the iOS asset bundle which the image is included in. This
   * will default to [NSBundle mainBundle] if not set.
   * @platform ios
   */
  bundle?: string;
  /**
   * `method` is the HTTP Method to use. Defaults to GET if not specified.
   */
  method?: string;
  /**
   * `headers` is an object representing the HTTP headers to send along with the
   * request for a remote image.
   */
  headers?: { [key: string]: string };
  /**
   * `cache` determines how the requests handles potentially cached
   * responses.
   *
   * - `default`: Use the native platforms default strategy. `useProtocolCachePolicy` on iOS.
   *
   * - `reload`: The data for the URL will be loaded from the originating source.
   * No existing cache data should be used to satisfy a URL load request.
   *
   * - `force-cache`: The existing cached data will be used to satisfy the request,
   * regardless of its age or expiration date. If there is no existing data in the cache
   * corresponding the request, the data is loaded from the originating source.
   *
   * - `only-if-cached`: The existing cache data will be used to satisfy a request, regardless of
   * its age or expiration date. If there is no existing data in the cache corresponding
   * to a URL load request, no attempt is made to load the data from the originating source,
   * and the load is considered to have failed.
   *
   * @platform ios
   */
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
  /**
   * `body` is the HTTP body to send with the request. This must be a valid
   * UTF-8 string, and will be sent exactly as specified, with no
   * additional encoding (e.g. URL-escaping or base64) applied.
   */
  body?: string;
  /**
   * `width` and `height` can be specified if known at build time, in which case
   * these will be used to set the default `<Image/>` component dimensions.
   */
  width?: number;
  height?: number;
  /**
   * `scale` is used to indicate the scale factor of the image. Defaults to 1.0 if
   * unspecified, meaning that one image pixel equates to one display point / DIP.
   */
  scale?: number;
}

export type ImageRequireSource = number;

/**
 * @see https://facebook.github.io/react-native/docs/image.html#source
 */
export type ImageSourcePropType = ImageURISource | ImageURISource[] | ImageRequireSource;

/**
 * @see ImagePropsBase.onLoad
 */

export interface ImageLoadEventData {
  source: {
    height: number;
    width: number;
    url: string;
  };
}

export interface ImageErrorEventData {
  error: any;
}

/**
 * @see https://facebook.github.io/react-native/docs/image.html#resolveassetsource
 */
export interface ImageResolvedAssetSource {
  height: number;
  width: number;
  scale: number;
  uri: string;
}

/**
 * @see https://facebook.github.io/react-native/docs/image.html
 */
export interface ImagePropsBase extends AccessibilityProps {
  /**
   * onLayout function
   *
   * Invoked on mount and layout changes with
   *
   * {nativeEvent: { layout: {x, y, width, height} }}.
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * Invoked on load error with {nativeEvent: {error}}
   */
  onError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;

  /**
   * Invoked when load completes successfully
   * { source: { url, height, width } }.
   */
  onLoad?: (event: NativeSyntheticEvent<ImageLoadEventData>) => void;

  /**
   * Invoked when load either succeeds or fails
   */
  onLoadEnd?: () => void;

  /**
   * Invoked on load start
   */
  onLoadStart?: () => void;

  progressiveRenderingEnabled?: boolean;

  borderRadius?: number;

  borderTopLeftRadius?: number;

  borderTopRightRadius?: number;

  borderBottomLeftRadius?: number;

  borderBottomRightRadius?: number;

  /**
   * Determines how to resize the image when the frame doesn't match the raw
   * image dimensions.
   *
   * 'cover': Scale the image uniformly (maintain the image's aspect ratio)
   * so that both dimensions (width and height) of the image will be equal
   * to or larger than the corresponding dimension of the view (minus padding).
   *
   * 'contain': Scale the image uniformly (maintain the image's aspect ratio)
   * so that both dimensions (width and height) of the image will be equal to
   * or less than the corresponding dimension of the view (minus padding).
   *
   * 'stretch': Scale width and height independently, This may change the
   * aspect ratio of the src.
   *
   * 'repeat': Repeat the image to cover the frame of the view.
   * The image will keep it's size and aspect ratio. (iOS only)
   *
   * 'center': Scale the image down so that it is completely visible,
   * if bigger than the area of the view.
   * The image will not be scaled up.
   */
  resizeMode?: ImageResizeMode;

  /**
   * The mechanism that should be used to resize the image when the image's dimensions
   * differ from the image view's dimensions. Defaults to `auto`.
   *
   * - `auto`: Use heuristics to pick between `resize` and `scale`.
   *
   * - `resize`: A software operation which changes the encoded image in memory before it
   * gets decoded. This should be used instead of `scale` when the image is much larger
   * than the view.
   *
   * - `scale`: The image gets drawn downscaled or upscaled. Compared to `resize`, `scale` is
   * faster (usually hardware accelerated) and produces higher quality images. This
   * should be used if the image is smaller than the view. It should also be used if the
   * image is slightly bigger than the view.
   *
   * More details about `resize` and `scale` can be found at http://frescolib.org/docs/resizing-rotating.html.
   *
   * @platform android
   */
  resizeMethod?: 'auto' | 'resize' | 'scale';

  /**
   * The image source (either a remote URL or a local file resource).
   *
   * This prop can also contain several remote URLs, specified together with their width and height and potentially with scale/other URI arguments.
   * The native side will then choose the best uri to display based on the measured size of the image container.
   * A cache property can be added to control how networked request interacts with the local cache.
   *
   * The currently supported formats are png, jpg, jpeg, bmp, gif, webp (Android only), psd (iOS only).
   */
  source: ImageSourcePropType;

  /**
   * similarly to `source`, this property represents the resource used to render
   * the loading indicator for the image, displayed until image is ready to be
   * displayed, typically after when it got downloaded from network.
   */
  loadingIndicatorSource?: ImageURISource;

  /**
   * A unique identifier for this element to be used in UI Automation testing scripts.
   */
  testID?: string;

  /**
   * A static image to display while downloading the final image off the network.
   */
  defaultSource?: ImageURISource | number;
}

export interface ImageProps extends ImagePropsBase {
  /**
   *
   * Style
   */
  style?: StyleProp<ImageStyle>;
}

declare class ImageComponent extends React.Component<ImageProps> {}
declare const ImageBase: Constructor<NativeMethodsMixin> & typeof ImageComponent;
export class Image extends ImageBase {
  static getSize(uri: string, success: (width: number, height: number) => void, failure: (error: any) => void): any;
  static prefetch(url: string): any;
  static abortPrefetch?(requestId: number): void;
  static queryCache?(urls: string[]): Promise<{ [url: string]: 'memory' | 'disk' | 'disk/memory' }>;

  /**
   * @see https://facebook.github.io/react-native/docs/image.html#resolveassetsource
   */
  static resolveAssetSource(source: ImageSourcePropType): ImageResolvedAssetSource;
}

export interface ImageBackgroundProps extends ImagePropsBase {
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  imageRef?(image: Image): void;
}

declare class ImageBackgroundComponent extends React.Component<ImageBackgroundProps> {}
declare const ImageBackgroundBase: Constructor<NativeMethodsMixin> & typeof ImageBackgroundComponent;
export class ImageBackground extends ImageBackgroundBase {
  resizeMode: ImageResizeMode;
  getSize(uri: string, success: (width: number, height: number) => void, failure: (error: any) => void): any;
  prefetch(url: string): any;
  abortPrefetch?(requestId: number): void;
  queryCache?(urls: string[]): Promise<{ [url: string]: 'memory' | 'disk' | 'disk/memory' }>;
}

export interface ViewToken {
  item: any;
  key: string;
  index: number | null;
  isViewable: boolean;
  section?: any;
}

export interface ViewabilityConfig {
  /**
   * Minimum amount of time (in milliseconds) that an item must be physically viewable before the
   * viewability callback will be fired. A high number means that scrolling through content without
   * stopping will not mark the content as viewable.
   */
  minimumViewTime?: number;

  /**
   * Percent of viewport that must be covered for a partially occluded item to count as
   * "viewable", 0-100. Fully visible items are always considered viewable. A value of 0 means
   * that a single pixel in the viewport makes the item viewable, and a value of 100 means that
   * an item must be either entirely visible or cover the entire viewport to count as viewable.
   */
  viewAreaCoveragePercentThreshold?: number;

  /**
   * Similar to `viewAreaCoveragePercentThreshold`, but considers the percent of the item that is visible,
   * rather than the fraction of the viewable area it covers.
   */
  itemVisiblePercentThreshold?: number;

  /**
   * Nothing is considered viewable until the user scrolls or `recordInteraction` is called after
   * render.
   */
  waitForInteraction?: boolean;
}

export interface ViewabilityConfigCallbackPair {
  viewabilityConfig: ViewabilityConfig;
  onViewableItemsChanged: ((info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => void) | null;
}

export type ViewabilityConfigCallbackPairs = ViewabilityConfigCallbackPair[];

/**
 * @see https://facebook.github.io/react-native/docs/flatlist.html#props
 */

export interface ListRenderItemInfo<ItemT> {
  item: ItemT;

  index: number;

  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
  };
}

export type ListRenderItem<ItemT> = (info: ListRenderItemInfo<ItemT>) => React.ReactElement | null;

export interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
  /**
   * Rendered in between each item, but not at the top or bottom
   */
  ItemSeparatorComponent?: React.ComponentType<any> | null;

  /**
   * Rendered when the list is empty.
   */
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered at the very end of the list.
   */
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Styling for internal View for ListFooterComponent
   */
  ListFooterComponentStyle?: ViewStyle | null;

  /**
   * Rendered at the very beginning of the list.
   */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Styling for internal View for ListHeaderComponent
   */
  ListHeaderComponentStyle?: ViewStyle | null;

  /**
   * Optional custom style for multi-item rows generated when numColumns > 1
   */
  columnWrapperStyle?: StyleProp<ViewStyle>;

  /**
   * Determines when the keyboard should stay visible after a tap.
   * - 'never' (the default), tapping outside of the focused text input when the keyboard is up dismisses the keyboard. When this happens, children won't receive the tap.
   * - 'always', the keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
   * - 'handled', the keyboard will not dismiss automatically when the tap was handled by a children, (or captured by an ancestor).
   * - false, deprecated, use 'never' instead
   * - true, deprecated, use 'always' instead
   */
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';

  /**
   * For simplicity, data is just a plain array. If you want to use something else,
   * like an immutable list, use the underlying VirtualizedList directly.
   */
  data: ReadonlyArray<ItemT> | null | undefined;

  /**
   * A marker property for telling the list to re-render (since it implements PureComponent).
   * If any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the `data` prop,
   * stick it here and treat it immutably.
   */
  extraData?: any;

  /**
   * `getItemLayout` is an optional optimization that lets us skip measurement of dynamic
   * content if you know the height of items a priori. getItemLayout is the most efficient,
   * and is easy to use if you have fixed height items, for example:
   * ```
   * getItemLayout={(data, index) => (
   *   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
   * )}
   * ```
   * Remember to include separator length (height or width) in your offset calculation if you specify
   * `ItemSeparatorComponent`.
   */
  getItemLayout?: (
    data: Array<ItemT> | null | undefined,
    index: number
  ) => { length: number; offset: number; index: number };

  /**
   * If true, renders items next to each other horizontally instead of stacked vertically.
   */
  horizontal?: boolean | null;

  /**
   * How many items to render in the initial batch
   */
  initialNumToRender?: number;

  /**
   * Instead of starting at the top with the first item, start at initialScrollIndex
   */
  initialScrollIndex?: number | null;

  /**
   * Used to extract a unique key for a given item at the specified index. Key is used for caching
   * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
   * falls back to using the index, like React does.
   */
  keyExtractor?: (item: ItemT, index: number) => string;

  /**
   * Uses legacy MetroListView instead of default VirtualizedSectionList
   */
  legacyImplementation?: boolean;

  /**
   * Multiple columns can only be rendered with `horizontal={false}` and will zig-zag like a `flexWrap` layout.
   * Items should all be the same height - masonry layouts are not supported.
   */
  numColumns?: number;

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number | null;

  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality.
   * Make sure to also set the refreshing prop correctly.
   */
  onRefresh?: (() => void) | null;

  /**
   * Called when the viewability of rows changes, as defined by the `viewablePercentThreshold` prop.
   */
  onViewableItemsChanged?: ((info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => void) | null;

  /**
   * Set this true while waiting for new data from a refresh.
   */
  refreshing?: boolean | null;

  /**
   * Takes an item from data and renders it into the list. Typical usage:
   * ```
   * _renderItem = ({item}) => (
   *   <TouchableOpacity onPress={() => this._onPress(item)}>
   *     <Text>{item.title}</Text>
   *   <TouchableOpacity/>
   * );
   * ...
   * <FlatList data={[{title: 'Title Text', key: 'item1'}]} renderItem={this._renderItem} />
   * ```
   * Provides additional metadata like `index` if you need it.
   */
  renderItem: ListRenderItem<ItemT> | null | undefined;

  /**
   * See `ViewabilityHelper` for flow type and further documentation.
   */
  viewabilityConfig?: any;

  /**
   * Note: may have bugs (missing content) in some circumstances - use at your own risk.
   *
   * This may improve scroll performance for large lists.
   */
  removeClippedSubviews?: boolean;
}

export class FlatList<ItemT = any> extends React.Component<FlatListProps<ItemT>> {
  /**
   * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
   */
  scrollToEnd: (params?: { animated?: boolean | null }) => void;

  /**
   * Scrolls to the item at the specified index such that it is positioned in the viewable area
   * such that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
   * Cannot scroll to locations outside the render window without specifying the getItemLayout prop.
   */
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;

  /**
   * Requires linear scan through data - use `scrollToIndex` instead if possible.
   * May be janky without `getItemLayout` prop.
   */
  scrollToItem: (params: { animated?: boolean | null; item: ItemT; viewPosition?: number }) => void;

  /**
   * Scroll to a specific content pixel offset, like a normal `ScrollView`.
   */
  scrollToOffset: (params: { animated?: boolean | null; offset: number }) => void;

  /**
   * Tells the list an interaction has occured, which should trigger viewability calculations,
   * e.g. if waitForInteractions is true and the user has not scrolled. This is typically called
   * by taps on items or by navigation actions.
   */
  recordInteraction: () => void;

  /**
   * Displays the scroll indicators momentarily.
   */
  flashScrollIndicators: () => void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder: () => JSX.Element | null | undefined;

  /**
   * Provides a reference to the underlying host component
   */
  getNativeScrollRef: () => React.RefObject<View> | React.RefObject<ScrollViewComponent> | null | undefined;

  getScrollableNode: () => any;

  // TODO: use `unknown` instead of `any` for Typescript >= 3.0
  setNativeProps: (props: { [key: string]: any }) => void;
}

/**
 * @see https://facebook.github.io/react-native/docs/sectionlist.html
 */
export interface SectionBase<ItemT> {
  data: ReadonlyArray<ItemT>;

  key?: string;

  renderItem?: SectionListRenderItem<ItemT>;

  ItemSeparatorComponent?: React.ComponentType<any> | null;

  keyExtractor?: (item: ItemT, index: number) => string;
}

export interface SectionListData<ItemT> extends SectionBase<ItemT> {
  [key: string]: any;
}

/**
 * @see https://facebook.github.io/react-native/docs/sectionlist.html#props
 */

export interface SectionListRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  section: SectionListData<ItemT>;
}

export type SectionListRenderItem<ItemT> = (info: SectionListRenderItemInfo<ItemT>) => React.ReactElement | null;

export interface SectionListProps<ItemT> extends VirtualizedListWithoutRenderItemProps<ItemT> {
  /**
   * Rendered in between adjacent Items within each section.
   */
  ItemSeparatorComponent?: React.ComponentType<any> | null;

  /**
   * Rendered when the list is empty.
   */
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered at the very end of the list.
   */
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered at the very beginning of the list.
   */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered in between each section.
   */
  SectionSeparatorComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * A marker property for telling the list to re-render (since it implements PureComponent).
   * If any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the `data` prop,
   * stick it here and treat it immutably.
   */
  extraData?: any;

  /**
   * `getItemLayout` is an optional optimization that lets us skip measurement of dynamic
   * content if you know the height of items a priori. getItemLayout is the most efficient,
   * and is easy to use if you have fixed height items, for example:
   * ```
   * getItemLayout={(data, index) => (
   *   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
   * )}
   * ```
   */
  getItemLayout?: (
    data: SectionListData<ItemT>[] | null,
    index: number
  ) => { length: number; offset: number; index: number };

  /**
   * How many items to render in the initial batch
   */
  initialNumToRender?: number;

  /**
   * Reverses the direction of scroll. Uses scale transforms of -1.
   */
  inverted?: boolean | null;

  /**
   * Used to extract a unique key for a given item at the specified index. Key is used for caching
   * and as the react key to track item re-ordering. The default extractor checks `item.key`, then
   * falls back to using the index, like React does.
   */
  keyExtractor?: (item: ItemT, index: number) => string;

  /**
   * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
   */
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;

  /**
   * How far from the end (in units of visible length of the list) the bottom edge of the
   * list must be from the end of the content to trigger the `onEndReached` callback.
   * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
   * within half the visible length of the list.
   */
  onEndReachedThreshold?: number | null;

  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality.
   * Make sure to also set the refreshing prop correctly.
   */
  onRefresh?: (() => void) | null;

  /**
   * Used to handle failures when scrolling to an index that has not been measured yet.
   * Recommended action is to either compute your own offset and `scrollTo` it, or scroll as far
   * as possible and then try again after more items have been rendered.
   */
  onScrollToIndexFailed?: (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => void;

  /**
   * Set this true while waiting for new data from a refresh.
   */
  refreshing?: boolean | null;

  /**
   * Default renderer for every item in every section. Can be over-ridden on a per-section basis.
   */
  renderItem?: SectionListRenderItem<ItemT>;

  /**
   * Rendered at the top of each section. Sticky headers are not yet supported.
   */
  renderSectionHeader?: (info: { section: SectionListData<ItemT> }) => React.ReactElement | null;

  /**
   * Rendered at the bottom of each section.
   */
  renderSectionFooter?: (info: { section: SectionListData<ItemT> }) => React.ReactElement | null;

  /**
   * An array of objects with data for each section.
   */
  sections: ReadonlyArray<SectionListData<ItemT>>;

  /**
   * Render a custom scroll component, e.g. with a differently styled `RefreshControl`.
   */
  renderScrollComponent?: (props: ScrollViewProps) => React.ReactElement<ScrollViewProps>;

  /**
   * Note: may have bugs (missing content) in some circumstances - use at your own risk.
   *
   * This may improve scroll performance for large lists.
   */
  removeClippedSubviews?: boolean;

  /**
   * Makes section headers stick to the top of the screen until the next one pushes it off.
   * Only enabled by default on iOS because that is the platform standard there.
   */
  stickySectionHeadersEnabled?: boolean;

  /**
   * Uses legacy MetroListView instead of default VirtualizedSectionList
   */
  legacyImplementation?: boolean;
}

export interface SectionListScrollParams {
  animated?: boolean;
  itemIndex: number;
  sectionIndex: number;
  viewOffset?: number;
  viewPosition?: number;
}

export class SectionList<SectionT = any> extends React.Component<SectionListProps<SectionT>> {
  /**
   * Scrolls to the item at the specified sectionIndex and itemIndex (within the section)
   * positioned in the viewable area such that viewPosition 0 places it at the top
   * (and may be covered by a sticky header), 1 at the bottom, and 0.5 centered in the middle.
   */
  scrollToLocation(params: SectionListScrollParams): void;

  /**
   * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
   * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
   * taps on items or by navigation actions.
   */
  recordInteraction(): void;

  /**
   * Displays the scroll indicators momentarily.
   *
   * @platform ios
   */
  flashScrollIndicators(): void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder(): ScrollView | undefined;

  /**
   * Provides a handle to the underlying scroll node.
   */
  getScrollableNode(): NodeHandle | undefined;
}

/* This definition is deprecated because it extends the wrong base type */
export interface SectionListStatic<SectionT> extends React.ComponentClass<SectionListProps<SectionT>> {
  /**
   * Scrolls to the item at the specified sectionIndex and itemIndex (within the section)
   * positioned in the viewable area such that viewPosition 0 places it at the top
   * (and may be covered by a sticky header), 1 at the bottom, and 0.5 centered in the middle.
   */
  scrollToLocation?(params: SectionListScrollParams): void;
}

/**
 * @see https://facebook.github.io/react-native/docs/virtualizedlist.html#props
 */
export interface VirtualizedListProps<ItemT> extends VirtualizedListWithoutRenderItemProps<ItemT> {
  renderItem: ListRenderItem<ItemT> | null | undefined;
}

export interface VirtualizedListWithoutRenderItemProps<ItemT> extends ScrollViewProps {
  /**
   * Rendered when the list is empty. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered at the bottom of all the items. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Rendered at the top of all the items. Can be a React Component Class, a render function, or
   * a rendered element.
   */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * The default accessor functions assume this is an Array<{key: string}> but you can override
   * getItem, getItemCount, and keyExtractor to handle any type of index-based data.
   */
  data?: any;

  /**
   * `debug` will turn on extra logging and visual overlays to aid with debugging both usage and
   * implementation, but with a significant perf hit.
   */
  debug?: boolean;

  /**
   * DEPRECATED: Virtualization provides significant performance and memory optimizations, but fully
   * unmounts react instances that are outside of the render window. You should only need to disable
   * this for debugging purposes.
   */
  disableVirtualization?: boolean;

  /**
   * A marker property for telling the list to re-render (since it implements `PureComponent`). If
   * any of your `renderItem`, Header, Footer, etc. functions depend on anything outside of the
   * `data` prop, stick it here and treat it immutably.
   */
  extraData?: any;

  /**
   * A generic accessor for extracting an item from any sort of data blob.
   */
  getItem?: (data: any, index: number) => ItemT;

  /**
   * Determines how many items are in the data blob.
   */
  getItemCount?: (data: any) => number;

  getItemLayout?: (
    data: any,
    index: number
  ) => {
    length: number;
    offset: number;
    index: number;
  };

  horizontal?: boolean | null;

  /**
   * How many items to render in the initial batch. This should be enough to fill the screen but not
   * much more. Note these items will never be unmounted as part of the windowed rendering in order
   * to improve perceived performance of scroll-to-top actions.
   */
  initialNumToRender?: number;

  /**
   * Instead of starting at the top with the first item, start at `initialScrollIndex`. This
   * disables the "scroll to top" optimization that keeps the first `initialNumToRender` items
   * always rendered and immediately renders the items starting at this initial index. Requires
   * `getItemLayout` to be implemented.
   */
  initialScrollIndex?: number | null;

  /**
   * Reverses the direction of scroll. Uses scale transforms of -1.
   */
  inverted?: boolean | null;

  keyExtractor?: (item: ItemT, index: number) => string;

  listKey?: string;

  /**
   * The maximum number of items to render in each incremental render batch. The more rendered at
   * once, the better the fill rate, but responsiveness my suffer because rendering content may
   * interfere with responding to button taps or other interactions.
   */
  maxToRenderPerBatch?: number;

  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;

  onEndReachedThreshold?: number | null;

  onLayout?: (event: LayoutChangeEvent) => void;

  /**
   * If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make
   * sure to also set the `refreshing` prop correctly.
   */
  onRefresh?: (() => void) | null;

  /**
   * Used to handle failures when scrolling to an index that has not been measured yet.
   * Recommended action is to either compute your own offset and `scrollTo` it, or scroll as far
   * as possible and then try again after more items have been rendered.
   */
  onScrollToIndexFailed?: (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => void;

  /**
   * Called when the viewability of rows changes, as defined by the
   * `viewabilityConfig` prop.
   */
  onViewableItemsChanged?: ((info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => void) | null;

  /**
   * Set this when offset is needed for the loading indicator to show correctly.
   * @platform android
   */
  progressViewOffset?: number;

  /**
   * Set this true while waiting for new data from a refresh.
   */
  refreshing?: boolean | null;

  /**
   * Note: may have bugs (missing content) in some circumstances - use at your own risk.
   *
   * This may improve scroll performance for large lists.
   */
  removeClippedSubviews?: boolean;

  /**
   * Render a custom scroll component, e.g. with a differently styled `RefreshControl`.
   */
  renderScrollComponent?: (props: ScrollViewProps) => React.ReactElement<ScrollViewProps>;

  /**
   * Amount of time between low-pri item render batches, e.g. for rendering items quite a ways off
   * screen. Similar fill rate/responsiveness tradeoff as `maxToRenderPerBatch`.
   */
  updateCellsBatchingPeriod?: number;

  viewabilityConfig?: ViewabilityConfig;

  viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs;

  /**
   * Determines the maximum number of items rendered outside of the visible area, in units of
   * visible lengths. So if your list fills the screen, then `windowSize={21}` (the default) will
   * render the visible screen area plus up to 10 screens above and 10 below the viewport. Reducing
   * this number will reduce memory consumption and may improve performance, but will increase the
   * chance that fast scrolling may reveal momentary blank areas of unrendered content.
   */
  windowSize?: number;
}

/**
 * @see https://facebook.github.io/react-native/docs/listview.html#props
 */
export interface ListViewProps extends ScrollViewProps {
  /**
   * An instance of [ListView.DataSource](docs/listviewdatasource.html) to use
   */
  dataSource: ListViewDataSource;

  /**
   * Flag indicating whether empty section headers should be rendered.
   * In the future release empty section headers will be rendered by
   * default, and the flag will be deprecated. If empty sections are not
   * desired to be rendered their indices should be excluded from
   * sectionID object.
   */
  enableEmptySections?: boolean;

  /**
   * How many rows to render on initial component mount.  Use this to make
   * it so that the first screen worth of data apears at one time instead of
   * over the course of multiple frames.
   */
  initialListSize?: number;

  /**
   * (visibleRows, changedRows) => void
   *
   * Called when the set of visible rows changes.  `visibleRows` maps
   * { sectionID: { rowID: true }} for all the visible rows, and
   * `changedRows` maps { sectionID: { rowID: true | false }} for the rows
   * that have changed their visibility, with true indicating visible, and
   * false indicating the view has moved out of view.
   */
  onChangeVisibleRows?: (
    visibleRows: Array<{ [sectionId: string]: { [rowID: string]: boolean } }>,
    changedRows: Array<{ [sectionId: string]: { [rowID: string]: boolean } }>
  ) => void;

  /**
   * Called when all rows have been rendered and the list has been scrolled
   * to within onEndReachedThreshold of the bottom.  The native scroll
   * event is provided.
   */
  onEndReached?: () => void;

  /**
   * Threshold in pixels for onEndReached.
   */
  onEndReachedThreshold?: number;

  /**
   * Number of rows to render per event loop.
   */
  pageSize?: number;

  /**
   * A performance optimization for improving scroll perf of
   * large lists, used in conjunction with overflow: 'hidden' on the row
   * containers.  Use at your own risk.
   */
  removeClippedSubviews?: boolean;

  /**
   * () => renderable
   *
   * The header and footer are always rendered (if these props are provided)
   * on every render pass.  If they are expensive to re-render, wrap them
   * in StaticContainer or other mechanism as appropriate.  Footer is always
   * at the bottom of the list, and header at the top, on every render pass.
   */
  renderFooter?: () => React.ReactElement;

  /**
   * () => renderable
   *
   * The header and footer are always rendered (if these props are provided)
   * on every render pass.  If they are expensive to re-render, wrap them
   * in StaticContainer or other mechanism as appropriate.  Footer is always
   * at the bottom of the list, and header at the top, on every render pass.
   */
  renderHeader?: () => React.ReactElement;

  /**
   * (rowData, sectionID, rowID) => renderable
   * Takes a data entry from the data source and its ids and should return
   * a renderable component to be rendered as the row.  By default the data
   * is exactly what was put into the data source, but it's also possible to
   * provide custom extractors.
   */
  renderRow: (
    rowData: any,
    sectionID: string | number,
    rowID: string | number,
    highlightRow?: boolean
  ) => React.ReactElement;

  /**
   * A function that returns the scrollable component in which the list rows are rendered.
   * Defaults to returning a ScrollView with the given props.
   */
  renderScrollComponent?: (props: ScrollViewProps) => React.ReactElement<ScrollViewProps>;

  /**
   * (sectionData, sectionID) => renderable
   *
   * If provided, a sticky header is rendered for this section.  The sticky
   * behavior means that it will scroll with the content at the top of the
   * section until it reaches the top of the screen, at which point it will
   * stick to the top until it is pushed off the screen by the next section
   * header.
   */
  renderSectionHeader?: (sectionData: any, sectionId: string | number) => React.ReactElement;

  /**
   * (sectionID, rowID, adjacentRowHighlighted) => renderable
   * If provided, a renderable component to be rendered as the separator below each row
   * but not the last row if there is a section header below.
   * Take a sectionID and rowID of the row above and whether its adjacent row is highlighted.
   */
  renderSeparator?: (
    sectionID: string | number,
    rowID: string | number,
    adjacentRowHighlighted?: boolean
  ) => React.ReactElement;

  /**
   * How early to start rendering rows before they come on screen, in
   * pixels.
   */
  scrollRenderAheadDistance?: number;

  /**
   * An array of child indices determining which children get docked to the
   * top of the screen when scrolling. For example, passing
   * `stickyHeaderIndices={[0]}` will cause the first child to be fixed to the
   * top of the scroll view. This property is not supported in conjunction
   * with `horizontal={true}`.
   * @platform ios
   */
  stickyHeaderIndices?: number[];

  /**
   * Makes the sections headers sticky. The sticky behavior means that it will scroll with the
   * content at the top of the section until it reaches the top of the screen, at which point it
   * will stick to the top until it is pushed off the screen by the next section header. This
   * property is not supported in conjunction with `horizontal={true}`. Only enabled by default
   * on iOS because of typical platform standards.
   */
  stickySectionHeadersEnabled?: boolean;
}

interface TimerMixin {
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
  setImmediate: typeof setImmediate;
  clearImmediate: typeof clearImmediate;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
}

declare class ListViewComponent extends React.Component<ListViewProps> {}
declare const ListViewBase: Constructor<ScrollResponderMixin> & Constructor<TimerMixin> & typeof ListViewComponent;
export class ListView extends ListViewBase {
  static DataSource: ListViewDataSource;

  /**
   * Exports some data, e.g. for perf investigations or analytics.
   */
  getMetrics: () => {
    contentLength: number;
    totalRows: number;
    renderedRows: number;
    visibleRows: number;
  };

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder: () => any;

  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   *
   * See `ScrollView#scrollTo`.
   */
  scrollTo: (y?: number | { x?: number; y?: number; animated?: boolean }, x?: number, animated?: boolean) => void;
}

/**
 * @see https://facebook.github.io/react-native/docs/maskedviewios.html
 */
declare class MaskedViewComponent extends React.Component<ViewProps> {}
declare const MaskedViewBase: Constructor<NativeMethodsMixin> & typeof MaskedViewComponent;

export interface ModalBaseProps {
  /**
   * @deprecated Use animationType instead
   */
  animated?: boolean;
  /**
   * The `animationType` prop controls how the modal animates.
   *
   * - `slide` slides in from the bottom
   * - `fade` fades into view
   * - `none` appears without an animation
   */
  animationType?: 'none' | 'slide' | 'fade';
  /**
   * The `transparent` prop determines whether your modal will fill the entire view.
   * Setting this to `true` will render the modal over a transparent background.
   */
  transparent?: boolean;
  /**
   * The `visible` prop determines whether your modal is visible.
   */
  visible?: boolean;
  /**
   * The `onRequestClose` prop allows passing a function that will be called once the modal has been dismissed.
   * _On the Android platform, this is a required function._
   */
  onRequestClose?: () => void;
  /**
   * The `onShow` prop allows passing a function that will be called once the modal has been shown.
   */
  onShow?: (event: NativeSyntheticEvent<any>) => void;
}

export type ModalProps = ModalBaseProps;

export class Modal extends React.Component<ModalProps> {}

/**
 * @see https://github.com/facebook/react-native/blob/0.34-stable\Libraries\Components\Touchable\Touchable.js
 */
interface TouchableMixin {
  /**
   * Invoked when the item should be highlighted. Mixers should implement this
   * to visually distinguish the `VisualRect` so that the user knows that
   * releasing a touch will result in a "selection" (analog to click).
   */
  touchableHandleActivePressIn(e: GestureResponderEvent): void;

  /**
   * Invoked when the item is "active" (in that it is still eligible to become
   * a "select") but the touch has left the `PressRect`. Usually the mixer will
   * want to unhighlight the `VisualRect`. If the user (while pressing) moves
   * back into the `PressRect` `touchableHandleActivePressIn` will be invoked
   * again and the mixer should probably highlight the `VisualRect` again. This
   * event will not fire on an `touchEnd/mouseUp` event, only move events while
   * the user is depressing the mouse/touch.
   */
  touchableHandleActivePressOut(e: GestureResponderEvent): void;

  /**
   * Invoked when the item is "selected" - meaning the interaction ended by
   * letting up while the item was either in the state
   * `RESPONDER_ACTIVE_PRESS_IN` or `RESPONDER_INACTIVE_PRESS_IN`.
   */
  touchableHandlePress(e: GestureResponderEvent): void;

  /**
   * Invoked when the item is long pressed - meaning the interaction ended by
   * letting up while the item was in `RESPONDER_ACTIVE_LONG_PRESS_IN`. If
   * `touchableHandleLongPress` is *not* provided, `touchableHandlePress` will
   * be called as it normally is. If `touchableHandleLongPress` is provided, by
   * default any `touchableHandlePress` callback will not be invoked. To
   * override this default behavior, override `touchableLongPressCancelsPress`
   * to return false. As a result, `touchableHandlePress` will be called when
   * lifting up, even if `touchableHandleLongPress` has also been called.
   */
  touchableHandleLongPress(e: GestureResponderEvent): void;

  /**
   * Returns the amount to extend the `HitRect` into the `PressRect`. Positive
   * numbers mean the size expands outwards.
   */
  touchableGetPressRectOffset(): Insets;

  /**
   * Returns the number of millis to wait before triggering a highlight.
   */
  touchableGetHighlightDelayMS(): number;

  // These methods are undocumented but still being used by TouchableMixin internals
  touchableGetLongPressDelayMS(): number;
  touchableGetPressOutDelayMS(): number;
  touchableGetHitSlop(): Insets;
}

/**
 * @see https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html#props
 */
export interface TouchableWithoutFeedbackProps extends ViewProps, AccessibilityProps {
  /**
   * Delay in ms, from onPressIn, before onLongPress is called.
   */
  delayLongPress?: number;

  /**
   * Delay in ms, from the start of the touch, before onPressIn is called.
   */
  delayPressIn?: number;

  /**
   * Delay in ms, from the release of the touch, before onPressOut is called.
   */
  delayPressOut?: number;

  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean;

  /**
   * This defines how far your touch can start away from the button.
   * This is added to pressRetentionOffset when moving off of the button.
   * NOTE The touch area never extends past the parent view bounds and
   * the Z-index of sibling views always takes precedence if a touch hits
   * two overlapping views.
   */
  hitSlop?: Insets;

  /**
   * When `accessible` is true (which is the default) this may be called when
   * the OS-specific concept of "blur" occurs, meaning the element lost focus.
   * Some platforms may not have the concept of blur.
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;

  /**
   * When `accessible` is true (which is the default) this may be called when
   * the OS-specific concept of "focus" occurs. Some platforms may not have
   * the concept of focus.
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;

  /**
   * Invoked on mount and layout changes with
   * {nativeEvent: {layout: {x, y, width, height}}}
   */
  onLayout?: (event: LayoutChangeEvent) => void;

  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * Called when the touch is released,
   * but not if cancelled (e.g. by a scroll that steals the responder lock).
   */
  onPress?: (event: GestureResponderEvent) => void;

  onPressIn?: (event: GestureResponderEvent) => void;

  onPressOut?: (event: GestureResponderEvent) => void;

  /**
   * //FIXME: not in doc but available in examples
   */
  style?: StyleProp<ViewStyle>;

  /**
   * When the scroll view is disabled, this defines how far your
   * touch may move off of the button, before deactivating the button.
   * Once deactivated, try moving it back and you'll see that the button
   * is once again reactivated! Move it back and forth several times
   * while the scroll view is disabled. Ensure you pass in a constant
   * to reduce memory allocations.
   */
  pressRetentionOffset?: Insets;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;
}

/**
 * Do not use unless you have a very good reason.
 * All the elements that respond to press should have a visual feedback when touched.
 * This is one of the primary reason a "web" app doesn't feel "native".
 *
 * @see https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html
 */
declare class TouchableWithoutFeedbackComponent extends React.Component<TouchableWithoutFeedbackProps> {}
declare const TouchableWithoutFeedbackBase: Constructor<TimerMixin> &
  Constructor<TouchableMixin> &
  typeof TouchableWithoutFeedbackComponent;
export class TouchableWithoutFeedback extends TouchableWithoutFeedbackBase {}

/**
 * @see https://facebook.github.io/react-native/docs/touchablehighlight.html#props
 */
export interface TouchableHighlightProps extends TouchableWithoutFeedbackProps {
  /**
   * Determines what the opacity of the wrapped view should be when touch is active.
   */
  activeOpacity?: number;

  /**
   *
   * Called immediately after the underlay is hidden
   */
  onHideUnderlay?: () => void;

  /**
   * Called immediately after the underlay is shown
   */
  onShowUnderlay?: () => void;

  /**
   * @see https://facebook.github.io/react-native/docs/view.html#style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * The color of the underlay that will show through when the touch is active.
   */
  underlayColor?: string;
}

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased,
 * which allows the underlay color to show through, darkening or tinting the view.
 * The underlay comes from adding a view to the view hierarchy,
 * which can sometimes cause unwanted visual artifacts if not used correctly,
 * for example if the backgroundColor of the wrapped view isn't explicitly set to an opaque color.
 *
 * NOTE: TouchableHighlight supports only one child
 * If you wish to have several child components, wrap them in a View.
 *
 * @see https://facebook.github.io/react-native/docs/touchablehighlight.html
 */
declare class TouchableHighlightComponent extends React.Component<TouchableHighlightProps> {}
declare const TouchableHighlightBase: Constructor<NativeMethodsMixin> &
  Constructor<TimerMixin> &
  Constructor<TouchableMixin> &
  typeof TouchableHighlightComponent;
export class TouchableHighlight extends TouchableHighlightBase {}

/**
 * @see https://facebook.github.io/react-native/docs/touchableopacity.html#props
 */
export interface TouchableOpacityProps extends TouchableWithoutFeedbackProps {
  /**
   * Determines what the opacity of the wrapped view should be when touch is active.
   * Defaults to 0.2
   */
  activeOpacity?: number;
  pointerEvents?: 'box-only' | 'none';
}

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy,
 * and in general is easy to add to an app without weird side-effects.
 *
 * @see https://facebook.github.io/react-native/docs/touchableopacity.html
 */
declare class TouchableOpacityComponent extends React.Component<TouchableOpacityProps> {}
declare const TouchableOpacityBase: Constructor<TimerMixin> &
  Constructor<TouchableMixin> &
  Constructor<NativeMethodsMixin> &
  typeof TouchableOpacityComponent;
export class TouchableOpacity extends TouchableOpacityBase {
  /**
   * Animate the touchable to a new opacity.
   */
  setOpacityTo: (value: number) => void;
}

interface BaseBackgroundPropType {
  type: string;
}

interface RippleBackgroundPropType extends BaseBackgroundPropType {
  type: 'RippleAndroid';
  color?: number;
  borderless?: boolean;
}

interface ThemeAttributeBackgroundPropType extends BaseBackgroundPropType {
  type: 'ThemeAttrAndroid';
  attribute: string;
}

type BackgroundPropType = RippleBackgroundPropType | ThemeAttributeBackgroundPropType;

/**
 * @see https://facebook.github.io/react-native/docs/touchableopacity.html#props
 */
export interface TouchableNativeFeedbackProps extends TouchableWithoutFeedbackProps {
  /**
   * Determines the type of background drawable that's going to be used to display feedback.
   * It takes an object with type property and extra data depending on the type.
   * It's recommended to use one of the following static methods to generate that dictionary:
   *      1) TouchableNativeFeedback.SelectableBackground() - will create object that represents android theme's
   *         default background for selectable elements (?android:attr/selectableItemBackground)
   *      2) TouchableNativeFeedback.SelectableBackgroundBorderless() - will create object that represent android
   *         theme's default background for borderless selectable elements
   *         (?android:attr/selectableItemBackgroundBorderless). Available on android API level 21+
   *      3) TouchableNativeFeedback.Ripple(color, borderless) - will create object that represents ripple drawable
   *         with specified color (as a string). If property borderless evaluates to true the ripple will render
   *         outside of the view bounds (see native actionbar buttons as an example of that behavior). This background
   *         type is available on Android API level 21+
   */
  background?: BackgroundPropType;
  useForeground?: boolean;
}

/**
 * A wrapper for making views respond properly to touches (Android only).
 * On Android this component uses native state drawable to display touch feedback.
 * At the moment it only supports having a single View instance as a child node,
 * as it's implemented by replacing that View with another instance of RCTView node with some additional properties set.
 *
 * Background drawable of native feedback touchable can be customized with background property.
 *
 * @see https://facebook.github.io/react-native/docs/touchablenativefeedback.html#content
 */
declare class TouchableNativeFeedbackComponent extends React.Component<TouchableNativeFeedbackProps> {}
declare const TouchableNativeFeedbackBase: Constructor<TouchableMixin> & typeof TouchableNativeFeedbackComponent;
export class TouchableNativeFeedback extends TouchableNativeFeedbackBase {
  /**
   * Creates an object that represents android theme's default background for
   * selectable elements (?android:attr/selectableItemBackground).
   */
  static SelectableBackground(): ThemeAttributeBackgroundPropType;

  /**
   * Creates an object that represent android theme's default background for borderless
   * selectable elements (?android:attr/selectableItemBackgroundBorderless).
   * Available on android API level 21+.
   */
  static SelectableBackgroundBorderless(): ThemeAttributeBackgroundPropType;

  /**
   * Creates an object that represents ripple drawable with specified color (as a
   * string). If property `borderless` evaluates to true the ripple will
   * render outside of the view bounds (see native actionbar buttons as an
   * example of that behavior). This background type is available on Android
   * API level 21+.
   *
   * @param color The ripple color
   * @param borderless If the ripple can render outside it's bounds
   */
  static Ripple(color: string, borderless?: boolean): RippleBackgroundPropType;
  static canUseNativeForeground(): boolean;
}

export interface Route {
  component?: React.ComponentType<any>;
  id?: string;
  title?: string;
  passProps?: Object;

  //anything else
  [key: string]: any;

  //Commonly found properties
  backButtonTitle?: string;
  content?: string;
  message?: string;
  index?: number;
  onRightButtonPress?: () => void;
  rightButtonTitle?: string;
  wrapperStyle?: any;
}

interface InteractionMixin {
  createInteractionHandle(): number;
  clearInteractionHandle(clearHandle: number): void;
  /**
   * Schedule work for after all interactions have completed.
   *
   */
  runAfterInteractions(callback: () => any): void;
}

interface SubscribableMixin {
  /**
   * Special form of calling `addListener` that *guarantees* that a
   * subscription *must* be tied to a component instance, and therefore will
   * be cleaned up when the component is unmounted. It is impossible to create
   * the subscription and pass it in - this method must be the one to create
   * the subscription and therefore can guarantee it is retained in a way that
   * will be cleaned up.
   *
   * @param eventEmitter emitter to subscribe to.
   * @param eventType Type of event to listen to.
   * @param listener Function to invoke when event occurs.
   * @param context Object to use as listener context.
   */
  addListenerOn(eventEmitter: any, eventType: string, listener: () => any, context: any): void;
}

// @see https://github.com/facebook/react-native/blob/0.34-stable\Libraries\StyleSheet\StyleSheetTypes.js
export namespace StyleSheet {
  type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle | SvgStyle | TableStyle };

  /**
   * Creates a StyleSheet style reference from the given object.
   */
  export function create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>): T;

  /**
   * Flattens an array of style objects, into one aggregated style object.
   * Alternatively, this method can be used to lookup IDs, returned by
   * StyleSheet.register.
   *
   * > **NOTE**: Exercise caution as abusing this can tax you in terms of
   * > optimizations.
   * >
   * > IDs enable optimizations through the bridge and memory in general. Refering
   * > to style objects directly will deprive you of these optimizations.
   *
   * Example:
   * ```
   * const styles = StyleSheet.create({
   *   listItem: {
   *     flex: 1,
   *     fontSize: 16,
   *     color: 'white'
   *   },
   *   selectedListItem: {
   *     color: 'green'
   *   }
   * });
   *
   * StyleSheet.flatten([styles.listItem, styles.selectedListItem])
   * // returns { flex: 1, fontSize: 16, color: 'green' }
   * ```
   * Alternative use:
   * ```
   * StyleSheet.flatten(styles.listItem);
   * // return { flex: 1, fontSize: 16, color: 'white' }
   * // Simply styles.listItem would return its ID (number)
   * ```
   * This method internally uses `StyleSheetRegistry.getStyleByID(style)`
   * to resolve style objects represented by IDs. Thus, an array of style
   * objects (instances of StyleSheet.create), are individually resolved to,
   * their respective objects, merged as one and then returned. This also explains
   * the alternative use.
   */
  export function flatten<T>(style?: StyleProp<T>): T;

  /**
   * Combines two styles such that style2 will override any styles in style1.
   * If either style is falsy, the other one is returned without allocating
   * an array, saving allocations and maintaining reference equality for
   * PureComponent checks.
   */
  export function compose<T>(
    style1: StyleProp<T> | Array<StyleProp<T>>,
    style2: StyleProp<T> | Array<StyleProp<T>>
  ): StyleProp<T>;

  /**
   * WARNING: EXPERIMENTAL. Breaking changes will probably happen a lot and will
   * not be reliably announced. The whole thing might be deleted, who knows? Use
   * at your own risk.
   *
   * Sets a function to use to pre-process a style property value. This is used
   * internally to process color and transform values. You should not use this
   * unless you really know what you are doing and have exhausted other options.
   */
  export function setStyleAttributePreprocessor(property: string, process: (nextProp: any) => any): void;

  /**
   * This is defined as the width of a thin line on the platform. It can be
   * used as the thickness of a border or division between two elements.
   * Example:
   * ```
   *   {
   *     borderBottomColor: '#bbb',
   *     borderBottomWidth: StyleSheet.hairlineWidth
   *   }
   * ```
   *
   * This constant will always be a round number of pixels (so a line defined
   * by it look crisp) and will try to match the standard width of a thin line
   * on the underlying platform. However, you should not rely on it being a
   * constant size, because on different platforms and screen densities its
   * value may be calculated differently.
   */
  export const hairlineWidth: number;

  interface AbsoluteFillStyle {
    position: 'absolute';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  /**
   * Sometimes you may want `absoluteFill` but with a couple tweaks - `absoluteFillObject` can be
   * used to create a customized entry in a `StyleSheet`, e.g.:
   *
   *   const styles = StyleSheet.create({
   *     wrapper: {
   *       ...StyleSheet.absoluteFillObject,
   *       top: 10,
   *       backgroundColor: 'transparent',
   *     },
   *   });
   */
  export const absoluteFillObject: AbsoluteFillStyle;

  /**
   * A very common pattern is to create overlays with position absolute and zero positioning,
   * so `absoluteFill` can be used for convenience and to reduce duplication of these repeated
   * styles.
   */
  export const absoluteFill: RegisteredStyle<AbsoluteFillStyle>;
}

export interface RelayProfiler {
  attachProfileHandler(name: string, handler: (name: string, state?: any) => () => void): void;

  attachAggregateHandler(name: string, handler: (name: string, callback: () => void) => void): void;
}

export interface SystraceStatic {
  setEnabled(enabled: boolean): void;

  /**
   * beginEvent/endEvent for starting and then ending a profile within the same call stack frame
   **/
  beginEvent(profileName?: any, args?: any): void;
  endEvent(): void;

  /**
   * beginAsyncEvent/endAsyncEvent for starting and then ending a profile where the end can either
   * occur on another thread or out of the current stack frame, eg await
   * the returned cookie variable should be used as input into the endAsyncEvent call to end the profile
   **/
  beginAsyncEvent(profileName?: any): any;
  endAsyncEvent(profileName?: any, cookie?: any): void;

  /**
   * counterEvent registers the value to the profileName on the systrace timeline
   **/
  counterEvent(profileName?: any, value?: any): void;

  /**
   * Relay profiles use await calls, so likely occur out of current stack frame
   * therefore async variant of profiling is used
   **/
  attachToRelayProfiler(relayProfiler: RelayProfiler): void;

  /* This is not called by default due to perf overhead but it's useful
        if you want to find traces which spend too much time in JSON. */
  swizzleJSON(): void;

  /**
   * Measures multiple methods of a class. For example, you can do:
   * Systrace.measureMethods(JSON, 'JSON', ['parse', 'stringify']);
   *
   * @param methodNames Map from method names to method display names.
   */
  measureMethods(object: any, objectName: string, methodNames: Array<string>): void;

  /**
   * Returns an profiled version of the input function. For example, you can:
   * JSON.parse = Systrace.measure('JSON', 'parse', JSON.parse);
   *
   * @return replacement function
   */
  measure<T extends Function>(objName: string, fnName: string, func: T): T;
}

/**
 * //FIXME: Could not find docs. Inferred from examples and jscode : ListViewDataSource.js
 */
export interface DataSourceAssetCallback {
  rowHasChanged?: (r1: any, r2: any) => boolean;
  sectionHeaderHasChanged?: (h1: any, h2: any) => boolean;
  getRowData?: (dataBlob: any, sectionID: number | string, rowID: number | string) => any;
  getSectionHeaderData?: (dataBlob: any, sectionID: number | string) => any;
}

/**
 * Provides efficient data processing and access to the
 * `ListView` component.  A `ListViewDataSource` is created with functions for
 * extracting data from the input blob, and comparing elements (with default
 * implementations for convenience).  The input blob can be as simple as an
 * array of strings, or an object with rows nested inside section objects.
 *
 * To update the data in the datasource, use `cloneWithRows` (or
 * `cloneWithRowsAndSections` if you care about sections).  The data in the
 * data source is immutable, so you can't modify it directly.  The clone methods
 * suck in the new data and compute a diff for each row so ListView knows
 * whether to re-render it or not.
 */
export interface ListViewDataSource {
  /**
   * You can provide custom extraction and `hasChanged` functions for section
   * headers and rows.  If absent, data will be extracted with the
   * `defaultGetRowData` and `defaultGetSectionHeaderData` functions.
   *
   * The default extractor expects data of one of the following forms:
   *
   *      { sectionID_1: { rowID_1: <rowData1>, ... }, ... }
   *
   *    or
   *
   *      { sectionID_1: [ <rowData1>, <rowData2>, ... ], ... }
   *
   *    or
   *
   *      [ [ <rowData1>, <rowData2>, ... ], ... ]
   *
   * The constructor takes in a params argument that can contain any of the
   * following:
   *
   * - getRowData(dataBlob, sectionID, rowID);
   * - getSectionHeaderData(dataBlob, sectionID);
   * - rowHasChanged(prevRowData, nextRowData);
   * - sectionHeaderHasChanged(prevSectionData, nextSectionData);
   */
  new (onAsset: DataSourceAssetCallback): ListViewDataSource;

  /**
   * Clones this `ListViewDataSource` with the specified `dataBlob` and
   * `rowIdentities`. The `dataBlob` is just an aribitrary blob of data. At
   * construction an extractor to get the interesting informatoin was defined
   * (or the default was used).
   *
   * The `rowIdentities` is is a 2D array of identifiers for rows.
   * ie. [['a1', 'a2'], ['b1', 'b2', 'b3'], ...].  If not provided, it's
   * assumed that the keys of the section data are the row identities.
   *
   * Note: This function does NOT clone the data in this data source. It simply
   * passes the functions defined at construction to a new data source with
   * the data specified. If you wish to maintain the existing data you must
   * handle merging of old and new data separately and then pass that into
   * this function as the `dataBlob`.
   */
  cloneWithRows(
    dataBlob: Array<any> | { [key: string]: any },
    rowIdentities?: Array<string | number>
  ): ListViewDataSource;

  /**
   * This performs the same function as the `cloneWithRows` function but here
   * you also specify what your `sectionIdentities` are. If you don't care
   * about sections you should safely be able to use `cloneWithRows`.
   *
   * `sectionIdentities` is an array of identifiers for  sections.
   * ie. ['s1', 's2', ...].  If not provided, it's assumed that the
   * keys of dataBlob are the section identities.
   *
   * Note: this returns a new object!
   */
  cloneWithRowsAndSections(
    dataBlob: Array<any> | { [key: string]: any },
    sectionIdentities?: Array<string | number>,
    rowIdentities?: Array<Array<string | number>>
  ): ListViewDataSource;

  getRowCount(): number;
  getRowAndSectionCount(): number;

  /**
   * Returns if the row is dirtied and needs to be rerendered
   */
  rowShouldUpdate(sectionIndex: number, rowIndex: number): boolean;

  /**
   * Gets the data required to render the row.
   */
  getRowData(sectionIndex: number, rowIndex: number): any;

  /**
   * Gets the rowID at index provided if the dataSource arrays were flattened,
   * or null of out of range indexes.
   */
  getRowIDForFlatIndex(index: number): string;

  /**
   * Gets the sectionID at index provided if the dataSource arrays were flattened,
   * or null for out of range indexes.
   */
  getSectionIDForFlatIndex(index: number): string;

  /**
   * Returns an array containing the number of rows in each section
   */
  getSectionLengths(): Array<number>;

  /**
   * Returns if the section header is dirtied and needs to be rerendered
   */
  sectionHeaderShouldUpdate(sectionIndex: number): boolean;

  /**
   * Gets the data required to render the section header
   */
  getSectionHeaderData(sectionIndex: number): any;
}

export interface PixelRatioStatic {
  /*
        Returns the device pixel density. Some examples:
            PixelRatio.get() === 1
            mdpi Android devices (160 dpi)
            PixelRatio.get() === 1.5
            hdpi Android devices (240 dpi)
            PixelRatio.get() === 2
            iPhone 4, 4S
            iPhone 5, 5c, 5s
            iPhone 6
            xhdpi Android devices (320 dpi)
            PixelRatio.get() === 3
            iPhone 6 plus
            xxhdpi Android devices (480 dpi)
            PixelRatio.get() === 3.5
            Nexus 6
    */
  get(): number;

  /*
        Returns the scaling factor for font sizes. This is the ratio that is
        used to calculate the absolute font size, so any elements that
        heavily depend on that should use this to do calculations.

        If a font scale is not set, this returns the device pixel ratio.

        Currently this is only implemented on Android and reflects the user
        preference set in Settings > Display > Font size,
        on iOS it will always return the default pixel ratio.
        */
  getFontScale(): number;

  /**
   * Converts a layout size (dp) to pixel size (px).
   * Guaranteed to return an integer number.
   */
  getPixelSizeForLayoutSize(layoutSize: number): number;

  /**
   * Rounds a layout size (dp) to the nearest layout size that
   * corresponds to an integer number of pixels. For example,
   * on a device with a PixelRatio of 3,
   * PixelRatio.roundToNearestPixel(8.4) = 8.33,
   * which corresponds to exactly (8.33 * 3) = 25 pixels.
   */
  roundToNearestPixel(layoutSize: number): number;

  /**
   * No-op for iOS, but used on the web. Should not be documented. [sic]
   */
  startDetecting(): void;
}

/**
 * @see https://facebook.github.io/react-native/docs/platform-specific-code.html#content
 */
export type PlatformOSType = 'ios' | 'android' | 'macos' | 'windows' | 'web';

interface PlatformStatic {
  isTV: boolean;
  Version: number | string;

  /**
   * @see https://facebook.github.io/react-native/docs/platform-specific-code.html#content
   */
  select<T>(
    specifics: ({ [platform in PlatformOSType]?: T } & { default: T }) | { [platform in PlatformOSType]: T }
  ): T;
  select<T>(specifics: { [platform in PlatformOSType]?: T }): T | undefined;
}

interface PlatformIOSStatic extends PlatformStatic {
  OS: 'ios';
  isPad: boolean;
  isTVOS: boolean;
}

interface PlatformAndroidStatic extends PlatformStatic {
  OS: 'android';
}

interface PlatformMacOSStatic extends PlatformStatic {
  OS: 'macos';
}

interface PlatformWindowsOSStatic extends PlatformStatic {
  OS: 'windows';
}

interface PlatformWebStatic extends PlatformStatic {
  OS: 'web';
}

/**
 * Deprecated - subclass NativeEventEmitter to create granular event modules instead of
 * adding all event listeners directly to RCTDeviceEventEmitter.
 */
interface DeviceEventEmitterStatic extends EventEmitter {
  sharedSubscriber: EventSubscriptionVendor;
  new (): DeviceEventEmitterStatic;
  addListener(type: string, listener: (data: any) => void, context?: any): EmitterSubscription;
}

// Used by Dimensions below
export interface ScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

/**
 * Initial dimensions are set before `runApplication` is called so they should
 * be available before any other require's are run, but may be updated later.
 *
 * Note: Although dimensions are available immediately, they may change (e.g
 * due to device rotation) so any rendering logic or styles that depend on
 * these constants should try to call this function on every render, rather
 * than caching the value (for example, using inline styles rather than
 * setting a value in a `StyleSheet`).
 *
 * Example: `const {height, width} = Dimensions.get('window');`
 *
 * @param dim Name of dimension as defined when calling `set`.
 * @returns Value for the dimension.
 * @see https://facebook.github.io/react-native/docs/dimensions.html#content
 */
export interface Dimensions {
  /**
     * Initial dimensions are set before runApplication is called so they
     * should be available before any other require's are run, but may be
     * updated later.
     * Note: Although dimensions are available immediately, they may
     * change (e.g due to device rotation) so any rendering logic or
     * styles that depend on these constants should try to call this
     * function on every render, rather than caching the value (for
     * example, using inline styles rather than setting a value in a
     * StyleSheet).
     * Example: const {height, width} = Dimensions.get('window');
     @param dim Name of dimension as defined when calling set.
     @returns Value for the dimension.
     */
  get(dim: 'window' | 'screen'): ScaledSize;

  /**
   * This should only be called from native code by sending the didUpdateDimensions event.
   * @param dims Simple string-keyed object of dimensions to set
   */
  set(dims: { [key: string]: any }): void;

  /**
   * Add an event listener for dimension changes
   *
   * @param type the type of event to listen to
   * @param handler the event handler
   */
  addEventListener(
    type: 'change',
    handler: ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => void
  ): void;

  /**
   * Remove an event listener
   *
   * @param type the type of event
   * @param handler the event handler
   */
  removeEventListener(
    type: 'change',
    handler: ({ window, screen }: { window: ScaledSize; screen: ScaledSize }) => void
  ): void;
}

export function useWindowDimensions(): ScaledSize;

export type SimpleTask = {
  name: string;
  gen: () => void;
};
export type PromiseTask = {
  name: string;
  gen: () => Promise<any>;
};

export type Handle = number;

export interface InteractionManagerStatic extends EventEmitterListener {
  Events: {
    interactionStart: string;
    interactionComplete: string;
  };

  /**
   * Schedule a function to run after all interactions have completed.
   * Returns a cancellable
   */
  runAfterInteractions(
    task?: (() => any) | SimpleTask | PromiseTask
  ): {
    then: (onfulfilled?: () => any, onrejected?: () => any) => Promise<any>;
    done: (...args: any[]) => any;
    cancel: () => void;
  };

  /**
   * Notify manager that an interaction has started.
   */
  createInteractionHandle(): Handle;

  /**
   * Notify manager that an interaction has completed.
   */
  clearInteractionHandle(handle: Handle): void;

  /**
   * A positive number will use setTimeout to schedule any tasks after
   * the eventLoopRunningTime hits the deadline value, otherwise all
   * tasks will be executed in one setImmediate batch (default).
   */
  setDeadline(deadline: number): void;
}

export interface ScrollResponderEvent extends NativeSyntheticEvent<NativeTouchEvent> {}

interface ScrollResponderMixin extends SubscribableMixin {
  /**
   * Invoke this from an `onScroll` event.
   */
  scrollResponderHandleScrollShouldSetResponder(): boolean;

  /**
   * Merely touch starting is not sufficient for a scroll view to become the
   * responder. Being the "responder" means that the very next touch move/end
   * event will result in an action/movement.
   *
   * Invoke this from an `onStartShouldSetResponder` event.
   *
   * `onStartShouldSetResponder` is used when the next move/end will trigger
   * some UI movement/action, but when you want to yield priority to views
   * nested inside of the view.
   *
   * There may be some cases where scroll views actually should return `true`
   * from `onStartShouldSetResponder`: Any time we are detecting a standard tap
   * that gives priority to nested views.
   *
   * - If a single tap on the scroll view triggers an action such as
   *   recentering a map style view yet wants to give priority to interaction
   *   views inside (such as dropped pins or labels), then we would return true
   *   from this method when there is a single touch.
   *
   * - Similar to the previous case, if a two finger "tap" should trigger a
   *   zoom, we would check the `touches` count, and if `>= 2`, we would return
   *   true.
   *
   */
  scrollResponderHandleStartShouldSetResponder(): boolean;

  /**
   * There are times when the scroll view wants to become the responder
   * (meaning respond to the next immediate `touchStart/touchEnd`), in a way
   * that *doesn't* give priority to nested views (hence the capture phase):
   *
   * - Currently animating.
   * - Tapping anywhere that is not the focused input, while the keyboard is
   *   up (which should dismiss the keyboard).
   *
   * Invoke this from an `onStartShouldSetResponderCapture` event.
   */
  scrollResponderHandleStartShouldSetResponderCapture(e: ScrollResponderEvent): boolean;

  /**
   * Invoke this from an `onResponderReject` event.
   *
   * Some other element is not yielding its role as responder. Normally, we'd
   * just disable the `UIScrollView`, but a touch has already began on it, the
   * `UIScrollView` will not accept being disabled after that. The easiest
   * solution for now is to accept the limitation of disallowing this
   * altogether. To improve this, find a way to disable the `UIScrollView` after
   * a touch has already started.
   */
  scrollResponderHandleResponderReject(): any;

  /**
   * We will allow the scroll view to give up its lock iff it acquired the lock
   * during an animation. This is a very useful default that happens to satisfy
   * many common user experiences.
   *
   * - Stop a scroll on the left edge, then turn that into an outer view's
   *   backswipe.
   * - Stop a scroll mid-bounce at the top, continue pulling to have the outer
   *   view dismiss.
   * - However, without catching the scroll view mid-bounce (while it is
   *   motionless), if you drag far enough for the scroll view to become
   *   responder (and therefore drag the scroll view a bit), any backswipe
   *   navigation of a swipe gesture higher in the view hierarchy, should be
   *   rejected.
   */
  scrollResponderHandleTerminationRequest(): boolean;

  /**
   * Invoke this from an `onTouchEnd` event.
   *
   * @param e Event.
   */
  scrollResponderHandleTouchEnd(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onResponderRelease` event.
   */
  scrollResponderHandleResponderRelease(e: ScrollResponderEvent): void;

  scrollResponderHandleScroll(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onResponderGrant` event.
   */
  scrollResponderHandleResponderGrant(e: ScrollResponderEvent): void;

  /**
   * Unfortunately, `onScrollBeginDrag` also fires when *stopping* the scroll
   * animation, and there's not an easy way to distinguish a drag vs. stopping
   * momentum.
   *
   * Invoke this from an `onScrollBeginDrag` event.
   */
  scrollResponderHandleScrollBeginDrag(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onScrollEndDrag` event.
   */
  scrollResponderHandleScrollEndDrag(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onMomentumScrollBegin` event.
   */
  scrollResponderHandleMomentumScrollBegin(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onMomentumScrollEnd` event.
   */
  scrollResponderHandleMomentumScrollEnd(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onTouchStart` event.
   *
   * Since we know that the `SimpleEventPlugin` occurs later in the plugin
   * order, after `ResponderEventPlugin`, we can detect that we were *not*
   * permitted to be the responder (presumably because a contained view became
   * responder). The `onResponderReject` won't fire in that case - it only
   * fires when a *current* responder rejects our request.
   *
   * @param e Touch Start event.
   */
  scrollResponderHandleTouchStart(e: ScrollResponderEvent): void;

  /**
   * Invoke this from an `onTouchMove` event.
   *
   * Since we know that the `SimpleEventPlugin` occurs later in the plugin
   * order, after `ResponderEventPlugin`, we can detect that we were *not*
   * permitted to be the responder (presumably because a contained view became
   * responder). The `onResponderReject` won't fire in that case - it only
   * fires when a *current* responder rejects our request.
   *
   * @param e Touch Start event.
   */
  scrollResponderHandleTouchMove(e: ScrollResponderEvent): void;

  /**
   * A helper function for this class that lets us quickly determine if the
   * view is currently animating. This is particularly useful to know when
   * a touch has just started or ended.
   */
  scrollResponderIsAnimating(): boolean;

  /**
   * Returns the node that represents native view that can be scrolled.
   * Components can pass what node to use by defining a `getScrollableNode`
   * function otherwise `this` is used.
   */
  scrollResponderGetScrollableNode(): any;

  /**
   * A helper function to scroll to a specific point  in the scrollview.
   * This is currently used to help focus on child textviews, but can also
   * be used to quickly scroll to any element we want to focus. Syntax:
   *
   * scrollResponderScrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as an alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollResponderScrollTo(
    x?: number | { x?: number; y?: number; animated?: boolean },
    y?: number,
    animated?: boolean
  ): void;

  /**
   * A helper function to zoom to a specific rect in the scrollview. The argument has the shape
   * {x: number; y: number; width: number; height: number; animated: boolean = true}
   *
   * @platform ios
   */
  scrollResponderZoomTo(
    rect: { x: number; y: number; width: number; height: number; animated?: boolean },
    animated?: boolean // deprecated, put this inside the rect argument instead
  ): void;

  /**
   * This method should be used as the callback to onFocus in a TextInputs'
   * parent view. Note that any module using this mixin needs to return
   * the parent view's ref in getScrollViewRef() in order to use this method.
   * @param nodeHandle The TextInput node handle
   * @param additionalOffset The scroll view's top "contentInset".
   *        Default is 0.
   * @param preventNegativeScrolling Whether to allow pulling the content
   *        down to make it meet the keyboard's top. Default is false.
   */
  scrollResponderScrollNativeHandleToKeyboard(
    nodeHandle: any,
    additionalOffset?: number,
    preventNegativeScrollOffset?: boolean
  ): void;

  /**
   * The calculations performed here assume the scroll view takes up the entire
   * screen - even if has some content inset. We then measure the offsets of the
   * keyboard, and compensate both for the scroll view's "contentInset".
   *
   * @param left Position of input w.r.t. table view.
   * @param top Position of input w.r.t. table view.
   * @param width Width of the text input.
   * @param height Height of the text input.
   */
  scrollResponderInputMeasureAndScrollToKeyboard(left: number, top: number, width: number, height: number): void;

  scrollResponderTextInputFocusError(e: ScrollResponderEvent): void;

  /**
   * `componentWillMount` is the closest thing to a  standard "constructor" for
   * React components.
   *
   * The `keyboardWillShow` is called before input focus.
   */
  componentWillMount(): void;

  /**
   * Warning, this may be called several times for a single keyboard opening.
   * It's best to store the information in this method and then take any action
   * at a later point (either in `keyboardDidShow` or other).
   *
   * Here's the order that events occur in:
   * - focus
   * - willShow {startCoordinates, endCoordinates} several times
   * - didShow several times
   * - blur
   * - willHide {startCoordinates, endCoordinates} several times
   * - didHide several times
   *
   * The `ScrollResponder` providesModule callbacks for each of these events.
   * Even though any user could have easily listened to keyboard events
   * themselves, using these `props` callbacks ensures that ordering of events
   * is consistent - and not dependent on the order that the keyboard events are
   * subscribed to. This matters when telling the scroll view to scroll to where
   * the keyboard is headed - the scroll responder better have been notified of
   * the keyboard destination before being instructed to scroll to where the
   * keyboard will be. Stick to the `ScrollResponder` callbacks, and everything
   * will work.
   *
   * WARNING: These callbacks will fire even if a keyboard is displayed in a
   * different navigation pane. Filter out the events to determine if they are
   * relevant to you. (For example, only if you receive these callbacks after
   * you had explicitly focused a node etc).
   */
  scrollResponderKeyboardWillShow(e: ScrollResponderEvent): void;

  scrollResponderKeyboardWillHide(e: ScrollResponderEvent): void;

  scrollResponderKeyboardDidShow(e: ScrollResponderEvent): void;

  scrollResponderKeyboardDidHide(e: ScrollResponderEvent): void;
}

export interface ScrollViewProps extends ViewProps, Touchable {
  /**
   * These styles will be applied to the scroll view content container which
   * wraps all of the child views. Example:
   *
   *   return (
   *     <ScrollView contentContainerStyle={styles.contentContainer}>
   *     </ScrollView>
   *   );
   *   ...
   *   const styles = StyleSheet.create({
   *     contentContainer: {
   *       paddingVertical: 20
   *     }
   *   });
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * When true the scroll view's children are arranged horizontally in a row
   * instead of vertically in a column. The default value is false.
   */
  horizontal?: boolean | null;

  /**
   * If sticky headers should stick at the bottom instead of the top of the
   * ScrollView. This is usually used with inverted ScrollViews.
   */
  invertStickyHeaders?: boolean;

  /**
   * Determines whether the keyboard gets dismissed in response to a drag.
   *   - 'none' (the default) drags do not dismiss the keyboard.
   *   - 'onDrag' the keyboard is dismissed when a drag begins.
   *   - 'interactive' the keyboard is dismissed interactively with the drag
   *     and moves in synchrony with the touch; dragging upwards cancels the
   *     dismissal.
   */
  keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';

  /**
   * Determines when the keyboard should stay visible after a tap.
   * - 'never' (the default), tapping outside of the focused text input when the keyboard is up dismisses the keyboard. When this happens, children won't receive the tap.
   * - 'always', the keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
   * - 'handled', the keyboard will not dismiss automatically when the tap was handled by a children, (or captured by an ancestor).
   * - false, deprecated, use 'never' instead
   * - true, deprecated, use 'always' instead
   */
  keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';

  /**
   * Called when scrollable content view of the ScrollView changes.
   * Handler function is passed the content width and content height as parameters: (contentWidth, contentHeight)
   * It's implemented using onLayout handler attached to the content container which this ScrollView renders.
   *
   */
  onContentSizeChange?: (w: number, h: number) => void;

  /**
   * Fires at most once per frame during scrolling.
   * The frequency of the events can be contolled using the scrollEventThrottle prop.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * Fires if a user initiates a scroll gesture.
   */
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * Fires when a user has finished scrolling.
   */
  onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * Fires when scroll view has finished moving
   */
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * Fires when scroll view has begun moving
   */
  onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

  /**
   * When true the scroll view stops on multiples of the scroll view's size
   * when scrolling. This can be used for horizontal pagination. The default
   * value is false.
   */
  pagingEnabled?: boolean;

  /**
   * When false, the content does not scroll. The default value is true
   */
  scrollEnabled?: boolean; // true

  /**
   * Experimental: When true offscreen child views (whose `overflow` value is
   * `hidden`) are removed from their native backing superview when offscreen.
   * This canimprove scrolling performance on long lists. The default value is
   * false.
   */
  removeClippedSubviews?: boolean;

  /**
   * When true, shows a horizontal scroll indicator.
   */
  showsHorizontalScrollIndicator?: boolean;

  /**
   * When true, shows a vertical scroll indicator.
   */
  showsVerticalScrollIndicator?: boolean;

  /**
   * Style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * A RefreshControl component, used to provide pull-to-refresh
   * functionality for the ScrollView.
   */
  refreshControl?: React.ReactElement<RefreshControlProps>;

  /**
   * When `snapToInterval` is set, `snapToAlignment` will define the relationship of the the snapping to the scroll view.
   *      - `start` (the default) will align the snap at the left (horizontal) or top (vertical)
   *      - `center` will align the snap in the center
   *      - `end` will align the snap at the right (horizontal) or bottom (vertical)
   */
  snapToAlignment?: 'start' | 'center' | 'end';

  /**
   * When set, causes the scroll view to stop at multiples of the value of `snapToInterval`.
   * This can be used for paginating through children that have lengths smaller than the scroll view.
   * Used in combination with `snapToAlignment` and `decelerationRate="fast"`. Overrides less
   * configurable `pagingEnabled` prop.
   */
  snapToInterval?: number;

  /**
   * When set, causes the scroll view to stop at the defined offsets. This can be used for
   * paginating through variously sized children that have lengths smaller than the scroll view.
   * Typically used in combination with `decelerationRate="fast"`. Overrides less configurable
   * `pagingEnabled` and `snapToInterval` props.
   */
  snapToOffsets?: number[];

  /**
   * Use in conjuction with `snapToOffsets`. By default, the beginning of the list counts as a
   * snap offset. Set `snapToStart` to false to disable this behavior and allow the list to scroll
   * freely between its start and the first `snapToOffsets` offset. The default value is true.
   */
  snapToStart?: boolean;

  /**
   * Use in conjuction with `snapToOffsets`. By default, the end of the list counts as a snap
   * offset. Set `snapToEnd` to false to disable this behavior and allow the list to scroll freely
   * between its end and the last `snapToOffsets` offset. The default value is true.
   */
  snapToEnd?: boolean;

  /**
   * When true, the scroll view stops on the next index (in relation to scroll position at release)
   * regardless of how fast the gesture is. This can be used for horizontal pagination when the page
   * is less than the width of the ScrollView. The default value is false.
   */
  disableIntervalMomentum?: boolean;

  /**
   * When true, the default JS pan responder on the ScrollView is disabled, and full control over
   * touches inside the ScrollView is left to its child components. This is particularly useful
   * if `snapToInterval` is enabled, since it does not follow typical touch patterns. Do not use
   * this on regular ScrollView use cases without `snapToInterval` as it may cause unexpected
   * touches to occur while scrolling. The default value is false.
   */
  disableScrollViewPanResponder?: boolean;
}

declare class ScrollViewComponent extends React.Component<ScrollViewProps> {}
declare const ScrollViewBase: Constructor<ScrollResponderMixin> & typeof ScrollViewComponent;
export class ScrollView extends ScrollViewBase {
  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   * Syntax:
   *
   * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as an alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo(y?: number | { x?: number; y?: number; animated?: boolean }, x?: number, animated?: boolean): void;

  /**
   * A helper function that scrolls to the end of the scrollview;
   * If this is a vertical ScrollView, it scrolls to the bottom.
   * If this is a horizontal ScrollView scrolls to the right.
   *
   * The options object has an animated prop, that enables the scrolling animation or not.
   * The animated prop defaults to true
   */
  scrollToEnd(options?: { animated: boolean }): void;

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder(): JSX.Element;

  getScrollableNode(): any;

  // Undocumented
  getInnerViewNode(): any;

  /**
   * @deprecated Use scrollTo instead
   */
  scrollWithoutAnimationTo?: (y: number, x: number) => void;
}

export interface NativeScrollRectangle {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export interface NativeScrollPoint {
  x: number;
  y: number;
}

export interface NativeScrollVelocity {
  x: number;
  y: number;
}

export interface NativeScrollSize {
  height: number;
  width: number;
}

export interface NativeScrollEvent {
  contentInset: NativeScrollRectangle;
  contentOffset: NativeScrollPoint;
  contentSize: NativeScrollSize;
  layoutMeasurement: NativeScrollSize;
  velocity?: NativeScrollVelocity;
  zoomScale: number;
}

// Deduced from
// https://github.com/facebook/react-native/commit/052cd7eb8afa7a805ef13e940251be080499919c

/**
 * Data source wrapper around ListViewDataSource to allow for tracking of
 * which row is swiped open and close opened row(s) when another row is swiped
 * open.
 *
 * See https://github.com/facebook/react-native/pull/5602 for why
 * ListViewDataSource is not subclassed.
 */
export interface SwipeableListViewDataSource {
  cloneWithRowsAndSections(
    dataBlob: any,
    sectionIdentities?: Array<string>,
    rowIdentities?: Array<Array<string>>
  ): SwipeableListViewDataSource;
  getDataSource(): ListViewDataSource;
  getOpenRowID(): string;
  getFirstRowID(): string;
  setOpenRowID(rowID: string): SwipeableListViewDataSource;
}

export interface SwipeableListViewProps {
  /**
   * To alert the user that swiping is possible, the first row can bounce
   * on component mount.
   */
  bounceFirstRowOnMount: boolean;

  /**
   * Use `SwipeableListView.getNewDataSource()` to get a data source to use,
   * then use it just like you would a normal ListView data source
   */
  dataSource: SwipeableListViewDataSource;

  // Maximum distance to open to after a swipe
  maxSwipeDistance: number;

  // Callback method to render the swipeable view
  renderRow: (
    rowData: any,
    sectionID: string | number,
    rowID: string | number,
    highlightRow?: boolean
  ) => React.ReactElement;

  // Callback method to render the view that will be unveiled on swipe
  renderQuickActions(rowData: any, sectionID: string | number, rowID: string | number): React.ReactElement;
}

/**
 * A container component that renders multiple SwipeableRow's in a ListView
 * implementation. This is designed to be a drop-in replacement for the
 * standard React Native `ListView`, so use it as if it were a ListView, but
 * with extra props, i.e.
 *
 * let ds = SwipeableListView.getNewDataSource();
 * ds.cloneWithRowsAndSections(dataBlob, ?sectionIDs, ?rowIDs);
 * // ..
 * <SwipeableListView renderRow={..} renderQuickActions={..} {..ListView props} />
 *
 * SwipeableRow can be used independently of this component, but the main
 * benefit of using this component is
 *
 * - It ensures that at most 1 row is swiped open (auto closes others)
 * - It can bounce the 1st row of the list so users know it's swipeable
 * - More to come
 */
export class SwipeableListView extends React.Component<SwipeableListViewProps> {
  static getNewDataSource(): SwipeableListViewDataSource;
}

//////////////////////////////////////////////////////////////////////////
//
// A P I s
//
//////////////////////////////////////////////////////////////////////////

export type ShareContent =
  | {
      title?: string;
      message: string;
    }
  | {
      title?: string;
      url: string;
    };

export type ShareOptions = {
  dialogTitle?: string;
  excludedActivityTypes?: Array<string>;
  tintColor?: string;
  subject?: string;
};

export type ShareSharedAction = {
  action: 'sharedAction';
  activityType?: string;
};

export type ShareDismissedAction = {
  action: 'dismissedAction';
};

export type ShareAction = ShareSharedAction | ShareDismissedAction;

export interface ShareStatic {
  /**
   * Open a dialog to share text content.
   *
   * In iOS, Returns a Promise which will be invoked an object containing `action`, `activityType`.
   * If the user dismissed the dialog, the Promise will still be resolved with action being `Share.dismissedAction`
   * and all the other keys being undefined.
   *
   * In Android, Returns a Promise which always be resolved with action being `Share.sharedAction`.
   *
   * ### Content
   *
   *  - `message` - a message to share
   *  - `title` - title of the message
   *
   * #### iOS
   *
   *  - `url` - an URL to share
   *
   * At least one of URL and message is required.
   *
   * ### Options
   *
   * #### iOS
   *
   * - `excludedActivityTypes`
   * - `tintColor`
   *
   * #### Android
   *
   * - `dialogTitle`
   *
   */
  share(content: ShareContent, options?: ShareOptions): Promise<ShareAction>;
  sharedAction: 'sharedAction';
  dismissedAction: 'dismissedAction';
}

type AccessibilityEventName =
  | 'change' // deprecated, maps to screenReaderChanged
  | 'boldTextChanged' // iOS-only Event
  | 'grayscaleChanged' // iOS-only Event
  | 'invertColorsChanged' // iOS-only Event
  | 'reduceMotionChanged'
  | 'screenReaderChanged'
  | 'reduceTransparencyChanged' // iOS-only Event
  | 'announcementFinished'; // iOS-only Event

type AccessibilityChangeEvent = boolean;

type AccessibilityAnnoucementFinishedEvent = {
  announcement: string;
  success: boolean;
};

type AccessibilityEvent = AccessibilityChangeEvent | AccessibilityAnnoucementFinishedEvent;

/**
 * @see https://facebook.github.io/react-native/docs/accessibilityinfo.html
 */
export interface AccessibilityInfoStatic {
  /**
   * Query whether bold text is currently enabled.
   *
   * @platform ios
   */
  isBoldTextEnabled: () => Promise<boolean>;

  /**
   * Query whether grayscale is currently enabled.
   *
   * @platform ios
   */
  isGrayscaleEnabled: () => Promise<boolean>;

  /**
   * Query whether invert colors is currently enabled.
   *
   * @platform ios
   */
  isInvertColorsEnabled: () => Promise<boolean>;

  /**
   * Query whether reduce motion is currently enabled.
   */
  isReduceMotionEnabled: () => Promise<boolean>;

  /**
   * Query whether reduce transparency is currently enabled.
   *
   * @platform ios
   */
  isReduceTransparencyEnabled: () => Promise<boolean>;

  /**
   * Query whether a screen reader is currently enabled.
   */
  isScreenReaderEnabled: () => Promise<boolean>;

  /**
   * Query whether a screen reader is currently enabled.
   *
   * @deprecated use isScreenReaderChanged instead
   */
  fetch: () => Promise<boolean>;

  /**
   * Add an event handler. Supported events:
   * - announcementFinished: iOS-only event. Fires when the screen reader has finished making an announcement.
   *                         The argument to the event handler is a dictionary with these keys:
   *                          - announcement: The string announced by the screen reader.
   *                          - success: A boolean indicating whether the announcement was successfully made.
   * - AccessibilityEventName constants other than announcementFinished: Fires on accessibility feature change.
   *            The argument to the event handler is a boolean.
   *            The boolean is true when the related event's feature is enabled and false otherwise.
   *
   */
  addEventListener: (eventName: AccessibilityEventName, handler: (event: AccessibilityEvent) => void) => void;

  /**
   * Remove an event handler.
   */
  removeEventListener: (eventName: AccessibilityEventName, handler: (event: AccessibilityEvent) => void) => void;

  /**
   * Set acessibility focus to a react component.
   *
   * @platform ios
   */
  setAccessibilityFocus: (reactTag: number) => void;

  /**
   * Post a string to be announced by the screen reader.
   *
   * @platform ios
   */
  announceForAccessibility: (announcement: string) => void;
}

/**
 * @see https://facebook.github.io/react-native/docs/alert.html#content
 */
export interface AlertButton {
  text?: string;
  onPress?: (value?: string) => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  /** @platform android */
  cancelable?: boolean;
  /** @platform android */
  onDismiss?: () => void;
}

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button.
 *
 * This is an API that works both on iOS and Android and can show static
 * alerts. To show an alert that prompts the user to enter some information,
 * see `AlertIOS`; entering text in an alert is common on iOS only.
 *
 * ## iOS
 *
 * On iOS you can specify any number of buttons. Each button can optionally
 * specify a style, which is one of 'default', 'cancel' or 'destructive'.
 *
 * ## Android
 *
 * On Android at most three buttons can be specified. Android has a concept
 * of a neutral, negative and a positive button:
 *
 *   - If you specify one button, it will be the 'positive' one (such as 'OK')
 *   - Two buttons mean 'negative', 'positive' (such as 'Cancel', 'OK')
 *   - Three buttons mean 'neutral', 'negative', 'positive' (such as 'Later', 'Cancel', 'OK')
 *
 * ```
 * // Works on both iOS and Android
 * Alert.alert(
 *   'Alert Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
 *     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
 *     {text: 'OK', onPress: () => console.log('OK Pressed')},
 *   ]
 * )
 * ```
 */
export interface AlertStatic {
  alert: (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => void;
  prompt: (
    title: string,
    message?: string,
    callbackOrButtons?: ((text: string) => void) | AlertButton[],
    type?: AlertType,
    defaultValue?: string,
    keyboardType?: string
  ) => void;
}

export type AlertType = 'default' | 'plain-text' | 'secure-text' | 'login-password';

/**
 * AppStateIOS can tell you if the app is in the foreground or background,
 * and notify you when the state changes.
 *
 * AppStateIOS is frequently used to determine the intent and proper behavior
 * when handling push notifications.
 *
 * iOS App States
 *      active - The app is running in the foreground
 *      background - The app is running in the background. The user is either in another app or on the home screen
 *      inactive - This is a transition state that currently never happens for typical React Native apps.
 *
 * For more information, see Apple's documentation: https://developer.apple.com/library/ios/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/TheAppLifeCycle/TheAppLifeCycle.html
 *
 * @see https://facebook.github.io/react-native/docs/appstateios.html#content
 */
export type AppStateEvent = 'change' | 'memoryWarning';
export type AppStateStatus = 'active' | 'background' | 'inactive';

export interface AppStateStatic {
  currentState: AppStateStatus;

  /**
   * Add a handler to AppState changes by listening to the change event
   * type and providing the handler
   */
  addEventListener(type: AppStateEvent, listener: (state: AppStateStatus) => void): void;

  /**
   * Remove a handler by passing the change event type and the handler
   */
  removeEventListener(type: AppStateEvent, listener: (state: AppStateStatus) => void): void;
}

/**
 * AsyncStorage is a simple, unencrypted, asynchronous, persistent, key-value storage
 * system that is global to the app.  It should be used instead of LocalStorage.
 *
 * It is recommended that you use an abstraction on top of `AsyncStorage`
 * instead of `AsyncStorage` directly for anything more than light usage since
 * it operates globally.
 *
 * On iOS, `AsyncStorage` is backed by native code that stores small values in a
 * serialized dictionary and larger values in separate files. On Android,
 * `AsyncStorage` will use either [RocksDB](http://rocksdb.org/) or SQLite
 * based on what is available.
 *
 * @see https://facebook.github.io/react-native/docs/asyncstorage.html#content
 */
export interface AsyncStorageStatic {
  /**
   * Fetches key and passes the result to callback, along with an Error if there is any.
   */
  getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;

  /**
   * Sets value for key and calls callback on completion, along with an Error if there is any
   */
  setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;

  removeItem(key: string, callback?: (error?: Error) => void): Promise<void>;

  /**
   * Merges existing value with input value, assuming they are stringified json. Returns a Promise object.
   * Not supported by all native implementation
   */
  mergeItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;

  /**
   * Erases all AsyncStorage for all clients, libraries, etc. You probably don't want to call this.
   * Use removeItem or multiRemove to clear only your own keys instead.
   */
  clear(callback?: (error?: Error) => void): Promise<void>;

  /**
   * Gets all keys known to the app, for all callers, libraries, etc
   */
  getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;

  /**
   * multiGet invokes callback with an array of key-value pair arrays that matches the input format of multiSet
   */
  multiGet(
    keys: string[],
    callback?: (errors?: Error[], result?: [string, string][]) => void
  ): Promise<[string, string][]>;

  /**
   * multiSet and multiMerge take arrays of key-value array pairs that match the output of multiGet,
   *
   * multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
   */
  multiSet(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;

  /**
   * Delete all the keys in the keys array.
   */
  multiRemove(keys: string[], callback?: (errors?: Error[]) => void): Promise<void>;

  /**
   * Merges existing values with input values, assuming they are stringified json.
   * Returns a Promise object.
   *
   * Not supported by all native implementations.
   */
  multiMerge(keyValuePairs: string[][], callback?: (errors?: Error[]) => void): Promise<void>;
}

export type BackPressEventName = 'hardwareBackPress';

/**
 * Detect hardware back button presses, and programmatically invoke the
 * default back button functionality to exit the app if there are no
 * listeners or if none of the listeners return true.
 * Methods don't have more detailed documentation as of 0.25.
 */
export interface BackHandlerStatic {
  exitApp(): void;
  addEventListener(eventName: BackPressEventName, handler: () => void): NativeEventSubscription;
  removeEventListener(eventName: BackPressEventName, handler: () => void): void;
}

export interface ButtonProps {
  title: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  color?: string;
  accessibilityLabel?: string;
  disabled?: boolean;

  /**
   * Used to locate this button in end-to-end tests.
   */
  testID?: string;
}

export class Button extends React.Component<ButtonProps> {}

export type CameraRollGroupType = 'Album' | 'All' | 'Event' | 'Faces' | 'Library' | 'PhotoStream' | 'SavedPhotos';
export type CameraRollAssetType = 'All' | 'Videos' | 'Photos';

export interface CameraRollFetchParams {
  first: number;
  after?: string;
  groupTypes?: CameraRollGroupType;
  groupName?: string;
  assetType?: CameraRollAssetType;
}

export interface CameraRollNodeInfo {
  image: Image;
  group_name: string;
  timestamp: number;
  location: any;
}

export interface CameraRollEdgeInfo {
  node: CameraRollNodeInfo;
}

export interface CameraRollAssetInfo {
  edges: CameraRollEdgeInfo[];
  page_info: {
    has_next_page: boolean;
    end_cursor: string;
  };
}

export interface GetPhotosParamType {
  first: number;
  after?: string;
  groupTypes?: CameraRollGroupType;
  groupName?: string;
  assetType?: CameraRollAssetType;
  mimeTypes?: string[];
}

export interface GetPhotosReturnType {
  edges: {
    node: {
      type: string;
      group_name: string;
      image: {
        uri: string;
        height: number;
        width: number;
        playableDuration: number;
        isStored?: boolean;
      };
      timestamp: number;
      location: {
        latitude: number;
        longitude: number;
        altitude: number;
        heading: number;
        speed: number;
      };
    };
  }[];

  page_info: {
    has_next_page: boolean;
    start_cursor?: string;
    end_cursor?: string;
  };
}

/**
 * CameraRoll provides access to the local camera roll / gallery.
 * Before using this you must link the RCTCameraRoll library.
 * You can refer to (Linking)[https://facebook.github.io/react-native/docs/linking-libraries-ios.html] for help.
 */
export interface CameraRollStatic {
  GroupTypesOptions: CameraRollGroupType[]; //'Album','All','Event','Faces','Library','PhotoStream','SavedPhotos'
  AssetTypeOptions: CameraRollAssetType[]; // "All", "Videos", "Photos"

  /**
   * Saves the image to the camera roll / gallery.
   *
   * @tag On Android, this is a local URI, such as "file:///sdcard/img.png".
   * On iOS, the tag can be one of the following:
   *      local URI
   *      assets-library tag
   *      a tag not maching any of the above, which means the image data will be stored in memory (and consume memory as long as the process is alive)
   *
   * @deprecated use saveToCameraRoll instead
   */
  saveImageWithTag(tag: string): Promise<string>;

  /**
   * Saves the photo or video to the camera roll / gallery.
   *
   * On Android, the tag must be a local image or video URI, such as `"file:///sdcard/img.png"`.
   *
   * On iOS, the tag can be any image URI (including local, remote asset-library and base64 data URIs)
   * or a local video file URI (remote or data URIs are not supported for saving video at this time).
   *
   * If the tag has a file extension of .mov or .mp4, it will be inferred as a video. Otherwise
   * it will be treated as a photo. To override the automatic choice, you can pass an optional
   * `type` parameter that must be one of 'photo' or 'video'.
   *
   * Returns a Promise which will resolve with the new URI.
   */
  saveToCameraRoll(tag: string, type?: 'photo' | 'video'): Promise<string>;

  /**
   * Invokes callback with photo identifier objects from the local camera roll of the device matching shape defined by getPhotosReturnChecker.
   *
   * @param params See getPhotosParamChecker.
   */
  getPhotos(params: GetPhotosParamType): Promise<GetPhotosReturnType>;
}

// https://facebook.github.io/react-native/docs/checkbox.html
export interface CheckBoxProps extends ViewProps {
  /**
   * If true the user won't be able to toggle the checkbox. Default value is false.
   */
  disabled?: boolean;

  /**
   * Used in case the props change removes the component.
   */
  onChange?: (value: boolean) => void;

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: (value: boolean) => void;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;

  /**
   * The value of the checkbox. If true the checkbox will be turned on. Default value is false.
   */
  value?: boolean;
}

export class CheckBox extends React.Component<CheckBoxProps> {}

/** Clipboard gives you an interface for setting and getting content from Clipboard on both iOS and Android */
export interface ClipboardStatic {
  getString(): Promise<string>;
  setString(content: string): void;
}

export interface LinkingStatic extends NativeEventEmitter {
  /**
   * Add a handler to Linking changes by listening to the `url` event type
   * and providing the handler
   */
  addEventListener(type: string, handler: (event: { url: string }) => void): void;

  /**
   * Remove a handler by passing the `url` event type and the handler
   */
  removeEventListener(type: string, handler: (event: { url: string }) => void): void;

  /**
   * Try to open the given url with any of the installed apps.
   * You can use other URLs, like a location (e.g. "geo:37.484847,-122.148386"), a contact, or any other URL that can be opened with the installed apps.
   * NOTE: This method will fail if the system doesn't know how to open the specified URL. If you're passing in a non-http(s) URL, it's best to check {@code canOpenURL} first.
   * NOTE: For web URLs, the protocol ("http://", "https://") must be set accordingly!
   */
  openURL(url: string): Promise<any>;

  /**
   * Determine whether or not an installed app can handle a given URL.
   * NOTE: For web URLs, the protocol ("http://", "https://") must be set accordingly!
   * NOTE: As of iOS 9, your app needs to provide the LSApplicationQueriesSchemes key inside Info.plist.
   * @param URL the URL to open
   */
  canOpenURL(url: string): Promise<boolean>;

  /**
   * If the app launch was triggered by an app link with, it will give the link url, otherwise it will give null
   * NOTE: To support deep linking on Android, refer http://developer.android.com/training/app-indexing/deep-linking.html#handling-intents
   */
  getInitialURL(): Promise<string | null>;

  /**
   * Open the Settings app and displays the app’s custom settings, if it has any.
   */
  openSettings(): Promise<void>;

  /**
   * Sends an Android Intent - a broad surface to express Android functions.  Useful for deep-linking to settings pages,
   * opening an SMS app with a message draft in place, and more.  See https://developer.android.com/reference/kotlin/android/content/Intent?hl=en
   */
  sendIntent(action: string, extras?: Array<{ key: string; value: string | number | boolean }>): Promise<void>;
}

export interface PanResponderGestureState {
  /**
   *  ID of the gestureState- persisted as long as there at least one touch on
   */
  stateID: number;

  /**
   *  the latest screen coordinates of the recently-moved touch
   */
  moveX: number;

  /**
   *  the latest screen coordinates of the recently-moved touch
   */
  moveY: number;

  /**
   * the screen coordinates of the responder grant
   */
  x0: number;

  /**
   * the screen coordinates of the responder grant
   */
  y0: number;

  /**
   * accumulated distance of the gesture since the touch started
   */
  dx: number;

  /**
   * accumulated distance of the gesture since the touch started
   */
  dy: number;

  /**
   * current velocity of the gesture
   */
  vx: number;

  /**
   * current velocity of the gesture
   */
  vy: number;

  /**
   * Number of touches currently on screen
   */
  numberActiveTouches: number;

  // All `gestureState` accounts for timeStamps up until:
  _accountsForMovesUpTo: number;
}

/**
 * @see documentation of GestureResponderHandlers
 */
export interface PanResponderCallbacks {
  onMoveShouldSetPanResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
  onStartShouldSetPanResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
  onPanResponderGrant?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderMove?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderRelease?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderTerminate?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;

  onMoveShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
  onStartShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
  onPanResponderReject?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderStart?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderEnd?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
  onPanResponderTerminationRequest?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
  onShouldBlockNativeResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
}

export interface PanResponderInstance {
  panHandlers: GestureResponderHandlers;
}

/**
 * PanResponder reconciles several touches into a single gesture.
 * It makes single-touch gestures resilient to extra touches,
 * and can be used to recognize simple multi-touch gestures.
 *
 * It provides a predictable wrapper of the responder handlers provided by the gesture responder system.
 * For each handler, it provides a new gestureState object alongside the normal event.
 */
export interface PanResponderStatic {
  /**
   * @param config Enhanced versions of all of the responder callbacks
   * that provide not only the typical `ResponderSyntheticEvent`, but also the
   * `PanResponder` gesture state.  Simply replace the word `Responder` with
   * `PanResponder` in each of the typical `onResponder*` callbacks. For
   * example, the `config` object would look like:
   *
   *  - `onMoveShouldSetPanResponder: (e, gestureState) => {...}`
   *  - `onMoveShouldSetPanResponderCapture: (e, gestureState) => {...}`
   *  - `onStartShouldSetPanResponder: (e, gestureState) => {...}`
   *  - `onStartShouldSetPanResponderCapture: (e, gestureState) => {...}`
   *  - `onPanResponderReject: (e, gestureState) => {...}`
   *  - `onPanResponderGrant: (e, gestureState) => {...}`
   *  - `onPanResponderStart: (e, gestureState) => {...}`
   *  - `onPanResponderEnd: (e, gestureState) => {...}`
   *  - `onPanResponderRelease: (e, gestureState) => {...}`
   *  - `onPanResponderMove: (e, gestureState) => {...}`
   *  - `onPanResponderTerminate: (e, gestureState) => {...}`
   *  - `onPanResponderTerminationRequest: (e, gestureState) => {...}`
   *  - `onShouldBlockNativeResponder: (e, gestureState) => {...}`
   *
   *  In general, for events that have capture equivalents, we update the
   *  gestureState once in the capture phase and can use it in the bubble phase
   *  as well.
   *
   *  Be careful with onStartShould* callbacks. They only reflect updated
   *  `gestureState` for start/end events that bubble/capture to the Node.
   *  Once the node is the responder, you can rely on every start/end event
   *  being processed by the gesture and `gestureState` being updated
   *  accordingly. (numberActiveTouches) may not be totally accurate unless you
   *  are the responder.
   */
  create(config: PanResponderCallbacks): PanResponderInstance;
}

export interface Rationale {
  title: string;
  message: string;
  buttonPositive: string;
  buttonNegative?: string;
  buttonNeutral?: string;
}

export type Permission =
  | 'android.permission.READ_CALENDAR'
  | 'android.permission.WRITE_CALENDAR'
  | 'android.permission.CAMERA'
  | 'android.permission.READ_CONTACTS'
  | 'android.permission.WRITE_CONTACTS'
  | 'android.permission.GET_ACCOUNTS'
  | 'android.permission.ACCESS_FINE_LOCATION'
  | 'android.permission.ACCESS_COARSE_LOCATION'
  | 'android.permission.RECORD_AUDIO'
  | 'android.permission.READ_PHONE_STATE'
  | 'android.permission.CALL_PHONE'
  | 'android.permission.READ_CALL_LOG'
  | 'android.permission.WRITE_CALL_LOG'
  | 'com.android.voicemail.permission.ADD_VOICEMAIL'
  | 'android.permission.USE_SIP'
  | 'android.permission.PROCESS_OUTGOING_CALLS'
  | 'android.permission.BODY_SENSORS'
  | 'android.permission.SEND_SMS'
  | 'android.permission.RECEIVE_SMS'
  | 'android.permission.READ_SMS'
  | 'android.permission.RECEIVE_WAP_PUSH'
  | 'android.permission.RECEIVE_MMS'
  | 'android.permission.READ_EXTERNAL_STORAGE'
  | 'android.permission.WRITE_EXTERNAL_STORAGE';

export type PermissionStatus = 'granted' | 'denied' | 'never_ask_again';

export interface PushNotificationPermissions {
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
}

export interface PushNotification {
  /**
   * An alias for `getAlert` to get the notification's main message string
   */
  getMessage(): string | Object;

  /**
   * Gets the sound string from the `aps` object
   */
  getSound(): string;

  /**
   * Gets the category string from the `aps` object
   */
  getCategory(): string;

  /**
   * Gets the notification's main message from the `aps` object
   */
  getAlert(): string | Object;

  /**
   * Gets the content-available number from the `aps` object
   */
  getContentAvailable(): number;

  /**
   * Gets the badge count number from the `aps` object
   */
  getBadgeCount(): number;

  /**
   * Gets the data object on the notif
   */
  getData(): Object;

  /**
   * iOS Only
   * Signifies remote notification handling is complete
   */
  finish(result: string): void;
}

type PresentLocalNotificationDetails = {
  alertBody: string;
  alertAction: string;
  alertTitle?: string;
  soundName?: string;
  category?: string;
  userInfo?: Object;
  applicationIconBadgeNumber?: number;
};

type ScheduleLocalNotificationDetails = {
  alertAction?: string;
  alertBody?: string;
  alertTitle?: string;
  applicationIconBadgeNumber?: number;
  category?: string;
  fireDate?: number | string;
  isSilent?: boolean;
  repeatInterval?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';
  soundName?: string;
  userInfo?: Object;
};

export type PushNotificationEventName = 'notification' | 'localNotification' | 'register' | 'registrationError';

type FetchResult = {
  NewData: 'UIBackgroundFetchResultNewData';
  NoData: 'UIBackgroundFetchResultNoData';
  ResultFailed: 'UIBackgroundFetchResultFailed';
};

export interface SettingsStatic {
  get(key: string): any;
  set(settings: Object): void;
  watchKeys(keys: string | Array<string>, callback: () => void): number;
  clearWatch(watchId: number): void;
}

export type StatusBarStyle = 'default' | 'light-content' | 'dark-content';

export type StatusBarAnimation = 'none' | 'fade' | 'slide';

export interface StatusBarProps {
  /**
   * If the transition between status bar property changes should be
   * animated. Supported for backgroundColor, barStyle and hidden.
   */
  animated?: boolean;

  /**
   * If the status bar is hidden.
   */
  hidden?: boolean;
}

export class StatusBar extends React.Component<StatusBarProps> {
  /**
   * The current height of the status bar on the device.
   * @platform android
   */
  static currentHeight?: number;

  /**
   * Show or hide the status bar
   * @param hidden The dialog's title.
   * @param animation Optional animation when
   *    changing the status bar hidden property.
   */
  static setHidden: (hidden: boolean, animation?: StatusBarAnimation) => void;

  /**
   * Set the status bar style
   * @param style Status bar style to set
   * @param animated Animate the style change.
   */
  static setBarStyle: (style: StatusBarStyle, animated?: boolean) => void;

  /**
   * Control the visibility of the network activity indicator
   * @param visible Show the indicator.
   */
  static setNetworkActivityIndicatorVisible: (visible: boolean) => void;

  /**
   * Set the background color for the status bar
   * @param color Background color.
   * @param animated Animate the style change.
   */
  static setBackgroundColor: (color: string, animated?: boolean) => void;

  /**
   * Control the translucency of the status bar
   * @param translucent Set as translucent.
   */
  static setTranslucent: (translucent: boolean) => void;
}

export interface UIManagerStatic {
  /**
   * Capture an image of the screen, window or an individual view. The image
   * will be stored in a temporary file that will only exist for as long as the
   * app is running.
   *
   * The `view` argument can be the literal string `window` if you want to
   * capture the entire window, or it can be a reference to a specific
   * React Native component.
   *
   * The `options` argument may include:
   * - width/height (number) - the width and height of the image to capture.
   * - format (string) - either 'png' or 'jpeg'. Defaults to 'png'.
   * - quality (number) - the quality when using jpeg. 0.0 - 1.0 (default).
   *
   * Returns a Promise<string> (tempFilePath)
   * @platform ios
   */
  takeSnapshot: (
    view?: 'window' | React.ReactElement | number,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg';
      quality?: number;
    }
  ) => Promise<string>;

  /**
   * Determines the location on screen, width, and height of the given view and
   * returns the values via an async callback. If successful, the callback will
   * be called with the following arguments:
   *
   *  - x
   *  - y
   *  - width
   *  - height
   *  - pageX
   *  - pageY
   *
   * Note that these measurements are not available until after the rendering
   * has been completed in native. If you need the measurements as soon as
   * possible, consider using the [`onLayout`
   * prop](docs/view.html#onlayout) instead.
   */
  measure(node: number, callback: MeasureOnSuccessCallback): void;

  /**
   * Determines the location of the given view in the window and returns the
   * values via an async callback. If the React root view is embedded in
   * another native view, this will give you the absolute coordinates. If
   * successful, the callback will be called with the following
   * arguments:
   *
   *  - x
   *  - y
   *  - width
   *  - height
   *
   * Note that these measurements are not available until after the rendering
   * has been completed in native.
   */
  measureInWindow(node: number, callback: MeasureInWindowOnSuccessCallback): void;

  /**
   * Like [`measure()`](#measure), but measures the view relative an ancestor,
   * specified as `relativeToNativeNode`. This means that the returned x, y
   * are relative to the origin x, y of the ancestor view.
   *
   * As always, to obtain a native node handle for a component, you can use
   * `React.findNodeHandle(component)`.
   */
  measureLayout(
    node: number,
    relativeToNativeNode: number,
    onFail: () => void /* currently unused */,
    onSuccess: MeasureLayoutOnSuccessCallback
  ): void;

  /**
   * Automatically animates views to their new positions when the
   * next layout happens.
   *
   * A common way to use this API is to call it before calling `setState`.
   *
   * Note that in order to get this to work on **Android** you need to set the following flags via `UIManager`:
   *
   *     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
   */
  setLayoutAnimationEnabledExperimental(value: boolean): void;

  /**
   * Used to display an Android PopupMenu. If a menu item is pressed, the success callback will
   * be called with the following arguments:
   *
   *  - item - the menu item.
   *  - index - index of the pressed item in array. Returns `undefined` if cancelled.
   *
   * To obtain a native node handle for a component, you can use
   * `React.findNodeHandle(component)`.
   *
   * Note that this works only on Android
   */
  showPopupMenu(
    node: number,
    items: string[],
    error: () => void /* currently unused */,
    success: (item: string, index: number | undefined) => void
  ): void;

  getViewManagerConfig: (
    name: string
  ) => {
    Commands: { [key: string]: number };
  };

  /**
   * Used to call a native view method from JavaScript
   *
   * reactTag - Id of react view.
   * commandID - Id of the native method that should be called.
   * commandArgs - Args of the native method that we can pass from JS to native.
   */
  dispatchViewManagerCommand: (reactTag: number | null, commandID: number, commandArgs?: Array<any>) => void;
}

export interface SwitchProps {
  activeThumbColor?: string;
  activeTrackColor?: string;
  /**
   * Color of the foreground switch grip.
   */
  thumbColor?: string;

  /**
   * Custom colors for the switch track
   *
   * Color when false and color when true
   */
  trackColor?: { false: string; true: string };

  /**
   * If true the user won't be able to toggle the switch.
   * Default value is false.
   */
  disabled?: boolean;

  /**
   * Invoked with the new value when the value changes.
   */
  onValueChange?: (value: boolean) => void;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;

  /**
   * The value of the switch. If true the switch will be turned on.
   * Default value is false.
   */
  value?: boolean;

  /**
   * On iOS, custom color for the background.
   * Can be seen when the switch value is false or when the switch is disabled.
   */
  ios_backgroundColor?: string;

  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a boolean input.
 *
 * This is a controlled component that requires an `onValueChange` callback that
 * updates the `value` prop in order for the component to reflect user actions.
 * If the `value` prop is not updated, the component will continue to render
 * the supplied `value` prop instead of the expected result of any user actions.
 */
declare class SwitchComponent extends React.Component<SwitchProps> {}
declare const SwitchBase: Constructor<NativeMethodsMixin> & typeof SwitchComponent;
export class Switch extends SwitchBase {}

/**
 * The Vibration API is exposed at `Vibration.vibrate()`.
 * The vibration is asynchronous so this method will return immediately.
 *
 * There will be no effect on devices that do not support Vibration, eg. the simulator.
 *
 * **Note for android**
 * add `<uses-permission android:name="android.permission.VIBRATE"/>` to `AndroidManifest.xml`
 *
 * **Android Usage:**
 *
 * [0, 500, 200, 500]
 * V(0.5s) --wait(0.2s)--> V(0.5s)
 *
 * [300, 500, 200, 500]
 * --wait(0.3s)--> V(0.5s) --wait(0.2s)--> V(0.5s)
 *
 * **iOS Usage:**
 * if first argument is 0, it will not be included in pattern array.
 *
 * [0, 1000, 2000, 3000]
 * V(fixed) --wait(1s)--> V(fixed) --wait(2s)--> V(fixed) --wait(3s)--> V(fixed)
 */
export interface VibrationStatic {
  vibrate(pattern: number | number[], repeat?: boolean): void;

  /**
   * Stop vibration
   */
  cancel(): void;
}

/**
 * This class implements common easing functions. The math is pretty obscure,
 * but this cool website has nice visual illustrations of what they represent:
 * http://xaedes.de/dev/transitions/
 */
export type EasingFunction = (value: number) => number;
export interface EasingStatic {
  step0: EasingFunction;
  step1: EasingFunction;
  linear: EasingFunction;
  ease: EasingFunction;
  quad: EasingFunction;
  cubic: EasingFunction;
  poly(n: number): EasingFunction;
  sin: EasingFunction;
  circle: EasingFunction;
  exp: EasingFunction;
  elastic(bounciness: number): EasingFunction;
  back(s: number): EasingFunction;
  bounce: EasingFunction;
  bezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
  in(easing: EasingFunction): EasingFunction;
  out(easing: EasingFunction): EasingFunction;
  inOut(easing: EasingFunction): EasingFunction;
}

export namespace Animated {
  type AnimatedValue = Value;
  type AnimatedValueXY = ValueXY;

  type Base = Animated;

  class Animated {
    // Internal class, no public API.
  }

  class AnimatedWithChildren extends Animated {
    // Internal class, no public API.
  }

  class AnimatedInterpolation extends AnimatedWithChildren {
    interpolate(config: InterpolationConfigType): AnimatedInterpolation;
  }

  type ExtrapolateType = 'extend' | 'identity' | 'clamp';

  type InterpolationConfigType = {
    inputRange: number[];
    outputRange: number[] | string[];
    easing?: (input: number) => number;
    extrapolate?: ExtrapolateType;
    extrapolateLeft?: ExtrapolateType;
    extrapolateRight?: ExtrapolateType;
  };

  type ValueListenerCallback = (state: { value: number }) => void;

  /**
   * Standard value for driving animations.  One `Animated.Value` can drive
   * multiple properties in a synchronized fashion, but can only be driven by one
   * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
   * or calling `setValue`) will stop any previous ones.
   */
  export class Value extends AnimatedWithChildren {
    constructor(value: number);

    /**
     * Directly set the value.  This will stop any animations running on the value
     * and update all the bound properties.
     */
    setValue(value: number): void;

    /**
     * Sets an offset that is applied on top of whatever value is set, whether via
     * `setValue`, an animation, or `Animated.event`.  Useful for compensating
     * things like the start of a pan gesture.
     */
    setOffset(offset: number): void;

    /**
     * Merges the offset value into the base value and resets the offset to zero.
     * The final output of the value is unchanged.
     */
    flattenOffset(): void;

    /**
     * Sets the offset value to the base value, and resets the base value to zero.
     * The final output of the value is unchanged.
     */
    extractOffset(): void;

    /**
     * Adds an asynchronous listener to the value so you can observe updates from
     * animations.  This is useful because there is no way to
     * synchronously read the value because it might be driven natively.
     */
    addListener(callback: ValueListenerCallback): string;

    removeListener(id: string): void;

    removeAllListeners(): void;

    /**
     * Stops any running animation or tracking.  `callback` is invoked with the
     * final value after stopping the animation, which is useful for updating
     * state to match the animation position with layout.
     */
    stopAnimation(callback?: (value: number) => void): void;

    /**
     * Interpolates the value before updating the property, e.g. mapping 0-1 to
     * 0-10.
     */
    interpolate(config: InterpolationConfigType): AnimatedInterpolation;
  }

  type ValueXYListenerCallback = (value: { x: number; y: number }) => void;

  /**
   * 2D Value for driving 2D animations, such as pan gestures.  Almost identical
   * API to normal `Animated.Value`, but multiplexed.  Contains two regular
   * `Animated.Value`s under the hood.
   */
  export class ValueXY extends AnimatedWithChildren {
    x: AnimatedValue;
    y: AnimatedValue;

    constructor(valueIn?: { x: number | AnimatedValue; y: number | AnimatedValue });

    setValue(value: { x: number; y: number }): void;

    setOffset(offset: { x: number; y: number }): void;

    flattenOffset(): void;

    extractOffset(): void;

    stopAnimation(callback?: (value: { x: number; y: number }) => void): void;

    addListener(callback: ValueXYListenerCallback): string;

    removeListener(id: string): void;

    /**
     * Converts `{x, y}` into `{left, top}` for use in style, e.g.
     *
     *```javascript
     *  style={this.state.anim.getLayout()}
     *```
     */
    getLayout(): { [key: string]: AnimatedValue };

    /**
     * Converts `{x, y}` into a useable translation transform, e.g.
     *
     *```javascript
     *  style={{
     *    transform: this.state.anim.getTranslateTransform()
     *  }}
     *```
     */
    getTranslateTransform(): { [key: string]: AnimatedValue }[];
  }

  type EndResult = { finished: boolean };
  type EndCallback = (result: EndResult) => void;

  export interface CompositeAnimation {
    start: (callback?: EndCallback) => void;
    stop: () => void;
  }

  interface AnimationConfig {
    isInteraction?: boolean;
    useNativeDriver?: boolean;
  }

  /**
   * Animates a value from an initial velocity to zero based on a decay
   * coefficient.
   */
  export function decay(value: AnimatedValue | AnimatedValueXY, config: DecayAnimationConfig): CompositeAnimation;

  interface DecayAnimationConfig extends AnimationConfig {
    velocity: number | { x: number; y: number };
    deceleration?: number;
  }

  /**
   * Animates a value along a timed easing curve.  The `Easing` module has tons
   * of pre-defined curves, or you can use your own function.
   */
  export const timing: (value: AnimatedValue | AnimatedValueXY, config: TimingAnimationConfig) => CompositeAnimation;

  interface TimingAnimationConfig extends AnimationConfig {
    toValue: number | AnimatedValue | { x: number; y: number } | AnimatedValueXY;
    easing?: (value: number) => number;
    duration?: number;
    delay?: number;
  }

  interface SpringAnimationConfig extends AnimationConfig {
    toValue: number | AnimatedValue | { x: number; y: number } | AnimatedValueXY;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
    velocity?: number | { x: number; y: number };
    bounciness?: number;
    speed?: number;
    tension?: number;
    friction?: number;
    stiffness?: number;
    mass?: number;
    damping?: number;
    delay?: number;
  }

  interface LoopAnimationConfig {
    iterations?: number; // default -1 for infinite
    /**
     * Defaults to `true`
     */
    resetBeforeIteration?: boolean;
  }

  /**
   * Creates a new Animated value composed from two Animated values added
   * together.
   */
  export function add(a: Animated, b: Animated): AnimatedAddition;

  class AnimatedAddition extends AnimatedInterpolation {}

  /**
   * Creates a new Animated value composed by subtracting the second Animated
   * value from the first Animated value.
   */
  export function subtract(a: Animated, b: Animated): AnimatedSubtraction;

  class AnimatedSubtraction extends AnimatedInterpolation {}

  /**
   * Creates a new Animated value composed by dividing the first Animated
   * value by the second Animated value.
   */
  export function divide(a: Animated, b: Animated): AnimatedDivision;

  class AnimatedDivision extends AnimatedInterpolation {}

  /**
   * Creates a new Animated value composed from two Animated values multiplied
   * together.
   */
  export function multiply(a: Animated, b: Animated): AnimatedMultiplication;

  class AnimatedMultiplication extends AnimatedInterpolation {}

  /**
   * Creates a new Animated value that is the (non-negative) modulo of the
   * provided Animated value
   */
  export function modulo(a: Animated, modulus: number): AnimatedModulo;

  class AnimatedModulo extends AnimatedInterpolation {}

  /**
   * Create a new Animated value that is limited between 2 values. It uses the
   * difference between the last value so even if the value is far from the bounds
   * it will start changing when the value starts getting closer again.
   * (`value = clamp(value + diff, min, max)`).
   *
   * This is useful with scroll events, for example, to show the navbar when
   * scrolling up and to hide it when scrolling down.
   */
  export function diffClamp(a: Animated, min: number, max: number): AnimatedDiffClamp;

  class AnimatedDiffClamp extends AnimatedInterpolation {}

  /**
   * Starts an animation after the given delay.
   */
  export function delay(time: number): CompositeAnimation;

  /**
   * Starts an array of animations in order, waiting for each to complete
   * before starting the next.  If the current running animation is stopped, no
   * following animations will be started.
   */
  export function sequence(animations: Array<CompositeAnimation>): CompositeAnimation;

  /**
   * Array of animations may run in parallel (overlap), but are started in
   * sequence with successive delays.  Nice for doing trailing effects.
   */

  export function stagger(time: number, animations: Array<CompositeAnimation>): CompositeAnimation;

  /**
   * Loops a given animation continuously, so that each time it reaches the end,
   * it resets and begins again from the start. Can specify number of times to
   * loop using the key 'iterations' in the config. Will loop without blocking
   * the UI thread if the child animation is set to 'useNativeDriver'.
   */

  export function loop(animation: CompositeAnimation, config?: LoopAnimationConfig): CompositeAnimation;

  /**
   * Spring animation based on Rebound and Origami.  Tracks velocity state to
   * create fluid motions as the `toValue` updates, and can be chained together.
   */
  export function spring(value: AnimatedValue | AnimatedValueXY, config: SpringAnimationConfig): CompositeAnimation;

  type ParallelConfig = {
    stopTogether?: boolean; // If one is stopped, stop all.  default: true
  };

  /**
   * Starts an array of animations all at the same time.  By default, if one
   * of the animations is stopped, they will all be stopped.  You can override
   * this with the `stopTogether` flag.
   */
  export function parallel(animations: Array<CompositeAnimation>, config?: ParallelConfig): CompositeAnimation;

  type Mapping = { [key: string]: Mapping } | AnimatedValue;
  interface EventConfig<T> {
    listener?: (event: NativeSyntheticEvent<T>) => void;
    useNativeDriver?: boolean;
  }

  /**
   *  Takes an array of mappings and extracts values from each arg accordingly,
   *  then calls `setValue` on the mapped outputs.  e.g.
   *
   *```javascript
   *  onScroll={Animated.event(
   *    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
   *    {listener},          // Optional async listener
   *  )
   *  ...
   *  onPanResponderMove: Animated.event([
   *    null,                // raw event arg ignored
   *    {dx: this._panX},    // gestureState arg
   *  ]),
   *```
   */
  export function event<T>(argMapping: Array<Mapping | null>, config?: EventConfig<T>): (...args: any[]) => void;

  export type ComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never;

  export interface WithAnimatedValue<T>
    extends ThisType<
      T extends object
        ? { [K in keyof T]?: WithAnimatedValue<T[K]> }
        : T extends (infer P)[]
        ? WithAnimatedValue<P>[]
        : T | Value | AnimatedInterpolation
    > {}

  export type AnimatedProps<T> = { [key in keyof T]: WithAnimatedValue<T[key]> };

  export interface AnimatedComponent<
    T extends React.ComponentType<ComponentProps<T>> | React.Component<ComponentProps<T>>
  > extends React.FC<AnimatedProps<ComponentProps<T>>> {
    getNode: () => T;
  }

  /**
   * Make any React component Animatable.  Used to create `Animated.View`, etc.
   */
  export function createAnimatedComponent<
    T extends React.ComponentType<ComponentProps<T>> | React.Component<ComponentProps<T>>
  >(component: T): AnimatedComponent<T extends React.ComponentClass<ComponentProps<T>> ? InstanceType<T> : T>;

  /**
   * Animated variants of the basic native views. Accepts Animated.Value for
   * props and style.
   */
  export const View: AnimatedComponent<View>;
  export const Image: AnimatedComponent<Image>;
  export const Text: AnimatedComponent<Text>;
  export const ScrollView: AnimatedComponent<ScrollView>;
  export const FlatList: AnimatedComponent<FlatList>;
  export const SectionList: AnimatedComponent<SectionList>;
}

// tslint:disable-next-line:interface-name
export interface I18nManagerStatic {
  isRTL: boolean;
  allowRTL: (allowRTL: boolean) => {};
  forceRTL: (forceRTL: boolean) => {};
}

export interface OpenCameraDialogOptions {
  /** Defaults to false */
  videoMode?: boolean;
}

export interface OpenSelectDialogOptions {
  /** Defaults to true */
  showImages?: boolean;
  /** Defaults to false */
  showVideos?: boolean;
}

/** [imageURL|tempImageTag, height, width] */
export type ImagePickerResult = [string, number, number];

export interface ImageStoreStatic {
  /**
   * Check if the ImageStore contains image data for the specified URI.
   * @platform ios
   */
  hasImageForTag(uri: string, callback: (hasImage: boolean) => void): void;

  /**
   * Delete an image from the ImageStore. Images are stored in memory and
   * must be manually removed when you are finished with them, otherwise they
   * will continue to use up RAM until the app is terminated. It is safe to
   * call `removeImageForTag()` without first calling `hasImageForTag()`, it
   * will simply fail silently.
   * @platform ios
   */
  removeImageForTag(uri: string): void;

  /**
   * Stores a base64-encoded image in the ImageStore, and returns a URI that
   * can be used to access or display the image later. Images are stored in
   * memory only, and must be manually deleted when you are finished with
   * them by calling `removeImageForTag()`.
   *
   * Note that it is very inefficient to transfer large quantities of binary
   * data between JS and native code, so you should avoid calling this more
   * than necessary.
   * @platform ios
   */
  addImageFromBase64(base64ImageData: string, success: (uri: string) => void, failure: (error: any) => void): void;

  /**
   * Retrieves the base64-encoded data for an image in the ImageStore. If the
   * specified URI does not match an image in the store, the failure callback
   * will be called.
   *
   * Note that it is very inefficient to transfer large quantities of binary
   * data between JS and native code, so you should avoid calling this more
   * than necessary. To display an image in the ImageStore, you can just pass
   * the URI to an `<Image/>` component; there is no need to retrieve the
   * base64 data.
   */
  getBase64ForTag(uri: string, success: (base64ImageData: string) => void, failure: (error: any) => void): void;
}

//
// Interfacing with Native Modules
// https://facebook.github.io/react-native/docs/native-modules-ios.html
//

export interface NativeEventSubscription {
  /**
   * Call this method to un-subscribe from a native-event
   */
  remove(): void;
}

/**
 * Receive events from native-code
 * Deprecated - subclass NativeEventEmitter to create granular event modules instead of
 * adding all event listeners directly to RCTNativeAppEventEmitter.
 * @see https://github.com/facebook/react-native/blob/0.34-stable\Libraries\EventEmitter\RCTNativeAppEventEmitter.js
 * @see https://facebook.github.io/react-native/docs/native-modules-ios.html#sending-events-to-javascript
 */
type RCTNativeAppEventEmitter = DeviceEventEmitterStatic;

interface ImageCropData {
  /**
   * The top-left corner of the cropped image, specified in the original
   * image's coordinate space.
   */
  offset: {
    x: number;
    y: number;
  };

  /**
   * The size (dimensions) of the cropped image, specified in the original
   * image's coordinate space.
   */
  size: {
    width: number;
    height: number;
  };

  /**
   * (Optional) size to scale the cropped image to.
   */
  displaySize?: { width: number; height: number };

  /**
   * (Optional) the resizing mode to use when scaling the image. If the
   * `displaySize` param is not specified, this has no effect.
   */
  resizeMode?: 'contain' | 'cover' | 'stretch';
}

interface ImageEditorStatic {
  /**
   * Crop the image specified by the URI param. If URI points to a remote
   * image, it will be downloaded automatically. If the image cannot be
   * loaded/downloaded, the failure callback will be called.
   *
   * If the cropping process is successful, the resultant cropped image
   * will be stored in the ImageStore, and the URI returned in the success
   * callback will point to the image in the store. Remember to delete the
   * cropped image from the ImageStore when you are done with it.
   */
  cropImage(
    uri: string,
    cropData: ImageCropData,
    success: (uri: string) => void,
    failure: (error: Object) => void
  ): void;
}

export interface ARTNodeMixin {
  opacity?: number;
  originX?: number;
  originY?: number;
  scaleX?: number;
  scaleY?: number;
  scale?: number;
  title?: string;
  x?: number;
  y?: number;
  visible?: boolean;
}

export interface ARTGroupProps extends ARTNodeMixin {
  width?: number;
  height?: number;
}

export interface ARTClippingRectangleProps extends ARTNodeMixin {
  width?: number;
  height?: number;
}

export interface ARTRenderableMixin extends ARTNodeMixin {
  fill?: string;
  stroke?: string;
  strokeCap?: 'butt' | 'square' | 'round';
  strokeDash?: number[];
  strokeJoin?: 'bevel' | 'miter' | 'round';
  strokeWidth?: number;
}

export interface ARTShapeProps extends ARTRenderableMixin {
  d: string;
  width?: number;
  height?: number;
}

export interface ARTTextProps extends ARTRenderableMixin {
  font?: string;
  alignment?: string;
}

export interface ARTSurfaceProps {
  style?: StyleProp<ViewStyle>;
  width: number;
  height: number;
}

export class ClippingRectangle extends React.Component<ARTClippingRectangleProps> {}

export class Group extends React.Component<ARTGroupProps> {}

export class Shape extends React.Component<ARTShapeProps> {}

export class Surface extends React.Component<ARTSurfaceProps> {}

export class ARTText extends React.Component<ARTTextProps> {}

export interface ARTStatic {
  ClippingRectangle: typeof ClippingRectangle;
  Group: typeof Group;
  Shape: typeof Shape;
  Surface: typeof Surface;
  Text: typeof ARTText;
}

export type KeyboardEventName =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide'
  | 'keyboardWillChangeFrame'
  | 'keyboardDidChangeFrame';

export type KeyboardEventEasing = 'easeIn' | 'easeInEaseOut' | 'easeOut' | 'linear' | 'keyboard';

type ScreenRect = {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
};

export interface KeyboardEvent {
  duration: number;
  easing: KeyboardEventEasing;
  endCoordinates: ScreenRect;
  startCoordinates: ScreenRect;
  isEventFromThisApp: boolean;
}

type KeyboardEventListener = (event: KeyboardEvent) => void;

export interface KeyboardStatic extends NativeEventEmitter {
  dismiss: () => void;
  addListener(eventType: KeyboardEventName, listener: KeyboardEventListener): EmitterSubscription;
}

//////////////////////////////////////////////////////////////////////////
//
//  R E - E X P O R T S
//
//////////////////////////////////////////////////////////////////////////

// TODO: The following components need to be added
// - [ ] ART
export const ART: ARTStatic;
export type ART = ARTStatic;

//////////// APIS //////////////
export const AccessibilityInfo: AccessibilityInfoStatic;
export type AccessibilityInfo = AccessibilityInfoStatic;

export const Alert: AlertStatic;
export type Alert = AlertStatic;

export const AppState: AppStateStatic;
export type AppState = AppStateStatic;

export const AsyncStorage: AsyncStorageStatic;
export type AsyncStorage = AsyncStorageStatic;

export const BackHandler: BackHandlerStatic;
export type BackHandler = BackHandlerStatic;

/**
 * CameraRoll has been extracted from react-native core and will be removed in a future release.
 * "It can now be installed and imported from '@react-native-community/cameraroll' instead of 'react-native'.
 * See 'https://github.com/react-native-community/react-native-cameraroll',
 *
 * @deprecated
 */
export const CameraRoll: CameraRollStatic;
export type CameraRoll = CameraRollStatic;

export const Clipboard: ClipboardStatic;
export type Clipboard = ClipboardStatic;

export const Dimensions: Dimensions;

export type Easing = EasingStatic;
export const Easing: EasingStatic;

/** http://facebook.github.io/react-native/blog/2016/08/19/right-to-left-support-for-react-native-apps.html */
export const I18nManager: I18nManagerStatic;
export type I18nManager = I18nManagerStatic;

export const ImageEditor: ImageEditorStatic;
export type ImageEditor = ImageEditorStatic;

export const ImageStore: ImageStoreStatic;
export type ImageStore = ImageStoreStatic;

export const InteractionManager: InteractionManagerStatic;

export const Keyboard: KeyboardStatic;

export const LayoutAnimation: LayoutAnimationStatic;
export type LayoutAnimation = LayoutAnimationStatic;

export const Linking: LinkingStatic;
export type Linking = LinkingStatic;

export const NativeMethodsMixin: NativeMethodsMixinStatic;
export type NativeMethodsMixin = NativeMethodsMixinStatic;

export const NativeComponent: NativeMethodsMixinStatic;
export type NativeComponent = NativeMethodsMixinStatic;

export const PanResponder: PanResponderStatic;
export type PanResponder = PanResponderStatic;

export const Settings: SettingsStatic;
export type Settings = SettingsStatic;

export const Share: ShareStatic;
export type Share = ShareStatic;

export const Systrace: SystraceStatic;
export type Systrace = SystraceStatic;

export const UIManager: UIManagerStatic;
export type UIManager = UIManagerStatic;

export const Vibration: VibrationStatic;
export type Vibration = VibrationStatic;

//////////// Plugins //////////////

export const DeviceEventEmitter: DeviceEventEmitterStatic;
/**
 * Abstract base class for implementing event-emitting modules. This implements
 * a subset of the standard EventEmitter node module API.
 */
export interface NativeEventEmitter extends EventEmitter {}
export const NativeEventEmitter: NativeEventEmitter;
/**
 * Deprecated - subclass NativeEventEmitter to create granular event modules instead of
 * adding all event listeners directly to RCTNativeAppEventEmitter.
 */
export const NativeAppEventEmitter: RCTNativeAppEventEmitter;

/**
 * Interface for NativeModules which allows to augment NativeModules with type informations.
 * See react-native-sensor-manager for example.
 */
interface NativeModulesStatic {
  [name: string]: any;
}

/**
 * Native Modules written in ObjectiveC/Swift/Java exposed via the RCTBridge
 * Define lazy getters for each module. These will return the module if already loaded, or load it if not.
 * See https://facebook.github.io/react-native/docs/native-modules-ios.html
 * Use:
 * <code>const MyModule = NativeModules.ModuleName</code>
 */
export const NativeModules: NativeModulesStatic;
export const Platform:
  | PlatformIOSStatic
  | PlatformAndroidStatic
  | PlatformWindowsOSStatic
  | PlatformMacOSStatic
  | PlatformWebStatic;
export const PixelRatio: PixelRatioStatic;

/**
 * Creates values that can be used like React components which represent native
 * view managers. You should create JavaScript modules that wrap these values so
 * that the results are memoized. Example:
 *
 *   const View = requireNativeComponent('RCTView');
 *
 * The concrete return type of `requireNativeComponent` is a string, but the declared type is
 * `any` because TypeScript assumes anonymous JSX intrinsics (`string` instead of `"div", for
 * example) not to have any props.
 */
export function requireNativeComponent(viewName: string): any;

export function findNodeHandle(
  componentOrHandle: null | number | React.Component<any, any> | React.ComponentClass<any>
): null | number;

export function processColor(color: any): number;

export const YellowBox: React.ComponentClass<any, any> & { ignoreWarnings: (warnings: string[]) => void };

//////////////////////////////////////////////////////////////////////////
//
// Additional ( and controversial)
//
//////////////////////////////////////////////////////////////////////////

export function __spread(target: any, ...sources: any[]): any;

type ErrorHandlerCallback = (error: any, isFatal?: boolean) => void;

export interface ErrorUtils {
  setGlobalHandler: (callback: ErrorHandlerCallback) => void;
  getGlobalHandler: () => ErrorHandlerCallback;
}

//
// Add-Ons
//
export namespace addons {
  //FIXME: Documentation ?
  export interface TestModuleStatic {
    verifySnapshot: (done: (indicator?: any) => void) => void;
    markTestPassed: (indicator: any) => void;
    markTestCompleted: () => void;
  }

  export const TestModule: TestModuleStatic;
  export type TestModule = TestModuleStatic;
}

//
// Prop Types
//
export const ColorPropType: React.Validator<string>;
export const EdgeInsetsPropType: React.Validator<Insets>;
export const PointPropType: React.Validator<PointPropType>;
export const ViewPropTypes: React.ValidationMap<ViewProps>;

declare global {
  interface NodeRequire {
    (id: string): any;
  }

  var require: NodeRequire;

  /**
   * Console polyfill
   * @see https://facebook.github.io/react-native/docs/javascript-environment.html#polyfills
   */
  interface Console {
    error(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    table(...data: any[]): void;
    groupCollapsed(label?: string): void;
    groupEnd(): void;
    group(label?: string): void;
    disableYellowBox: boolean;
    ignoredYellowBox: string[];
  }

  var console: Console;

  /**
   * This contains the non-native `XMLHttpRequest` object, which you can use if you want to route network requests
   * through DevTools (to trace them):
   *
   *   global.XMLHttpRequest = global.originalXMLHttpRequest;
   *
   * @see https://github.com/facebook/react-native/issues/934
   */
  const originalXMLHttpRequest: any;

  const __BUNDLE_START_TIME__: number;
  const ErrorUtils: ErrorUtils;

  /**
   * This variable is set to true when react-native is running in Dev mode
   * Typical usage:
   * <code> if (__DEV__) console.log('Running in dev mode')</code>
   */
  const __DEV__: boolean;

  const HermesInternal: null | {};
}
