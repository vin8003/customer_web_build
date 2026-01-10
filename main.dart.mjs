// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It should return a JS Array containing 2 elements. The first
  //   should be the bytes for the wasm module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The second
  //   should be the result of using the JS 'import' API on the js file path.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _4: (o, c) => o instanceof c,
      _5: o => Object.keys(o),
      _35: () => new Array(),
      _36: x0 => new Array(x0),
      _38: x0 => x0.length,
      _40: (x0,x1) => x0[x1],
      _41: (x0,x1,x2) => { x0[x1] = x2 },
      _43: x0 => new Promise(x0),
      _45: (x0,x1,x2) => new DataView(x0,x1,x2),
      _47: x0 => new Int8Array(x0),
      _48: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _49: x0 => new Uint8Array(x0),
      _51: x0 => new Uint8ClampedArray(x0),
      _53: x0 => new Int16Array(x0),
      _55: x0 => new Uint16Array(x0),
      _57: x0 => new Int32Array(x0),
      _59: x0 => new Uint32Array(x0),
      _61: x0 => new Float32Array(x0),
      _63: x0 => new Float64Array(x0),
      _65: (x0,x1,x2) => x0.call(x1,x2),
      _70: (decoder, codeUnits) => decoder.decode(codeUnits),
      _71: () => new TextDecoder("utf-8", {fatal: true}),
      _72: () => new TextDecoder("utf-8", {fatal: false}),
      _73: (s) => +s,
      _74: x0 => new Uint8Array(x0),
      _75: (x0,x1,x2) => x0.set(x1,x2),
      _76: (x0,x1) => x0.transferFromImageBitmap(x1),
      _78: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._78(f,arguments.length,x0) }),
      _79: x0 => new window.FinalizationRegistry(x0),
      _80: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _81: (x0,x1) => x0.unregister(x1),
      _82: (x0,x1,x2) => x0.slice(x1,x2),
      _83: (x0,x1) => x0.decode(x1),
      _84: (x0,x1) => x0.segment(x1),
      _85: () => new TextDecoder(),
      _86: (x0,x1) => x0.get(x1),
      _87: x0 => x0.buffer,
      _88: x0 => x0.wasmMemory,
      _89: () => globalThis.window._flutter_skwasmInstance,
      _90: x0 => x0.rasterStartMilliseconds,
      _91: x0 => x0.rasterEndMilliseconds,
      _92: x0 => x0.imageBitmaps,
      _196: x0 => x0.stopPropagation(),
      _197: x0 => x0.preventDefault(),
      _199: x0 => x0.remove(),
      _200: (x0,x1) => x0.append(x1),
      _201: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _246: x0 => x0.unlock(),
      _247: x0 => x0.getReader(),
      _248: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _249: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _250: (x0,x1) => x0.item(x1),
      _251: x0 => x0.next(),
      _252: x0 => x0.now(),
      _253: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._253(f,arguments.length,x0) }),
      _254: (x0,x1) => x0.addListener(x1),
      _255: (x0,x1) => x0.removeListener(x1),
      _256: (x0,x1) => x0.matchMedia(x1),
      _257: (x0,x1) => x0.revokeObjectURL(x1),
      _258: x0 => x0.close(),
      _259: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _260: x0 => new window.ImageDecoder(x0),
      _261: x0 => ({frameIndex: x0}),
      _262: (x0,x1) => x0.decode(x1),
      _263: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._263(f,arguments.length,x0) }),
      _264: (x0,x1) => x0.getModifierState(x1),
      _265: (x0,x1) => x0.removeProperty(x1),
      _266: (x0,x1) => x0.prepend(x1),
      _267: x0 => new Intl.Locale(x0),
      _268: x0 => x0.disconnect(),
      _269: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._269(f,arguments.length,x0) }),
      _270: (x0,x1) => x0.getAttribute(x1),
      _271: (x0,x1) => x0.contains(x1),
      _272: (x0,x1) => x0.querySelector(x1),
      _273: x0 => x0.blur(),
      _274: x0 => x0.hasFocus(),
      _275: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _276: (x0,x1) => x0.hasAttribute(x1),
      _277: (x0,x1) => x0.getModifierState(x1),
      _278: (x0,x1) => x0.createTextNode(x1),
      _279: (x0,x1) => x0.appendChild(x1),
      _280: (x0,x1) => x0.removeAttribute(x1),
      _281: x0 => x0.getBoundingClientRect(),
      _282: (x0,x1) => x0.observe(x1),
      _283: x0 => x0.disconnect(),
      _284: (x0,x1) => x0.closest(x1),
      _707: () => globalThis.window.flutterConfiguration,
      _709: x0 => x0.assetBase,
      _714: x0 => x0.canvasKitMaximumSurfaces,
      _715: x0 => x0.debugShowSemanticsNodes,
      _716: x0 => x0.hostElement,
      _717: x0 => x0.multiViewEnabled,
      _718: x0 => x0.nonce,
      _720: x0 => x0.fontFallbackBaseUrl,
      _730: x0 => x0.console,
      _731: x0 => x0.devicePixelRatio,
      _732: x0 => x0.document,
      _733: x0 => x0.history,
      _734: x0 => x0.innerHeight,
      _735: x0 => x0.innerWidth,
      _736: x0 => x0.location,
      _737: x0 => x0.navigator,
      _738: x0 => x0.visualViewport,
      _739: x0 => x0.performance,
      _741: x0 => x0.URL,
      _743: (x0,x1) => x0.getComputedStyle(x1),
      _744: x0 => x0.screen,
      _745: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._745(f,arguments.length,x0) }),
      _746: (x0,x1) => x0.requestAnimationFrame(x1),
      _751: (x0,x1) => x0.warn(x1),
      _753: (x0,x1) => x0.debug(x1),
      _754: x0 => globalThis.parseFloat(x0),
      _755: () => globalThis.window,
      _756: () => globalThis.Intl,
      _757: () => globalThis.Symbol,
      _758: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _760: x0 => x0.clipboard,
      _761: x0 => x0.maxTouchPoints,
      _762: x0 => x0.vendor,
      _763: x0 => x0.language,
      _764: x0 => x0.platform,
      _765: x0 => x0.userAgent,
      _766: (x0,x1) => x0.vibrate(x1),
      _767: x0 => x0.languages,
      _768: x0 => x0.documentElement,
      _769: (x0,x1) => x0.querySelector(x1),
      _772: (x0,x1) => x0.createElement(x1),
      _775: (x0,x1) => x0.createEvent(x1),
      _776: x0 => x0.activeElement,
      _779: x0 => x0.head,
      _780: x0 => x0.body,
      _782: (x0,x1) => { x0.title = x1 },
      _785: x0 => x0.visibilityState,
      _786: () => globalThis.document,
      _787: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._787(f,arguments.length,x0) }),
      _788: (x0,x1) => x0.dispatchEvent(x1),
      _796: x0 => x0.target,
      _798: x0 => x0.timeStamp,
      _799: x0 => x0.type,
      _801: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _808: x0 => x0.firstChild,
      _812: x0 => x0.parentElement,
      _814: (x0,x1) => { x0.textContent = x1 },
      _815: x0 => x0.parentNode,
      _816: x0 => x0.nextSibling,
      _817: (x0,x1) => x0.removeChild(x1),
      _818: x0 => x0.isConnected,
      _826: x0 => x0.clientHeight,
      _827: x0 => x0.clientWidth,
      _828: x0 => x0.offsetHeight,
      _829: x0 => x0.offsetWidth,
      _830: x0 => x0.id,
      _831: (x0,x1) => { x0.id = x1 },
      _834: (x0,x1) => { x0.spellcheck = x1 },
      _835: x0 => x0.tagName,
      _836: x0 => x0.style,
      _838: (x0,x1) => x0.querySelectorAll(x1),
      _839: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _840: (x0,x1) => { x0.tabIndex = x1 },
      _841: x0 => x0.tabIndex,
      _842: (x0,x1) => x0.focus(x1),
      _843: x0 => x0.scrollTop,
      _844: (x0,x1) => { x0.scrollTop = x1 },
      _845: x0 => x0.scrollLeft,
      _846: (x0,x1) => { x0.scrollLeft = x1 },
      _847: x0 => x0.classList,
      _849: (x0,x1) => { x0.className = x1 },
      _851: (x0,x1) => x0.getElementsByClassName(x1),
      _852: x0 => x0.click(),
      _853: (x0,x1) => x0.attachShadow(x1),
      _856: x0 => x0.computedStyleMap(),
      _857: (x0,x1) => x0.get(x1),
      _863: (x0,x1) => x0.getPropertyValue(x1),
      _864: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _865: x0 => x0.offsetLeft,
      _866: x0 => x0.offsetTop,
      _867: x0 => x0.offsetParent,
      _869: (x0,x1) => { x0.name = x1 },
      _870: x0 => x0.content,
      _871: (x0,x1) => { x0.content = x1 },
      _875: (x0,x1) => { x0.src = x1 },
      _876: x0 => x0.naturalWidth,
      _877: x0 => x0.naturalHeight,
      _881: (x0,x1) => { x0.crossOrigin = x1 },
      _883: (x0,x1) => { x0.decoding = x1 },
      _884: x0 => x0.decode(),
      _889: (x0,x1) => { x0.nonce = x1 },
      _894: (x0,x1) => { x0.width = x1 },
      _896: (x0,x1) => { x0.height = x1 },
      _899: (x0,x1) => x0.getContext(x1),
      _960: x0 => x0.width,
      _961: x0 => x0.height,
      _963: (x0,x1) => x0.fetch(x1),
      _964: x0 => x0.status,
      _965: x0 => x0.headers,
      _966: x0 => x0.body,
      _967: x0 => x0.arrayBuffer(),
      _970: x0 => x0.read(),
      _971: x0 => x0.value,
      _972: x0 => x0.done,
      _979: x0 => x0.name,
      _980: x0 => x0.x,
      _981: x0 => x0.y,
      _984: x0 => x0.top,
      _985: x0 => x0.right,
      _986: x0 => x0.bottom,
      _987: x0 => x0.left,
      _997: x0 => x0.height,
      _998: x0 => x0.width,
      _999: x0 => x0.scale,
      _1000: (x0,x1) => { x0.value = x1 },
      _1003: (x0,x1) => { x0.placeholder = x1 },
      _1005: (x0,x1) => { x0.name = x1 },
      _1006: x0 => x0.selectionDirection,
      _1007: x0 => x0.selectionStart,
      _1008: x0 => x0.selectionEnd,
      _1011: x0 => x0.value,
      _1013: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1014: x0 => x0.readText(),
      _1015: (x0,x1) => x0.writeText(x1),
      _1017: x0 => x0.altKey,
      _1018: x0 => x0.code,
      _1019: x0 => x0.ctrlKey,
      _1020: x0 => x0.key,
      _1021: x0 => x0.keyCode,
      _1022: x0 => x0.location,
      _1023: x0 => x0.metaKey,
      _1024: x0 => x0.repeat,
      _1025: x0 => x0.shiftKey,
      _1026: x0 => x0.isComposing,
      _1028: x0 => x0.state,
      _1029: (x0,x1) => x0.go(x1),
      _1031: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1032: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1033: x0 => x0.pathname,
      _1034: x0 => x0.search,
      _1035: x0 => x0.hash,
      _1039: x0 => x0.state,
      _1042: (x0,x1) => x0.createObjectURL(x1),
      _1044: x0 => new Blob(x0),
      _1046: x0 => new MutationObserver(x0),
      _1047: (x0,x1,x2) => x0.observe(x1,x2),
      _1048: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1048(f,arguments.length,x0,x1) }),
      _1051: x0 => x0.attributeName,
      _1052: x0 => x0.type,
      _1053: x0 => x0.matches,
      _1054: x0 => x0.matches,
      _1058: x0 => x0.relatedTarget,
      _1060: x0 => x0.clientX,
      _1061: x0 => x0.clientY,
      _1062: x0 => x0.offsetX,
      _1063: x0 => x0.offsetY,
      _1066: x0 => x0.button,
      _1067: x0 => x0.buttons,
      _1068: x0 => x0.ctrlKey,
      _1072: x0 => x0.pointerId,
      _1073: x0 => x0.pointerType,
      _1074: x0 => x0.pressure,
      _1075: x0 => x0.tiltX,
      _1076: x0 => x0.tiltY,
      _1077: x0 => x0.getCoalescedEvents(),
      _1080: x0 => x0.deltaX,
      _1081: x0 => x0.deltaY,
      _1082: x0 => x0.wheelDeltaX,
      _1083: x0 => x0.wheelDeltaY,
      _1084: x0 => x0.deltaMode,
      _1091: x0 => x0.changedTouches,
      _1094: x0 => x0.clientX,
      _1095: x0 => x0.clientY,
      _1098: x0 => x0.data,
      _1101: (x0,x1) => { x0.disabled = x1 },
      _1103: (x0,x1) => { x0.type = x1 },
      _1104: (x0,x1) => { x0.max = x1 },
      _1105: (x0,x1) => { x0.min = x1 },
      _1106: x0 => x0.value,
      _1107: (x0,x1) => { x0.value = x1 },
      _1108: x0 => x0.disabled,
      _1109: (x0,x1) => { x0.disabled = x1 },
      _1111: (x0,x1) => { x0.placeholder = x1 },
      _1112: (x0,x1) => { x0.name = x1 },
      _1115: (x0,x1) => { x0.autocomplete = x1 },
      _1116: x0 => x0.selectionDirection,
      _1117: x0 => x0.selectionStart,
      _1119: x0 => x0.selectionEnd,
      _1122: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1123: (x0,x1) => x0.add(x1),
      _1126: (x0,x1) => { x0.noValidate = x1 },
      _1127: (x0,x1) => { x0.method = x1 },
      _1128: (x0,x1) => { x0.action = x1 },
      _1154: x0 => x0.orientation,
      _1155: x0 => x0.width,
      _1156: x0 => x0.height,
      _1157: (x0,x1) => x0.lock(x1),
      _1176: x0 => new ResizeObserver(x0),
      _1179: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1179(f,arguments.length,x0,x1) }),
      _1187: x0 => x0.length,
      _1188: x0 => x0.iterator,
      _1189: x0 => x0.Segmenter,
      _1190: x0 => x0.v8BreakIterator,
      _1191: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1194: x0 => x0.language,
      _1195: x0 => x0.script,
      _1196: x0 => x0.region,
      _1214: x0 => x0.done,
      _1215: x0 => x0.value,
      _1216: x0 => x0.index,
      _1220: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1221: (x0,x1) => x0.adoptText(x1),
      _1222: x0 => x0.first(),
      _1223: x0 => x0.next(),
      _1224: x0 => x0.current(),
      _1238: x0 => x0.hostElement,
      _1239: x0 => x0.viewConstraints,
      _1242: x0 => x0.maxHeight,
      _1243: x0 => x0.maxWidth,
      _1244: x0 => x0.minHeight,
      _1245: x0 => x0.minWidth,
      _1246: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1246(f,arguments.length,x0) }),
      _1247: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1247(f,arguments.length,x0) }),
      _1248: (x0,x1) => ({addView: x0,removeView: x1}),
      _1251: x0 => x0.loader,
      _1252: () => globalThis._flutter,
      _1253: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1254: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1254(f,arguments.length,x0) }),
      _1255: f => finalizeWrapper(f, function() { return dartInstance.exports._1255(f,arguments.length) }),
      _1256: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1259: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1259(f,arguments.length,x0) }),
      _1260: x0 => ({runApp: x0}),
      _1262: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1262(f,arguments.length,x0,x1) }),
      _1263: x0 => x0.length,
      _1264: () => globalThis.window.ImageDecoder,
      _1265: x0 => x0.tracks,
      _1267: x0 => x0.completed,
      _1269: x0 => x0.image,
      _1275: x0 => x0.displayWidth,
      _1276: x0 => x0.displayHeight,
      _1277: x0 => x0.duration,
      _1280: x0 => x0.ready,
      _1281: x0 => x0.selectedTrack,
      _1282: x0 => x0.repetitionCount,
      _1283: x0 => x0.frameCount,
      _1331: (x0,x1) => x0.createElement(x1),
      _1337: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1338: x0 => x0.onAdd(),
      _1339: (x0,x1) => x0.clearMarkers(x1),
      _1340: x0 => x0.onRemove(),
      _1344: (x0,x1) => new google.maps.Map(x0,x1),
      _1347: () => ({}),
      _1354: x0 => new google.maps.Marker(x0),
      _1357: (x0,x1) => x0.createElement(x1),
      _1358: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1368: () => ({}),
      _1371: (x0,x1) => new google.maps.LatLng(x0,x1),
      _1372: () => ({}),
      _1373: (x0,x1) => new google.maps.LatLngBounds(x0,x1),
      _1374: (x0,x1) => x0.appendChild(x1),
      _1377: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _1380: (x0,x1) => new google.maps.Point(x0,x1),
      _1388: (x0,x1) => x0.panTo(x1),
      _1389: (x0,x1,x2) => x0.fitBounds(x1,x2),
      _1390: (x0,x1,x2) => x0.panBy(x1,x2),
      _1392: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1393: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1395: (x0,x1) => x0.getAttribute(x1),
      _1400: () => globalThis.Notification.requestPermission(),
      _1401: x0 => x0.remove(),
      _1409: (x0,x1) => x0.querySelector(x1),
      _1410: (x0,x1) => x0.append(x1),
      _1413: x0 => x0.decode(),
      _1414: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1415: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _1416: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1416(f,arguments.length,x0) }),
      _1417: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1417(f,arguments.length,x0) }),
      _1418: x0 => x0.send(),
      _1419: () => new XMLHttpRequest(),
      _1440: x0 => x0.toJSON(),
      _1441: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1441(f,arguments.length,x0) }),
      _1442: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1442(f,arguments.length,x0) }),
      _1443: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1444: x0 => x0.call(),
      _1469: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1508: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1509: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1530: () => globalThis.firebase_auth.debugErrorMap,
      _1533: () => globalThis.firebase_auth.browserSessionPersistence,
      _1535: () => globalThis.firebase_auth.browserLocalPersistence,
      _1537: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1562: x0 => x0.uid,
      _1639: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _1664: (x0,x1) => x0.getItem(x1),
      _1670: (x0,x1) => x0.query(x1),
      _1671: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1671(f,arguments.length,x0) }),
      _1672: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1672(f,arguments.length,x0) }),
      _1673: (x0,x1,x2) => ({enableHighAccuracy: x0,timeout: x1,maximumAge: x2}),
      _1674: (x0,x1,x2,x3) => x0.getCurrentPosition(x1,x2,x3),
      _1679: (x0,x1) => x0.removeItem(x1),
      _1680: (x0,x1,x2) => x0.setItem(x1,x2),
      _1682: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _1683: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _1684: x0 => globalThis.firebase_core.getApp(x0),
      _1685: () => globalThis.firebase_core.getApp(),
      _1686: (x0,x1,x2) => globalThis.firebase_core.registerVersion(x0,x1,x2),
      _1688: x0 => globalThis.firebase_messaging.getMessaging(x0),
      _1690: (x0,x1) => globalThis.firebase_messaging.getToken(x0,x1),
      _1692: (x0,x1) => globalThis.firebase_messaging.onMessage(x0,x1),
      _1693: (x0,x1) => ({next: x0,error: x1}),
      _1698: x0 => x0.title,
      _1699: x0 => x0.body,
      _1700: x0 => x0.image,
      _1701: x0 => x0.messageId,
      _1702: x0 => x0.collapseKey,
      _1703: x0 => x0.fcmOptions,
      _1704: x0 => x0.notification,
      _1705: x0 => x0.data,
      _1706: x0 => x0.from,
      _1707: x0 => x0.analyticsLabel,
      _1708: x0 => x0.link,
      _1709: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1709(f,arguments.length,x0) }),
      _1710: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1710(f,arguments.length,x0) }),
      _1712: () => globalThis.firebase_core.SDK_VERSION,
      _1718: x0 => x0.apiKey,
      _1720: x0 => x0.authDomain,
      _1722: x0 => x0.databaseURL,
      _1724: x0 => x0.projectId,
      _1726: x0 => x0.storageBucket,
      _1728: x0 => x0.messagingSenderId,
      _1730: x0 => x0.measurementId,
      _1732: x0 => x0.appId,
      _1734: x0 => x0.name,
      _1735: x0 => x0.options,
      _1736: (x0,x1) => x0.debug(x1),
      _1737: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1737(f,arguments.length,x0) }),
      _1738: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1738(f,arguments.length,x0,x1) }),
      _1739: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _1740: (x0,x1) => x0.createScriptURL(x1),
      _1741: (x0,x1,x2) => x0.createScript(x1,x2),
      _1742: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1742(f,arguments.length,x0) }),
      _1744: Date.now,
      _1746: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1747: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1748: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1749: () => typeof dartUseDateNowForTicks !== "undefined",
      _1750: () => 1000 * performance.now(),
      _1751: () => Date.now(),
      _1752: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1753: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1754: () => new WeakMap(),
      _1755: (map, o) => map.get(o),
      _1756: (map, o, v) => map.set(o, v),
      _1757: x0 => new WeakRef(x0),
      _1758: x0 => x0.deref(),
      _1765: () => globalThis.WeakRef,
      _1768: s => JSON.stringify(s),
      _1769: s => printToConsole(s),
      _1770: (o, p, r) => o.replaceAll(p, () => r),
      _1771: (o, p, r) => o.replace(p, () => r),
      _1772: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1773: s => s.toUpperCase(),
      _1774: s => s.trim(),
      _1775: s => s.trimLeft(),
      _1776: s => s.trimRight(),
      _1777: (string, times) => string.repeat(times),
      _1778: Function.prototype.call.bind(String.prototype.indexOf),
      _1779: (s, p, i) => s.lastIndexOf(p, i),
      _1780: (string, token) => string.split(token),
      _1781: Object.is,
      _1782: o => o instanceof Array,
      _1783: (a, i) => a.push(i),
      _1787: a => a.pop(),
      _1788: (a, i) => a.splice(i, 1),
      _1789: (a, s) => a.join(s),
      _1790: (a, s, e) => a.slice(s, e),
      _1792: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1793: a => a.length,
      _1795: (a, i) => a[i],
      _1796: (a, i, v) => a[i] = v,
      _1798: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1799: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1801: o => o instanceof Uint8Array,
      _1802: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1803: o => o instanceof Int8Array,
      _1804: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1805: o => o instanceof Uint8ClampedArray,
      _1806: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1807: o => o instanceof Uint16Array,
      _1808: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1809: o => o instanceof Int16Array,
      _1810: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1811: o => o instanceof Uint32Array,
      _1812: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1813: o => o instanceof Int32Array,
      _1814: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1816: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1817: o => o instanceof Float32Array,
      _1818: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1819: o => o instanceof Float64Array,
      _1820: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1821: (t, s) => t.set(s),
      _1822: l => new DataView(new ArrayBuffer(l)),
      _1823: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1825: o => o.buffer,
      _1826: o => o.byteOffset,
      _1827: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1828: (b, o) => new DataView(b, o),
      _1829: (b, o, l) => new DataView(b, o, l),
      _1830: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1831: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1832: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1833: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1834: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1835: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1836: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1837: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1838: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1839: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1840: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1841: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1844: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1845: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1846: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1847: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1848: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1849: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1862: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1863: (handle) => clearTimeout(handle),
      _1864: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1865: (handle) => clearInterval(handle),
      _1866: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1867: () => Date.now(),
      _1868: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _1869: (x0,x1) => x0.exec(x1),
      _1870: (x0,x1) => x0.test(x1),
      _1871: x0 => x0.pop(),
      _1873: o => o === undefined,
      _1875: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _1877: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _1878: o => o instanceof RegExp,
      _1879: (l, r) => l === r,
      _1880: o => o,
      _1881: o => o,
      _1882: o => o,
      _1883: b => !!b,
      _1884: o => o.length,
      _1886: (o, i) => o[i],
      _1887: f => f.dartFunction,
      _1888: () => ({}),
      _1889: () => [],
      _1891: () => globalThis,
      _1892: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _1894: (o, p) => o[p],
      _1895: (o, p, v) => o[p] = v,
      _1896: (o, m, a) => o[m].apply(o, a),
      _1898: o => String(o),
      _1899: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _1900: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1900(f,arguments.length,x0) }),
      _1901: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1901(f,arguments.length,x0,x1) }),
      _1902: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        if (o instanceof Promise) return 18;
        return 19;
      },
      _1903: o => [o],
      _1904: (o0, o1) => [o0, o1],
      _1905: (o0, o1, o2) => [o0, o1, o2],
      _1906: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _1907: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1908: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1911: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1912: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1913: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1914: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1915: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _1916: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _1917: x0 => new ArrayBuffer(x0),
      _1918: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _1919: x0 => x0.input,
      _1920: x0 => x0.index,
      _1922: x0 => x0.flags,
      _1923: x0 => x0.multiline,
      _1924: x0 => x0.ignoreCase,
      _1925: x0 => x0.unicode,
      _1926: x0 => x0.dotAll,
      _1927: (x0,x1) => { x0.lastIndex = x1 },
      _1928: (o, p) => p in o,
      _1929: (o, p) => o[p],
      _1930: (o, p, v) => o[p] = v,
      _1931: (o, p) => delete o[p],
      _1965: (x0,x1,x2) => globalThis.google.maps.event.addListener(x0,x1,x2),
      _1966: x0 => x0.remove(),
      _2340: x0 => x0.getBounds(),
      _2341: x0 => x0.getCenter(),
      _2345: x0 => x0.getHeading(),
      _2350: x0 => x0.getProjection(),
      _2353: x0 => x0.getTilt(),
      _2355: x0 => x0.getZoom(),
      _2360: (x0,x1) => x0.setHeading(x1),
      _2363: (x0,x1) => x0.setOptions(x1),
      _2366: (x0,x1) => x0.setTilt(x1),
      _2368: (x0,x1) => x0.setZoom(x1),
      _2369: f => finalizeWrapper(f, function() { return dartInstance.exports._2369(f,arguments.length) }),
      _2371: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2371(f,arguments.length,x0) }),
      _2378: f => finalizeWrapper(f, function() { return dartInstance.exports._2378(f,arguments.length) }),
      _2387: f => finalizeWrapper(f, function() { return dartInstance.exports._2387(f,arguments.length) }),
      _2390: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2390(f,arguments.length,x0) }),
      _2391: x0 => x0.latLng,
      _2437: x0 => x0.latLng,
      _2444: (x0,x1) => { x0.cameraControl = x1 },
      _2448: (x0,x1) => { x0.center = x1 },
      _2466: (x0,x1) => { x0.fullscreenControl = x1 },
      _2469: (x0,x1) => { x0.gestureHandling = x1 },
      _2482: (x0,x1) => { x0.mapId = x1 },
      _2484: (x0,x1) => { x0.mapTypeControl = x1 },
      _2488: (x0,x1) => { x0.mapTypeId = x1 },
      _2490: (x0,x1) => { x0.maxZoom = x1 },
      _2492: (x0,x1) => { x0.minZoom = x1 },
      _2503: x0 => x0.rotateControl,
      _2504: (x0,x1) => { x0.rotateControl = x1 },
      _2516: (x0,x1) => { x0.streetViewControl = x1 },
      _2519: (x0,x1) => { x0.styles = x1 },
      _2522: (x0,x1) => { x0.tilt = x1 },
      _2526: (x0,x1) => { x0.zoom = x1 },
      _2528: (x0,x1) => { x0.zoomControl = x1 },
      _2536: () => globalThis.google.maps.MapTypeId.HYBRID,
      _2537: () => globalThis.google.maps.MapTypeId.ROADMAP,
      _2538: () => globalThis.google.maps.MapTypeId.SATELLITE,
      _2539: () => globalThis.google.maps.MapTypeId.TERRAIN,
      _2544: (x0,x1) => { x0.stylers = x1 },
      _2546: (x0,x1) => { x0.elementType = x1 },
      _2548: (x0,x1) => { x0.featureType = x1 },
      _2641: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._2641(f,arguments.length,x0,x1,x2) }),
      _2642: (x0,x1,x2) => ({map: x0,markers: x1,onClusterClick: x2}),
      _2653: x0 => new markerClusterer.MarkerClusterer(x0),
      _3247: x0 => x0.lat(),
      _3248: x0 => x0.lng(),
      _3276: x0 => x0.getNorthEast(),
      _3277: x0 => x0.getSouthWest(),
      _3308: x0 => x0.x,
      _3310: x0 => x0.y,
      _4356: (x0,x1,x2) => x0.fromLatLngToPoint(x1,x2),
      _4357: (x0,x1) => x0.fromLatLngToPoint(x1),
      _4359: (x0,x1,x2) => x0.fromPointToLatLng(x1,x2),
      _4555: () => new XMLHttpRequest(),
      _4558: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
      _4559: (x0,x1) => x0.send(x1),
      _4560: x0 => x0.send(),
      _4562: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._4562(f,arguments.length,x0) }),
      _4563: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._4563(f,arguments.length,x0) }),
      _4575: () => new AbortController(),
      _4576: x0 => x0.abort(),
      _4577: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _4578: (x0,x1) => globalThis.fetch(x0,x1),
      _4579: (x0,x1) => x0.get(x1),
      _4580: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._4580(f,arguments.length,x0,x1,x2) }),
      _4581: (x0,x1) => x0.forEach(x1),
      _4582: x0 => x0.getReader(),
      _4583: x0 => x0.cancel(),
      _4584: x0 => x0.read(),
      _4585: (x0,x1,x2) => x0.open(x1,x2),
      _4586: x0 => x0.abort(),
      _4587: x0 => x0.getAllResponseHeaders(),
      _4588: (x0,x1) => x0.key(x1),
      _4593: x0 => x0.trustedTypes,
      _4594: (x0,x1) => { x0.text = x1 },
      _4595: x0 => x0.random(),
      _4596: (x0,x1) => x0.getRandomValues(x1),
      _4597: () => globalThis.crypto,
      _4598: () => globalThis.Math,
      _4606: Function.prototype.call.bind(Number.prototype.toString),
      _4607: Function.prototype.call.bind(BigInt.prototype.toString),
      _4608: Function.prototype.call.bind(Number.prototype.toString),
      _4609: (d, digits) => d.toFixed(digits),
      _4700: () => globalThis.document,
      _4706: (x0,x1) => { x0.height = x1 },
      _4708: (x0,x1) => { x0.width = x1 },
      _4717: x0 => x0.style,
      _4720: x0 => x0.src,
      _4721: (x0,x1) => { x0.src = x1 },
      _4722: x0 => x0.naturalWidth,
      _4723: x0 => x0.naturalHeight,
      _4739: x0 => x0.status,
      _4740: (x0,x1) => { x0.responseType = x1 },
      _4742: x0 => x0.response,
      _4783: x0 => x0.readyState,
      _4785: (x0,x1) => { x0.timeout = x1 },
      _4787: (x0,x1) => { x0.withCredentials = x1 },
      _4788: x0 => x0.upload,
      _4789: x0 => x0.responseURL,
      _4790: x0 => x0.status,
      _4791: x0 => x0.statusText,
      _4793: (x0,x1) => { x0.responseType = x1 },
      _4794: x0 => x0.response,
      _4806: x0 => x0.loaded,
      _4807: x0 => x0.total,
      _4870: x0 => x0.style,
      _5085: (x0,x1) => { x0.href = x1 },
      _6107: (x0,x1) => { x0.src = x1 },
      _6109: (x0,x1) => { x0.type = x1 },
      _6113: (x0,x1) => { x0.async = x1 },
      _6117: (x0,x1) => { x0.crossOrigin = x1 },
      _6119: (x0,x1) => { x0.text = x1 },
      _6575: () => globalThis.window,
      _6618: x0 => x0.location,
      _6637: x0 => x0.navigator,
      _6899: x0 => x0.trustedTypes,
      _6900: x0 => x0.sessionStorage,
      _6901: x0 => x0.localStorage,
      _6916: x0 => x0.hostname,
      _7007: x0 => x0.geolocation,
      _7012: x0 => x0.permissions,
      _7026: x0 => x0.userAgent,
      _7234: x0 => x0.length,
      _9179: x0 => x0.signal,
      _9251: () => globalThis.document,
      _9332: x0 => x0.body,
      _9334: x0 => x0.head,
      _9663: (x0,x1) => { x0.id = x1 },
      _9686: x0 => x0.innerHTML,
      _9687: (x0,x1) => { x0.innerHTML = x1 },
      _11009: x0 => x0.value,
      _11011: x0 => x0.done,
      _11708: x0 => x0.url,
      _11710: x0 => x0.status,
      _11712: x0 => x0.statusText,
      _11713: x0 => x0.headers,
      _11714: x0 => x0.body,
      _12101: x0 => x0.state,
      _13418: x0 => x0.coords,
      _13419: x0 => x0.timestamp,
      _13421: x0 => x0.accuracy,
      _13422: x0 => x0.latitude,
      _13423: x0 => x0.longitude,
      _13424: x0 => x0.altitude,
      _13425: x0 => x0.altitudeAccuracy,
      _13426: x0 => x0.heading,
      _13427: x0 => x0.speed,
      _13428: x0 => x0.code,
      _13429: x0 => x0.message,
      _14279: (x0,x1) => { x0.height = x1 },
      _14969: (x0,x1) => { x0.width = x1 },
      _15337: x0 => x0.name,
      _16053: () => globalThis.console,
      _16081: (x0,x1,x2,x3,x4,x5,x6,x7) => ({hue: x0,lightness: x1,saturation: x2,gamma: x3,invert_lightness: x4,visibility: x5,color: x6,weight: x7}),
      _16082: x0 => x0.name,
      _16083: x0 => x0.message,
      _16084: x0 => x0.code,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      S: new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
