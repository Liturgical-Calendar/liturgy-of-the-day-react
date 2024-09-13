"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.regexp.test.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/web.url-search-params.js");
var _react = require("react");
var _i18next = _interopRequireDefault(require("i18next"));
var _reactI18next = require("react-i18next");
var _translation = _interopRequireDefault(require("./locales/en/translation.json"));
var _translation2 = _interopRequireDefault(require("./locales/it/translation.json"));
var _translation3 = _interopRequireDefault(require("./locales/es/translation.json"));
var _translation4 = _interopRequireDefault(require("./locales/de/translation.json"));
var _translation5 = _interopRequireDefault(require("./locales/fr/translation.json"));
var _translation6 = _interopRequireDefault(require("./locales/pt/translation.json"));
const _excluded = ["locale", "nationalCalendar", "diocesanCalendar", "year", "LiturgyOfTheDayOuterClassnames", "allowPrevNext", "LiturgyOfTheDayPrevBtnClassnames", "LiturgyOfTheDayNextBtnClassnames"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
const resources = {
  en: {
    translation: _translation.default
  },
  it: {
    translation: _translation2.default
  },
  es: {
    translation: _translation3.default
  },
  de: {
    translation: _translation4.default
  },
  fr: {
    translation: _translation5.default
  },
  pt: {
    translation: _translation6.default
  }
};
const endpointVersion = "dev"; //could also be 'dev'...
const MetadataURL = "https://litcal.johnromanodorazio.com/api/".concat(endpointVersion, "/calendars");
const LitCalAPIURL = "https://litcal.johnromanodorazio.com/api/".concat(endpointVersion, "/calendar");
const highContrast = ["green", "red", "purple"];
const joinClassNames = (class1, classes) => [class1, ...classes.split(' ')].join(' ').trim();
_i18next.default.use(_reactI18next.initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  react: {
    useSuspense: true
  }
});
const LiturgyOfTheDay = _ref => {
  let {
      locale = '',
      nationalCalendar = '',
      diocesanCalendar = '',
      year = '',
      LiturgyOfTheDayOuterClassnames = '',
      allowPrevNext = false,
      LiturgyOfTheDayPrevBtnClassnames = '',
      LiturgyOfTheDayNextBtnClassnames = ''
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  //const [metadata, setMetadata] = useState(null);
  const [litCal, setLitCal] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [hasError, setHasError] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [dtFormat, setDtFormat] = (0, _react.useState)(new Intl.DateTimeFormat('en', {
    dateStyle: 'full'
  }));
  const [addDays, setAddDays] = (0, _react.useState)(0);
  const {
    t
  } = (0, _reactI18next.useTranslation)();
  const EventColors = _ref2 => {
    let {
      colors,
      colorsLcl
    } = _ref2;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null, t('liturgical-color'), ": "), colors.map((tColor, i) => {
      if (i === 0) {
        return /*#__PURE__*/React.createElement("span", {
          key: i
        }, /*#__PURE__*/React.createElement("i", {
          style: {
            display: 'inline-block',
            height: '1em',
            width: '1em',
            backgroundColor: tColor,
            border: '1px solid gray',
            margin: '0 6px',
            verticalAlign: 'bottom'
          }
        }), colorsLcl[i]);
      } else {
        return /*#__PURE__*/React.createElement("span", {
          key: i
        }, " ", /*#__PURE__*/React.createElement("i", null, t('or')), " ", /*#__PURE__*/React.createElement("i", {
          style: {
            display: 'inline-block',
            height: '1em',
            width: '1em',
            backgroundColor: tColor,
            border: '1px solid gray',
            margin: '0 6px',
            verticalAlign: 'bottom'
          }
        }), colorsLcl[i]);
      }
    }));
  };
  const GradeWrapper = _ref3 => {
    let {
      wrapper,
      children
    } = _ref3;
    return wrapper(children);
  };
  const filterTagsDisplayGrade = [/OrdSunday[0-9]{1,2}(_vigil){0,1}/, /Advent[1-4](_vigil){0,1}/, /Lent[1-5](_vigil){0,1}/, /Easter[1-7](_vigil){0,1}/];
  const handleLitCalBtn = ev => {
    switch (ev.target.id) {
      case 'LitCalPrevBtn':
        setAddDays(prevState => prevState - 1);
        break;
      case 'LitCalNextBtn':
        setAddDays(prevState => prevState + 1);
    }
  };
  const Festivities = _ref4 => {
    let {
      litCalData,
      dateDiff,
      liturgyOfTheDayProps
    } = _ref4;
    const {
      LiturgyOfTheDayTitleClassnames = '',
      LiturgyOfTheDayInnerClassnames = '',
      LiturgyOfTheDayFestivityNameClassnames = '',
      LiturgyOfTheDayGradeClassnames = '',
      LiturgyOfTheDayCommonClassnames = '',
      LiturgyOfTheDayLiturgicalYearClassnames = '',
      LiturgicalColorAsBG = true
    } = liturgyOfTheDayProps;
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + dateDiff);
    newDate.setUTCHours(0, 0, 0, 0);
    const timestamp = newDate.getTime() / 1000;
    let children = Object.entries(litCalData).filter(_ref5 => {
      let [key, value] = _ref5;
      return parseInt(value.date) === timestamp;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "LiturgyOfTheDayFestivitiesCollection"
    }, /*#__PURE__*/React.createElement("h2", {
      className: joinClassNames('LiturgyOfTheDayTitle', LiturgyOfTheDayTitleClassnames)
    }, t('liturgy-of'), " ", dtFormat.format(newDate)), children.map((_ref6, i) => {
      let [tag, eventData] = _ref6;
      const lclzdGrade = eventData.grade < 7 ? eventData.grade_lcl : '';
      let isSundayOrdAdvLentEaster = filterTagsDisplayGrade.some(pattern => pattern.test(tag));
      const eventDataGrade = eventData.display_grade !== '' ? eventData.display_grade : !isSundayOrdAdvLentEaster ? /*#__PURE__*/React.createElement(GradeWrapper, {
        wrapper: children => {
          switch (eventData.grade) {
            case 0:
            case 1:
              return /*#__PURE__*/React.createElement("i", null, children);
            case 5:
            case 6:
              return /*#__PURE__*/React.createElement("b", null, children);
            default:
              return children;
          }
        }
      }, lclzdGrade) : '';
      return /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayInner', LiturgyOfTheDayInnerClassnames),
        style: LiturgicalColorAsBG ? {
          backgroundColor: eventData.color[0],
          color: highContrast.includes(eventData.color[0]) ? "white" : "black"
        } : {},
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayFestivityName', LiturgyOfTheDayFestivityNameClassnames)
      }, eventData.name), /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayGrade', LiturgyOfTheDayGradeClassnames)
      }, eventDataGrade, !LiturgicalColorAsBG && /*#__PURE__*/React.createElement(EventColors, {
        colors: eventData.color,
        colorsLcl: eventData.color_lcl
      })), /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayCommon', LiturgyOfTheDayCommonClassnames)
      }, eventData.common_lcl), eventData.hasOwnProperty('liturgical_year') && /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayLiturgicalYear', LiturgyOfTheDayLiturgicalYearClassnames)
      }, eventData.liturgical_year));
    }));
  };
  (0, _react.useEffect)(() => {
    setLoading(true);
    if (locale) {
      _i18next.default.changeLanguage(Intl.getCanonicalLocales(locale));
      setDtFormat(new Intl.DateTimeFormat(Intl.getCanonicalLocales(locale), {
        dateStyle: 'full'
      }));
    }
    let CalendarURL = LitCalAPIURL;
    let CalendarURLHeaders = {};
    if (nationalCalendar !== '') {
      CalendarURL = LitCalAPIURL + '/nation/' + nationalCalendar;
    } else if (diocesanCalendar !== '') {
      CalendarURL = LitCalAPIURL + '/diocese/' + diocesanCalendar;
    } else {
      CalendarURLHeaders['Accept-Language'] = locale;
    }
    Promise.all([fetch(MetadataURL, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }), fetch(CalendarURL + new URLSearchParams({
      year: year
    }), {
      method: "GET",
      headers: _objectSpread({
        Accept: "application/json"
      }, CalendarURLHeaders)
    })]).then(responses => {
      return Promise.all(responses.map(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      }));
    }).then(dataArray => {
      setLoading(false);
      dataArray.forEach(data => {
        if (data.hasOwnProperty("litcal_metadata")) {
          //setMetadata(data.litcal_metadata);
          const {
            litcal_metadata
          } = data;
          const {
            national_calendars_keys,
            diocesan_calendars_keys
          } = litcal_metadata;
          if (nationalCalendar && !national_calendars_keys.includes(nationalCalendar)) {
            const message = t('propError', {
              prop: 'nationalCalendar'
            });
            setError({
              'message': message + ' ' + national_calendars_keys.join(' | ')
            });
            setHasError(true);
          }
          if (diocesanCalendar && !diocesan_calendars_keys.includes(diocesanCalendar)) {
            const message = t('propError', {
              prop: 'diocesanCalendar'
            });
            setError({
              'message': message + ' ' + diocesan_calendars_keys.join(' | ')
            });
            setHasError(true);
          }
        } else if (data.hasOwnProperty("litcal")) {
          setLitCal(data.litcal);
        }
      }, error => {
        setError(error);
        setHasError(true);
      });
    }).catch(error => {
      if (error.message === 'Failed to fetch') {
        setError({
          'message': 'You must first register the domain on which you are using the Liturgy of the Day component. Please contact the owner of the Liturgy of the Day API (priest[at]johnromanodorazio.com).'
        });
      } else {
        setError(error);
      }
      setHasError(true);
    });
  }, [locale, nationalCalendar, diocesanCalendar, year]);
  if (hasError) {
    return /*#__PURE__*/React.createElement("span", null, "Error: ", error.message);
  } else if (loading || litCal === null) {
    return /*#__PURE__*/React.createElement("span", null, "Loading...");
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: joinClassNames('LiturgyOfTheDayOuter', LiturgyOfTheDayOuterClassnames)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      }
    }, allowPrevNext && /*#__PURE__*/React.createElement("button", {
      id: "LitCalPrevBtn",
      className: joinClassNames('LitCalPrevBtn', LiturgyOfTheDayPrevBtnClassnames),
      onClick: handleLitCalBtn
    }, "<<"), /*#__PURE__*/React.createElement("h1", null, t("Liturgy-of-the-Day")), allowPrevNext && /*#__PURE__*/React.createElement("button", {
      id: "LitCalNextBtn",
      className: joinClassNames('LitCalNextBtn', LiturgyOfTheDayNextBtnClassnames),
      onClick: handleLitCalBtn
    }, ">>")), /*#__PURE__*/React.createElement(Festivities, {
      litCalData: litCal,
      dateDiff: addDays,
      liturgyOfTheDayProps: props
    }));
  }
};
var _default = exports.default = LiturgyOfTheDay;