import {
  _extends
} from "./chunk-PQEZCWQY.js";
import {
  __toESM,
  require_react
} from "./chunk-QSQYAWSL.js";

// node_modules/@tanstack/react-location/build/esm/index.js
var React = __toESM(require_react());

// node_modules/history/index.js
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
var readOnly = true ? function(obj) {
  return Object.freeze(obj);
} : function(obj) {
  return obj;
};
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
var BeforeUnloadEventType = "beforeunload";
var HashChangeEventType = "hashchange";
var PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$window = _options.window, window2 = _options$window === void 0 ? document.defaultView : _options$window;
  var globalHistory = window2.history;
  function getIndexAndLocation() {
    var _window$location = window2.location, pathname = _window$location.pathname, search = _window$location.search, hash = _window$location.hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || "default"
    })];
  }
  var blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;
      var _getIndexAndLocation = getIndexAndLocation(), nextIndex = _getIndexAndLocation[0], nextLocation = _getIndexAndLocation[1];
      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;
          if (delta) {
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          true ? warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better what
            // is going on and how to avoid it.
            "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation."
          ) : void 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }
  window2.addEventListener(PopStateEventType, handlePop);
  var action = Action.Pop;
  var _getIndexAndLocation2 = getIndexAndLocation(), index = _getIndexAndLocation2[0], location = _getIndexAndLocation2[1];
  var listeners = createEvents();
  var blockers = createEvents();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }
    return readOnly(_extends({
      pathname: location.pathname,
      hash: "",
      search: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      key: createKey()
    }));
  }
  function getHistoryStateAndUrl(nextLocation, index2) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index2
    }, createHref(nextLocation)];
  }
  function allowTx(action2, location2, retry) {
    return !blockers.length || (blockers.call({
      action: action2,
      location: location2,
      retry
    }), false);
  }
  function applyTx(nextAction) {
    action = nextAction;
    var _getIndexAndLocation3 = getIndexAndLocation();
    index = _getIndexAndLocation3[0];
    location = _getIndexAndLocation3[1];
    listeners.call({
      action,
      location
    });
  }
  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr[0], url = _getHistoryStateAndUr[1];
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        window2.location.assign(url);
      }
      applyTx(nextAction);
    }
  }
  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr2[0], url = _getHistoryStateAndUr2[1];
      globalHistory.replaceState(historyState, "", url);
      applyTx(nextAction);
    }
  }
  function go(delta) {
    globalHistory.go(delta);
  }
  var history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);
      if (blockers.length === 1) {
        window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
      return function() {
        unblock();
        if (!blockers.length) {
          window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  var _options2 = options, _options2$window = _options2.window, window2 = _options2$window === void 0 ? document.defaultView : _options2$window;
  var globalHistory = window2.history;
  function getIndexAndLocation() {
    var _parsePath = parsePath(window2.location.hash.substr(1)), _parsePath$pathname = _parsePath.pathname, pathname = _parsePath$pathname === void 0 ? "/" : _parsePath$pathname, _parsePath$search = _parsePath.search, search = _parsePath$search === void 0 ? "" : _parsePath$search, _parsePath$hash = _parsePath.hash, hash = _parsePath$hash === void 0 ? "" : _parsePath$hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || "default"
    })];
  }
  var blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;
      var _getIndexAndLocation4 = getIndexAndLocation(), nextIndex = _getIndexAndLocation4[0], nextLocation = _getIndexAndLocation4[1];
      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;
          if (delta) {
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          true ? warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation."
          ) : void 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }
  window2.addEventListener(PopStateEventType, handlePop);
  window2.addEventListener(HashChangeEventType, function() {
    var _getIndexAndLocation5 = getIndexAndLocation(), nextLocation = _getIndexAndLocation5[1];
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });
  var action = Action.Pop;
  var _getIndexAndLocation6 = getIndexAndLocation(), index = _getIndexAndLocation6[0], location = _getIndexAndLocation6[1];
  var listeners = createEvents();
  var blockers = createEvents();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getBaseHref() {
    var base = document.querySelector("base");
    var href = "";
    if (base && base.getAttribute("href")) {
      var url = window2.location.href;
      var hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href;
  }
  function createHref(to) {
    return getBaseHref() + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }
    return readOnly(_extends({
      pathname: location.pathname,
      hash: "",
      search: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      key: createKey()
    }));
  }
  function getHistoryStateAndUrl(nextLocation, index2) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index2
    }, createHref(nextLocation)];
  }
  function allowTx(action2, location2, retry) {
    return !blockers.length || (blockers.call({
      action: action2,
      location: location2,
      retry
    }), false);
  }
  function applyTx(nextAction) {
    action = nextAction;
    var _getIndexAndLocation7 = getIndexAndLocation();
    index = _getIndexAndLocation7[0];
    location = _getIndexAndLocation7[1];
    listeners.call({
      action,
      location
    });
  }
  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    true ? warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr3[0], url = _getHistoryStateAndUr3[1];
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        window2.location.assign(url);
      }
      applyTx(nextAction);
    }
  }
  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }
    true ? warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr4[0], url = _getHistoryStateAndUr4[1];
      globalHistory.replaceState(historyState, "", url);
      applyTx(nextAction);
    }
  }
  function go(delta) {
    globalHistory.go(delta);
  }
  var history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);
      if (blockers.length === 1) {
        window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
      return function() {
        unblock();
        if (!blockers.length) {
          window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  var _options3 = options, _options3$initialEntr = _options3.initialEntries, initialEntries = _options3$initialEntr === void 0 ? ["/"] : _options3$initialEntr, initialIndex = _options3.initialIndex;
  var entries = initialEntries.map(function(entry) {
    var location2 = readOnly(_extends({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: createKey()
    }, typeof entry === "string" ? parsePath(entry) : entry));
    true ? warning(location2.pathname.charAt(0) === "/", "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(entry) + ")") : void 0;
    return location2;
  });
  var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
  var action = Action.Pop;
  var location = entries[index];
  var listeners = createEvents();
  var blockers = createEvents();
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }
    return readOnly(_extends({
      pathname: location.pathname,
      search: "",
      hash: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      key: createKey()
    }));
  }
  function allowTx(action2, location2, retry) {
    return !blockers.length || (blockers.call({
      action: action2,
      location: location2,
      retry
    }), false);
  }
  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({
      action,
      location
    });
  }
  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    true ? warning(location.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.push(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }
  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }
    true ? warning(location.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }
  function go(delta) {
    var nextIndex = clamp(index + delta, 0, entries.length - 1);
    var nextAction = Action.Pop;
    var nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }
  var history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      return blockers.push(blocker);
    }
  };
  return history;
}
function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
function promptBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = "";
}
function createEvents() {
  var handlers = [];
  return {
    get length() {
      return handlers.length;
    },
    push: function push(fn) {
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(function(handler) {
          return handler !== fn;
        });
      };
    },
    call: function call(arg) {
      handlers.forEach(function(fn) {
        return fn && fn(arg);
      });
    }
  };
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function createPath(_ref) {
  var _ref$pathname = _ref.pathname, pathname = _ref$pathname === void 0 ? "/" : _ref$pathname, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? "" : _ref$hash;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  var parsedPath = {};
  if (path) {
    var hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    var searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}

// node_modules/@tanstack/react-location/build/esm/index.js
function _extends2() {
  _extends2 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends2.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function encode(obj, pfx) {
  var k, i, tmp, str = "";
  for (k in obj) {
    if ((tmp = obj[k]) !== void 0) {
      if (Array.isArray(tmp)) {
        for (i = 0; i < tmp.length; i++) {
          str && (str += "&");
          str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp[i]);
        }
      } else {
        str && (str += "&");
        str += encodeURIComponent(k) + "=" + encodeURIComponent(tmp);
      }
    }
  }
  return (pfx || "") + str;
}
function toValue(mix) {
  if (!mix)
    return "";
  var str = decodeURIComponent(mix);
  if (str === "false")
    return false;
  if (str === "true")
    return true;
  return +str * 0 === 0 ? +str : str;
}
function decode(str) {
  var tmp, k, out = {}, arr = str.split("&");
  while (tmp = arr.shift()) {
    tmp = tmp.split("=");
    k = tmp.shift();
    if (out[k] !== void 0) {
      out[k] = [].concat(out[k], toValue(tmp.shift()));
    } else {
      out[k] = toValue(tmp.shift());
    }
  }
  return out;
}
var _excluded = ["children", "location", "__experimental__snapshot"];
var _excluded2 = ["location", "__experimental__snapshot"];
var _excluded3 = ["basepath", "routes"];
var _excluded4 = ["to", "search", "hash", "children", "target", "style", "replace", "onClick", "onMouseEnter", "className", "getActiveProps", "getInactiveProps", "activeOptions", "preload", "disabled", "_ref"];
var _excluded5 = ["style", "className"];
var _excluded6 = ["style", "className"];
var _excluded7 = ["pending"];
var _excluded8 = ["children"];
var LocationContext = React.createContext(null);
var MatchesContext = React.createContext(null);
var routerContext = React.createContext(null);
var isDOM = Boolean(typeof window !== "undefined" && window.document && window.document.createElement);
var useLayoutEffect2 = isDOM ? React.useLayoutEffect : React.useEffect;
var createDefaultHistory = () => isDOM ? createBrowserHistory() : createMemoryHistory();
var Subscribable = class {
  constructor() {
    this.listeners = [];
  }
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== listener);
    };
  }
  notify() {
    this.listeners.forEach((listener) => listener());
  }
};
var ReactLocation = class extends Subscribable {
  //
  constructor(options) {
    var _options$stringifySea, _options$parseSearch;
    super();
    this.isTransitioning = false;
    this.history = (options == null ? void 0 : options.history) || createDefaultHistory();
    this.stringifySearch = (_options$stringifySea = options == null ? void 0 : options.stringifySearch) != null ? _options$stringifySea : defaultStringifySearch;
    this.parseSearch = (_options$parseSearch = options == null ? void 0 : options.parseSearch) != null ? _options$parseSearch : defaultParseSearch;
    this.current = this.parseLocation(this.history.location);
    this.destroy = this.history.listen((event) => {
      this.current = this.parseLocation(event.location, this.current);
      this.notify();
    });
  }
  buildNext(basepath, dest) {
    var _dest$to, _dest$__searchFilters, _functionalUpdate, _dest$__searchFilters2;
    if (basepath === void 0) {
      basepath = "/";
    }
    if (dest === void 0) {
      dest = {};
    }
    const from = _extends2({}, this.current, dest.from);
    const pathname = resolvePath(basepath, from.pathname, "" + ((_dest$to = dest.to) != null ? _dest$to : "."));
    const filteredSearch = (_dest$__searchFilters = dest.__searchFilters) != null && _dest$__searchFilters.length ? dest.__searchFilters.reduce((prev, next) => next(prev), from.search) : from.search;
    const updatedSearch = dest.search === true ? filteredSearch : dest.search ? (_functionalUpdate = functionalUpdate(dest.search, filteredSearch)) != null ? _functionalUpdate : {} : (_dest$__searchFilters2 = dest.__searchFilters) != null && _dest$__searchFilters2.length ? filteredSearch : {};
    const search = replaceEqualDeep(from.search, updatedSearch);
    const searchStr = this.stringifySearch(search);
    let hash = dest.hash === true ? from.hash : functionalUpdate(dest.hash, from.hash);
    hash = hash ? "#" + hash : "";
    return {
      pathname,
      search,
      searchStr,
      hash,
      href: "" + pathname + searchStr + hash,
      key: dest.key
    };
  }
  navigate(next, replace) {
    this.current = next;
    if (this.navigateTimeout)
      clearTimeout(this.navigateTimeout);
    let nextAction = "replace";
    if (!replace) {
      nextAction = "push";
    }
    const isSameUrl = this.parseLocation(this.history.location).href === this.current.href;
    if (isSameUrl && !this.current.key) {
      nextAction = "replace";
    }
    if (nextAction === "replace") {
      return this.history.replace({
        pathname: this.current.pathname,
        hash: this.current.hash,
        search: this.current.searchStr
      });
    }
    return this.history.push({
      pathname: this.current.pathname,
      hash: this.current.hash,
      search: this.current.searchStr
    });
  }
  parseLocation(location, previousLocation) {
    var _location$hash$split$;
    const parsedSearch = this.parseSearch(location.search);
    return {
      pathname: location.pathname,
      searchStr: location.search,
      search: replaceEqualDeep(previousLocation == null ? void 0 : previousLocation.search, parsedSearch),
      hash: (_location$hash$split$ = location.hash.split("#").reverse()[0]) != null ? _location$hash$split$ : "",
      href: "" + location.pathname + location.search + location.hash,
      key: location.key
    };
  }
};
function MatchesProvider(props) {
  return React.createElement(MatchesContext.Provider, props);
}
function Router(_ref2) {
  let {
    children,
    location,
    __experimental__snapshot
  } = _ref2, rest = _objectWithoutPropertiesLoose(_ref2, _excluded);
  const routerRef = React.useRef(null);
  if (!routerRef.current) {
    routerRef.current = new RouterInstance({
      location,
      __experimental__snapshot,
      routes: rest.routes
    });
  }
  const router = routerRef.current;
  const [nonce, rerender] = React.useReducer(() => ({}), {});
  router.update(rest);
  useLayoutEffect2(() => {
    return router.subscribe(() => {
      rerender();
    });
  }, []);
  useLayoutEffect2(() => {
    return router.updateLocation(location.current).unsubscribe;
  }, [location.current.key]);
  return React.createElement(LocationContext.Provider, {
    value: {
      location
    }
  }, React.createElement(routerContext.Provider, {
    value: {
      router
    }
  }, React.createElement(InitialSideEffects, null), React.createElement(MatchesProvider, {
    value: [router.rootMatch, ...router.state.matches]
  }, children != null ? children : React.createElement(Outlet, null))));
}
function InitialSideEffects() {
  const location = useLocation();
  const buildNext = useBuildNext();
  const navigate = useNavigate();
  useLayoutEffect2(() => {
    const next = buildNext({
      to: ".",
      search: true,
      hash: true
    });
    if (next.href !== location.current.href) {
      navigate({
        to: ".",
        search: true,
        hash: true,
        fromCurrent: true,
        replace: true
      });
    }
  }, []);
  return null;
}
var RouterInstance = class extends Subscribable {
  constructor(_ref3) {
    var _experimental__snaps5;
    let {
      location,
      __experimental__snapshot
    } = _ref3, rest = _objectWithoutPropertiesLoose(_ref3, _excluded2);
    super();
    this.routesById = {};
    this.update = (_ref4) => {
      let {
        basepath,
        routes
      } = _ref4, opts = _objectWithoutPropertiesLoose(_ref4, _excluded3);
      Object.assign(this, opts);
      this.basepath = cleanPath("/" + (basepath != null ? basepath : ""));
      this.routesById = {};
      const recurseRoutes = (routes2, parent) => {
        return routes2.map((route) => {
          var _route$path, _route$pendingMs, _route$pendingMinMs, _route$children;
          const path = (_route$path = route.path) != null ? _route$path : "*";
          const id = joinPaths([(parent == null ? void 0 : parent.id) === "root" ? "" : parent == null ? void 0 : parent.id, "" + (path == null ? void 0 : path.replace(/(.)\/$/, "$1")) + (route.id ? "-" + route.id : "")]);
          route = _extends2({}, route, {
            pendingMs: (_route$pendingMs = route.pendingMs) != null ? _route$pendingMs : opts == null ? void 0 : opts.defaultPendingMs,
            pendingMinMs: (_route$pendingMinMs = route.pendingMinMs) != null ? _route$pendingMinMs : opts == null ? void 0 : opts.defaultPendingMinMs,
            id
          });
          if (this.routesById[id]) {
            if (true) {
              console.warn("Duplicate routes found with id: " + id, this.routesById, route);
            }
            throw new Error();
          }
          this.routesById[id] = route;
          route.children = (_route$children = route.children) != null && _route$children.length ? recurseRoutes(route.children, route) : void 0;
          return route;
        });
      };
      this.routes = recurseRoutes(routes);
      this.rootMatch = {
        id: "root",
        params: {},
        search: {},
        pathname: this.basepath,
        route: null,
        ownData: {},
        data: {},
        isLoading: false,
        status: "resolved"
      };
    };
    this.setState = (updater) => {
      const newState = updater({
        state: this.state,
        pending: this.pending
      });
      this.state = newState.state;
      this.pending = newState.pending;
      this.cleanMatchCache();
      this.notify();
    };
    this.matchCache = {};
    this.cleanMatchCache = () => {
      var _this$state$matches, _this$pending$matches, _this$pending;
      const activeMatchIds = [...(_this$state$matches = this == null ? void 0 : this.state.matches) != null ? _this$state$matches : [], ...(_this$pending$matches = this == null ? void 0 : (_this$pending = this.pending) == null ? void 0 : _this$pending.matches) != null ? _this$pending$matches : []].map((d) => d.id);
      Object.values(this.matchCache).forEach((match) => {
        var _match$updatedAt;
        if (!match.updatedAt) {
          return;
        }
        if (activeMatchIds.includes(match.id)) {
          return;
        }
        const age = Date.now() - ((_match$updatedAt = match.updatedAt) != null ? _match$updatedAt : 0);
        if (!match.maxAge || age > match.maxAge) {
          if (match.route.unloader) {
            match.route.unloader(match);
          }
          delete this.matchCache[match.id];
        }
      });
    };
    this.updateLocation = (next) => {
      let unsubscribe;
      const promise = new Promise((resolve) => {
        const matchLoader = new MatchLoader(this, next);
        this.setState((old) => {
          return _extends2({}, old, {
            pending: {
              location: matchLoader.location,
              matches: matchLoader.matches
            }
          });
        });
        unsubscribe = matchLoader.subscribe(() => {
          const currentMatches = this.state.matches;
          currentMatches.filter((d) => {
            return !matchLoader.matches.find((dd) => dd.id === d.id);
          }).forEach((d) => {
            d.onExit == null ? void 0 : d.onExit(d);
          });
          currentMatches.filter((d) => {
            return matchLoader.matches.find((dd) => dd.id === d.id);
          }).forEach((d) => {
            d.route.onTransition == null ? void 0 : d.route.onTransition(d);
          });
          matchLoader.matches.filter((d) => {
            return !currentMatches.find((dd) => dd.id === d.id);
          }).forEach((d) => {
            d.onExit = d.route.onMatch == null ? void 0 : d.route.onMatch(d);
          });
          this.setState((old) => {
            return _extends2({}, old, {
              state: {
                location: matchLoader.location,
                matches: matchLoader.matches
              },
              pending: void 0
            });
          });
          resolve();
        });
        matchLoader.loadData();
        matchLoader.startPending();
      });
      return {
        promise,
        unsubscribe
      };
    };
    this.__experimental__createSnapshot = () => {
      return {
        location: this.state.location,
        matches: this.state.matches.map((_ref5) => {
          let {
            ownData,
            id
          } = _ref5;
          return {
            id,
            ownData
          };
        })
      };
    };
    this.update(rest);
    let matches = [];
    if (__experimental__snapshot) {
      const matchLoader = new MatchLoader(this, location.current);
      matchLoader.matches.forEach((match, index) => {
        var _experimental__snaps, _experimental__snaps3, _experimental__snaps4;
        if (match.id !== ((_experimental__snaps = __experimental__snapshot.matches[index]) == null ? void 0 : _experimental__snaps.id)) {
          var _experimental__snaps2;
          throw new Error("Router hydration mismatch: " + match.id + " !== " + ((_experimental__snaps2 = __experimental__snapshot.matches[index]) == null ? void 0 : _experimental__snaps2.id));
        }
        match.ownData = (_experimental__snaps3 = (_experimental__snaps4 = __experimental__snapshot.matches[index]) == null ? void 0 : _experimental__snaps4.ownData) != null ? _experimental__snaps3 : {};
      });
      cascadeMatchData(matchLoader.matches);
      matches = matchLoader.matches;
    }
    this.state = {
      location: (_experimental__snaps5 = __experimental__snapshot == null ? void 0 : __experimental__snapshot.location) != null ? _experimental__snaps5 : location.current,
      matches
    };
    location.subscribe(() => this.notify());
  }
};
function useLocation() {
  const context = React.useContext(LocationContext);
  warning2(!!context, "useLocation must be used within a <ReactLocation />");
  return context.location;
}
var RouteMatch = class {
  constructor(unloadedMatch) {
    this.status = "loading";
    this.ownData = {};
    this.data = {};
    this.isLoading = false;
    this.notify = (isSoft) => {
      var _this$matchLoader;
      (_this$matchLoader = this.matchLoader) == null ? void 0 : _this$matchLoader.preNotify(isSoft ? this : void 0);
    };
    this.assignMatchLoader = (matchLoader) => {
      this.matchLoader = matchLoader;
    };
    this.startPending = () => {
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
      }
      if (this.route.pendingMs !== void 0) {
        this.pendingTimeout = setTimeout(() => {
          var _this$notify;
          if (this.status === "loading") {
            this.status = "pending";
          }
          (_this$notify = this.notify) == null ? void 0 : _this$notify.call(this);
          if (typeof this.route.pendingMinMs !== "undefined") {
            this.pendingMinPromise = new Promise((r) => setTimeout(r, this.route.pendingMinMs));
          }
        }, this.route.pendingMs);
      }
    };
    this.load = (opts) => {
      var _ref6, _opts$maxAge;
      this.maxAge = (_ref6 = (_opts$maxAge = opts.maxAge) != null ? _opts$maxAge : this.route.loaderMaxAge) != null ? _ref6 : opts.router.defaultLoaderMaxAge;
      if (this.loaderPromise) {
        return;
      }
      const importer = this.route.import;
      this.loaderPromise = (!importer ? Promise.resolve() : (() => {
        this.isLoading = true;
        return importer({
          params: this.params,
          search: this.search
        }).then((imported) => {
          this.route = _extends2({}, this.route, imported);
        });
      })()).then(() => {
        const elementPromises = [];
        const elementTypes = ["element", "errorElement", "pendingElement"];
        elementTypes.forEach((type) => {
          const routeElement = this.route[type];
          if (this[type]) {
            return;
          }
          if (typeof routeElement === "function") {
            this.isLoading = true;
            elementPromises.push(routeElement(this).then((res) => {
              this[type] = res;
            }));
          } else {
            this[type] = this.route[type];
          }
        });
        const loader = this.route.loader;
        const dataPromise = !loader ? Promise.resolve() : new Promise(async (resolveLoader) => {
          this.isLoading = true;
          const loaderReady = (status) => {
            this.updatedAt = Date.now();
            resolveLoader(this.ownData);
            this.status = status;
          };
          const resolve = (data) => {
            this.ownData = data;
            this.error = void 0;
            loaderReady("resolved");
          };
          const reject = (err) => {
            console.error(err);
            this.error = err;
            loaderReady("rejected");
          };
          try {
            resolve(await loader(this, {
              parentMatch: opts.parentMatch,
              dispatch: async (event) => {
                var _this$notify2;
                if (event.type === "resolve") {
                  resolve(event.data);
                } else if (event.type === "reject") {
                  reject(event.error);
                } else if (event.type === "loading") {
                  this.isLoading = true;
                } else if (event.type === "maxAge") {
                  this.maxAge = event.maxAge;
                }
                this.updatedAt = Date.now();
                (_this$notify2 = this.notify) == null ? void 0 : _this$notify2.call(this, true);
              }
            }));
          } catch (err) {
            reject(err);
          }
        });
        return Promise.all([...elementPromises, dataPromise]).then(() => {
          this.status = "resolved";
          this.isLoading = false;
          this.startPending = void 0;
        }).then(() => this.pendingMinPromise).then(() => {
          var _this$notify3;
          if (this.pendingTimeout) {
            clearTimeout(this.pendingTimeout);
          }
          (_this$notify3 = this.notify) == null ? void 0 : _this$notify3.call(this, true);
        });
      }).then(() => {
        return this.ownData;
      });
    };
    Object.assign(this, unloadedMatch);
  }
};
var MatchLoader = class extends Subscribable {
  constructor(router, nextLocation) {
    var _this;
    super();
    _this = this;
    this.preNotifiedMatches = [];
    this.status = "pending";
    this.preNotify = (routeMatch) => {
      if (routeMatch) {
        if (!this.preNotifiedMatches.includes(routeMatch)) {
          this.preNotifiedMatches.push(routeMatch);
        }
      }
      if (!routeMatch || this.preNotifiedMatches.length === this.matches.length) {
        this.status = "resolved";
        cascadeMatchData(this.matches);
        this.notify();
      }
    };
    this.loadData = async function(_temp) {
      var _this$matches;
      let {
        maxAge
      } = _temp === void 0 ? {} : _temp;
      _this.router.cleanMatchCache();
      if (!((_this$matches = _this.matches) != null && _this$matches.length)) {
        _this.preNotify();
        return;
      }
      _this.firstRenderPromises = [];
      _this.matches.forEach((match, index) => {
        var _this$matches2, _this$firstRenderProm;
        const parentMatch = (_this$matches2 = _this.matches) == null ? void 0 : _this$matches2[index - 1];
        match.assignMatchLoader == null ? void 0 : match.assignMatchLoader(_this);
        match.load == null ? void 0 : match.load({
          maxAge,
          parentMatch,
          router: _this.router
        });
        (_this$firstRenderProm = _this.firstRenderPromises) == null ? void 0 : _this$firstRenderProm.push(match.loaderPromise);
      });
      return await Promise.all(_this.firstRenderPromises).then(() => {
        _this.preNotify();
        return _this.matches;
      });
    };
    this.load = async function(_temp2) {
      let {
        maxAge
      } = _temp2 === void 0 ? {} : _temp2;
      return await _this.loadData({
        maxAge
      });
    };
    this.startPending = async () => {
      this.matches.forEach((match) => match.startPending == null ? void 0 : match.startPending());
    };
    this.router = router;
    this.location = nextLocation;
    this.matches = [];
    const unloadedMatches = matchRoutes(this.router, this.location);
    this.matches = unloadedMatches == null ? void 0 : unloadedMatches.map((unloadedMatch) => {
      if (!this.router.matchCache[unloadedMatch.id]) {
        this.router.matchCache[unloadedMatch.id] = new RouteMatch(unloadedMatch);
      }
      return this.router.matchCache[unloadedMatch.id];
    });
  }
};
function cascadeMatchData(matches) {
  matches == null ? void 0 : matches.forEach((match, index) => {
    var _parentMatch$data;
    const parentMatch = matches == null ? void 0 : matches[index - 1];
    match.data = _extends2({}, (_parentMatch$data = parentMatch == null ? void 0 : parentMatch.data) != null ? _parentMatch$data : {}, match.ownData);
  });
}
function useRouter() {
  const value = React.useContext(routerContext);
  if (!value) {
    warning2(true, "You are trying to use useRouter() outside of ReactLocation!");
    throw new Error();
  }
  return value.router;
}
function matchRoutes(router, currentLocation) {
  if (!router.routes.length) {
    return [];
  }
  const matches = [];
  const recurse = async (routes, parentMatch) => {
    var _route$children3;
    let {
      pathname,
      params
    } = parentMatch;
    const filteredRoutes = router != null && router.filterRoutes ? router == null ? void 0 : router.filterRoutes(routes) : routes;
    const route = filteredRoutes.find((route2) => {
      var _route$children2, _route$caseSensitive;
      const fullRoutePathName = joinPaths([pathname, route2.path]);
      const fuzzy = !!(route2.path !== "/" || (_route$children2 = route2.children) != null && _route$children2.length);
      const matchParams = matchRoute(currentLocation, {
        to: fullRoutePathName,
        search: route2.search,
        fuzzy,
        caseSensitive: (_route$caseSensitive = route2.caseSensitive) != null ? _route$caseSensitive : router.caseSensitive
      });
      if (matchParams) {
        params = _extends2({}, params, matchParams);
      }
      return !!matchParams;
    });
    if (!route) {
      return;
    }
    const interpolatedPath = interpolatePath(route.path, params);
    pathname = joinPaths([pathname, interpolatedPath]);
    const interpolatedId = interpolatePath(route.id, params, true);
    const match = {
      id: interpolatedId,
      route,
      params,
      pathname,
      search: currentLocation.search
    };
    matches.push(match);
    if ((_route$children3 = route.children) != null && _route$children3.length) {
      recurse(route.children, match);
    }
  };
  recurse(router.routes, router.rootMatch);
  return matches;
}
function interpolatePath(path, params, leaveWildcard) {
  const interpolatedPathSegments = parsePathname(path);
  return joinPaths(interpolatedPathSegments.map((segment) => {
    if (segment.value === "*" && !leaveWildcard) {
      return "";
    }
    if (segment.type === "param") {
      var _segment$value$substr;
      return (_segment$value$substr = params[segment.value.substring(1)]) != null ? _segment$value$substr : "";
    }
    return segment.value;
  }));
}
function useLoadRoute() {
  const location = useLocation();
  const match = useMatch();
  const router = useRouter();
  const buildNext = useBuildNext();
  return useLatestCallback(async function(navigate, opts) {
    var _navigate$from;
    if (navigate === void 0) {
      navigate = location.current;
    }
    const next = buildNext(_extends2({}, navigate, {
      from: (_navigate$from = navigate.from) != null ? _navigate$from : {
        pathname: match.pathname
      }
    }));
    const matchLoader = new MatchLoader(router, next);
    return await matchLoader.load(opts);
  });
}
function useParentMatches() {
  const router = useRouter();
  const match = useMatch();
  const matches = router.state.matches;
  return matches.slice(0, matches.findIndex((d) => d.id === match.id) - 1);
}
function useMatches() {
  return React.useContext(MatchesContext);
}
function useMatch() {
  var _useMatches;
  return (_useMatches = useMatches()) == null ? void 0 : _useMatches[0];
}
function useNavigate() {
  const location = useLocation();
  const match = useMatch();
  const buildNext = useBuildNext();
  function navigate(_ref7) {
    var _fromCurrent;
    let {
      search,
      hash,
      replace,
      from,
      to,
      fromCurrent
    } = _ref7;
    fromCurrent = (_fromCurrent = fromCurrent) != null ? _fromCurrent : typeof to === "undefined";
    const next = buildNext({
      to,
      search,
      hash,
      from: fromCurrent ? location.current : from != null ? from : {
        pathname: match.pathname
      }
    });
    location.navigate(next, replace);
  }
  return useLatestCallback(navigate);
}
function Navigate(options) {
  let navigate = useNavigate();
  useLayoutEffect2(() => {
    navigate(options);
  }, [navigate]);
  return null;
}
function useBuildNext() {
  const location = useLocation();
  const router = useRouter();
  const buildNext = (opts) => {
    const next = location.buildNext(router.basepath, opts);
    const matches = matchRoutes(router, next);
    const __searchFilters = matches.map((match) => {
      var _match$route$searchFi;
      return (_match$route$searchFi = match.route.searchFilters) != null ? _match$route$searchFi : [];
    }).flat().filter(Boolean);
    return location.buildNext(router.basepath, _extends2({}, opts, {
      __searchFilters
    }));
  };
  return useLatestCallback(buildNext);
}
var Link = function Link2(_ref8) {
  var _preload;
  let {
    to = ".",
    search,
    hash,
    children,
    target,
    style = {},
    replace,
    onClick,
    onMouseEnter,
    className = "",
    getActiveProps = () => ({
      className: "active"
    }),
    getInactiveProps = () => ({}),
    activeOptions,
    preload,
    disabled,
    _ref
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded4);
  const loadRoute = useLoadRoute();
  const match = useMatch();
  const location = useLocation();
  const router = useRouter();
  const navigate = useNavigate();
  const buildNext = useBuildNext();
  preload = (_preload = preload) != null ? _preload : router.defaultLinkPreloadMaxAge;
  try {
    const url = new URL("" + to);
    warning2(false, "<Link /> should not be used for external URLs like: " + url.href);
  } catch (e) {
  }
  const next = buildNext({
    to,
    search,
    hash,
    from: {
      pathname: match.pathname
    }
  });
  const handleClick = (e) => {
    if (disabled)
      return;
    if (onClick)
      onClick(e);
    if (!isCtrlEvent(e) && !e.defaultPrevented && (!target || target === "_self") && e.button === 0) {
      e.preventDefault();
      navigate({
        to,
        search,
        hash,
        replace,
        from: {
          pathname: match.pathname
        }
      });
    }
  };
  const handleMouseEnter = (e) => {
    if (onMouseEnter)
      onMouseEnter(e);
    if (preload && preload > 0) {
      loadRoute({
        to,
        search,
        hash
      }, {
        maxAge: preload
      });
    }
  };
  const pathIsEqual = location.current.pathname === next.pathname;
  const currentPathSplit = location.current.pathname.split("/");
  const nextPathSplit = next.pathname.split("/");
  const pathIsFuzzyEqual = nextPathSplit.every((d, i) => d === currentPathSplit[i]);
  const hashIsEqual = location.current.hash === next.hash;
  const pathTest = activeOptions != null && activeOptions.exact ? pathIsEqual : pathIsFuzzyEqual;
  const hashTest = activeOptions != null && activeOptions.includeHash ? hashIsEqual : true;
  const isActive = pathTest && hashTest;
  const _ref9 = isActive ? getActiveProps() : {}, {
    style: activeStyle = {},
    className: activeClassName = ""
  } = _ref9, activeRest = _objectWithoutPropertiesLoose(_ref9, _excluded5);
  const _ref10 = isActive ? {} : getInactiveProps(), {
    style: inactiveStyle = {},
    className: inactiveClassName = ""
  } = _ref10, inactiveRest = _objectWithoutPropertiesLoose(_ref10, _excluded6);
  return React.createElement("a", _extends2({
    ref: _ref,
    href: disabled ? void 0 : next.href,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    target,
    style: _extends2({}, style, activeStyle, inactiveStyle),
    className: [className, activeClassName, inactiveClassName].filter(Boolean).join(" ") || void 0
  }, disabled ? {
    role: "link",
    "aria-disabled": true
  } : void 0, rest, activeRest, inactiveRest, {
    children: typeof children === "function" ? children({
      isActive
    }) : children
  }));
};
function Outlet() {
  var _match$errorElement;
  const router = useRouter();
  const [_, ...matches] = useMatches();
  const match = matches[0];
  if (!match) {
    return null;
  }
  const errorElement = (_match$errorElement = match.errorElement) != null ? _match$errorElement : router.defaultErrorElement;
  const element = (() => {
    var _match$pendingElement, _match$element;
    if (match.status === "rejected") {
      if (errorElement) {
        return errorElement;
      }
      if (!router.useErrorBoundary) {
        if (true) {
          const preStyle = {
            whiteSpace: "normal",
            display: "inline-block",
            background: "rgba(0,0,0,.1)",
            padding: ".1rem .2rem",
            margin: ".1rem",
            lineHeight: "1",
            borderRadius: ".25rem"
          };
          return React.createElement("div", {
            style: {
              lineHeight: "1.7"
            }
          }, React.createElement("strong", null, "The following error occured in the loader for you route at:", " ", React.createElement("pre", {
            style: preStyle
          }, match.pathname)), ".", React.createElement("br", null), React.createElement("pre", {
            style: _extends2({}, preStyle, {
              display: "block",
              padding: ".5rem",
              borderRadius: ".5rem"
            })
          }, match.error.toString()), React.createElement("br", null), "Your users won't see this message in production, but they will see", " ", React.createElement("strong", null, '"An unknown error occured!"'), ", which is at least better than breaking your entire app. 😊 For a better UX, please specify an ", React.createElement("pre", {
            style: preStyle
          }, "errorElement"), " for all of your routes that contain asynchronous behavior, or at least provide your own", React.createElement("pre", {
            style: preStyle
          }, "ErrorBoundary"), " wrapper around your renders to both the elements rendered by", " ", React.createElement("pre", {
            style: preStyle
          }, "useRoutes(routes, { useErrorBoundary: true })"), " ", "and ", React.createElement("pre", {
            style: preStyle
          }, "<Router useErrorBoundary />"), ".", " ", React.createElement("br", null), React.createElement("br", null));
        }
        return "An unknown error occured!";
      }
      throw match.error;
    }
    const pendingElement = (_match$pendingElement = match.pendingElement) != null ? _match$pendingElement : router.defaultPendingElement;
    if (match.status === "loading") {
      return null;
    }
    if (match.status === "pending") {
      if (match.route.pendingMs || pendingElement) {
        return pendingElement != null ? pendingElement : null;
      }
    }
    const matchElement = (_match$element = match.element) != null ? _match$element : router.defaultElement;
    return matchElement != null ? matchElement : React.createElement(Outlet, null);
  })();
  return React.createElement(MatchesProvider, {
    value: matches
  }, element);
}
function useResolvePath() {
  const router = useRouter();
  const match = useMatch();
  return useLatestCallback((path) => resolvePath(router.basepath, match.pathname, cleanPath(path)));
}
function useSearch() {
  const location = useLocation();
  return location.current.search;
}
function matchRoute(currentLocation, matchLocation) {
  const pathParams = matchByPath(currentLocation, matchLocation);
  const searchMatched = matchBySearch(currentLocation, matchLocation);
  if (matchLocation.to && !pathParams) {
    return;
  }
  if (matchLocation.search && !searchMatched) {
    return;
  }
  return pathParams != null ? pathParams : {};
}
function useMatchRoute() {
  const router = useRouter();
  const resolvePath2 = useResolvePath();
  return useLatestCallback((_ref11) => {
    let {
      pending
    } = _ref11, matchLocation = _objectWithoutPropertiesLoose(_ref11, _excluded7);
    matchLocation = _extends2({}, matchLocation, {
      to: matchLocation.to ? resolvePath2("" + matchLocation.to) : void 0
    });
    if (pending) {
      var _router$pending;
      if (!((_router$pending = router.pending) != null && _router$pending.location)) {
        return void 0;
      }
      return matchRoute(router.pending.location, matchLocation);
    }
    return matchRoute(router.state.location, matchLocation);
  });
}
function MatchRoute(_ref12) {
  let {
    children
  } = _ref12, rest = _objectWithoutPropertiesLoose(_ref12, _excluded8);
  const matchRoute2 = useMatchRoute();
  const match = matchRoute2(rest);
  if (typeof children === "function") {
    return children(match);
  }
  return match ? children : null;
}
function usePrompt(message, when) {
  const location = useLocation();
  React.useEffect(() => {
    if (!when)
      return;
    let unblock = location.history.block((transition) => {
      if (window.confirm(message)) {
        unblock();
        transition.retry();
      } else {
        location.current.pathname = window.location.pathname;
      }
    });
    return unblock;
  }, [when, location, message]);
}
function Prompt(_ref13) {
  let {
    message,
    when,
    children
  } = _ref13;
  usePrompt(message, when != null ? when : true);
  return children != null ? children : null;
}
function warning2(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (_unused) {
    }
  }
}
function isFunction(d) {
  return typeof d === "function";
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
function joinPaths(paths) {
  return cleanPath(paths.filter(Boolean).join("/"));
}
function cleanPath(path) {
  return ("" + path).replace(/\/{2,}/g, "/");
}
function matchByPath(currentLocation, matchLocation) {
  var _matchLocation$to;
  const baseSegments = parsePathname(currentLocation.pathname);
  const routeSegments = parsePathname("" + ((_matchLocation$to = matchLocation.to) != null ? _matchLocation$to : "*"));
  const params = {};
  let isMatch = (() => {
    for (let i = 0; i < Math.max(baseSegments.length, routeSegments.length); i++) {
      const baseSegment = baseSegments[i];
      const routeSegment = routeSegments[i];
      const isLastRouteSegment = i === routeSegments.length - 1;
      const isLastBaseSegment = i === baseSegments.length - 1;
      if (routeSegment) {
        if (routeSegment.type === "wildcard") {
          if (baseSegment != null && baseSegment.value) {
            params["*"] = joinPaths(baseSegments.slice(i).map((d) => d.value));
            return true;
          }
          return false;
        }
        if (routeSegment.type === "pathname") {
          if (routeSegment.value === "/" && !(baseSegment != null && baseSegment.value)) {
            return true;
          }
          if (baseSegment) {
            if (matchLocation.caseSensitive) {
              if (routeSegment.value !== baseSegment.value) {
                return false;
              }
            } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
              return false;
            }
          }
        }
        if (!baseSegment) {
          return false;
        }
        if (routeSegment.type === "param") {
          params[routeSegment.value.substring(1)] = baseSegment.value;
        }
      }
      if (isLastRouteSegment && !isLastBaseSegment) {
        return !!matchLocation.fuzzy;
      }
    }
    return true;
  })();
  return isMatch ? params : void 0;
}
function matchBySearch(currentLocation, matchLocation) {
  return !!(matchLocation.search && matchLocation.search(currentLocation.search));
}
function parsePathname(pathname) {
  if (!pathname) {
    return [];
  }
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(...split.map((part) => {
    if (part.startsWith("*")) {
      return {
        type: "wildcard",
        value: part
      };
    }
    if (part.charAt(0) === ":") {
      return {
        type: "param",
        value: part
      };
    }
    return {
      type: "pathname",
      value: part
    };
  }));
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  return segments;
}
function resolvePath(basepath, base, to) {
  base = base.replace(new RegExp("^" + basepath), "/");
  to = to.replace(new RegExp("^" + basepath), "/");
  let baseSegments = parsePathname(base);
  const toSegments = parsePathname(to);
  toSegments.forEach((toSegment, index) => {
    if (toSegment.value === "/") {
      if (!index) {
        baseSegments = [toSegment];
      } else if (index === toSegments.length - 1) {
        baseSegments.push(toSegment);
      } else
        ;
    } else if (toSegment.value === "..") {
      baseSegments.pop();
    } else if (toSegment.value === ".") {
      return;
    } else {
      baseSegments.push(toSegment);
    }
  });
  const joined = joinPaths([basepath, ...baseSegments.map((d) => d.value)]);
  return cleanPath(joined);
}
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function useLatestCallback(cb) {
  const stableFnRef = React.useRef();
  const cbRef = React.useRef(cb);
  cbRef.current = cb;
  if (!stableFnRef.current) {
    stableFnRef.current = function() {
      return cbRef.current(...arguments);
    };
  }
  return stableFnRef.current;
}
function replaceEqualDeep(prev, next) {
  if (prev === next) {
    return prev;
  }
  const array = Array.isArray(prev) && Array.isArray(next);
  if (array || isPlainObject(prev) && isPlainObject(next)) {
    const aSize = array ? prev.length : Object.keys(prev).length;
    const bItems = array ? next : Object.keys(next);
    const bSize = bItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i];
      copy[key] = replaceEqualDeep(prev[key], next[key]);
      if (copy[key] === prev[key]) {
        equalItems++;
      }
    }
    return aSize === bSize && equalItems === aSize ? prev : copy;
  }
  return next;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
var defaultParseSearch = parseSearchWith(JSON.parse);
var defaultStringifySearch = stringifySearchWith(JSON.stringify);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr.substring(0, 1) === "?") {
      searchStr = searchStr.substring(1);
    }
    let query = decode(searchStr);
    for (let key in query) {
      const value = query[key];
      if (typeof value === "string") {
        try {
          query[key] = parser(value);
        } catch (err) {
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify) {
  return (search) => {
    search = _extends2({}, search);
    if (search) {
      Object.keys(search).forEach((key) => {
        const val = search[key];
        if (typeof val === "undefined" || val === void 0) {
          delete search[key];
        } else if (val && typeof val === "object" && val !== null) {
          try {
            search[key] = stringify(val);
          } catch (err) {
          }
        }
      });
    }
    const searchStr = encode(search).toString();
    return searchStr ? "?" + searchStr : "";
  };
}
export {
  Link,
  MatchRoute,
  MatchesProvider,
  Navigate,
  Outlet,
  Prompt,
  ReactLocation,
  RouteMatch,
  Router,
  RouterInstance,
  cleanPath,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  defaultParseSearch,
  defaultStringifySearch,
  functionalUpdate,
  matchByPath,
  matchRoute,
  matchRoutes,
  parsePathname,
  parseSearchWith,
  resolvePath,
  stringifySearchWith,
  useLoadRoute,
  useLocation,
  useMatch,
  useMatchRoute,
  useMatches,
  useNavigate,
  useParentMatches,
  usePrompt,
  useResolvePath,
  useRouter,
  useSearch
};
/*! Bundled license information:

@tanstack/react-location/build/esm/index.js:
  (**
   * react-location
   *
   * Copyright (c) TanStack
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
//# sourceMappingURL=@tanstack_react-location.js.map
