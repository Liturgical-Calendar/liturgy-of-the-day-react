"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.string.trim.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/esnext.string.replace-all.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.regexp.test.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.string.includes.js");

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

const MetadataURL = "https://litcal.johnromanodorazio.com/api/".concat(endpointVersion, "/LitCalMetadata.php");
const LitCalAPIURL = "https://litcal.johnromanodorazio.com/api/".concat(endpointVersion, "/LitCalEngine.php");
const highContrast = ["green", "red", "purple"];

const joinClassNames = (class1, classes) => [class1, ...classes.split(' ')].join(' ').trim();

_i18next.default.use(_reactI18next.initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  react: {
    wait: true,
    useSuspense: false
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

  const [metadata, setMetadata] = (0, _react.useState)(null);
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
  const commonsMap = {
    "For-One-Martyr": t("For-One-Martyr"),
    "For-Several-Martyrs": t("For-Several-Martyrs"),
    "For-Missionary-Martyrs": t("For-Missionary-Martyrs"),
    "For-One-Missionary-Martyr": t("For-One-Missionary-Martyr"),
    "For-Several-Missionary-Martyrs": t("For-Several-Missionary-Martyrs"),
    "For-a-Virgin-Martyr": t("For-a-Virgin-Martyr"),
    "For-a-Holy-Woman-Martyr": t("For-a-Holy-Woman-Martyr"),
    "For-a-Pope": t("For-a-Pope"),
    "For-a-Bishop": t("For-a-Bishop"),
    "For-One-Pastor": t("For-One-Pastor"),
    "For-Several-Pastors": t("For-Several-Pastors"),
    "For-Founders-of-a-Church": t("For-Founders-of-a-Church"),
    "For-One-Founder": t("For-One-Founder"),
    "For-Several-Founders": t("For-Several-Founders"),
    "For-Missionaries": t("For-Missionaries"),
    "For-One-Virgin": t("For-One-Virgin"),
    "For-Several-Virgins": t("For-Several-Virgins"),
    "For-Several-Saints": t("For-Several-Saints"),
    "For-One-Saint": t("For-One-Saint"),
    "For-an-Abbot": t("For-an-Abbot"),
    "For-a-Monk": t("For-a-Monk"),
    "For-a-Nun": t("For-a-Nun"),
    "For-Religious": t("For-Religious"),
    "For-Those-Who-Practiced-Works-of-Mercy": t("For-Those-Who-Practiced-Works-of-Mercy"),
    "For-Educators": t("For-Educators"),
    "For-Holy-Women": t("For-Holy-Women")
  };
  const universalCommons = ["Blessed Virgin Mary", "Virgins", "Martyrs", "Pastors", "Doctors", "Holy Men and Women", "Dedication of a Church"];

  const translCommon = common => {
    if (common === 'Proper') {
      return t('Proper');
    } else {
      let commons = common.split(",");
      commons = commons.map(txt => {
        let common = txt.split(":");

        if (universalCommons.includes(common[0])) {
          let commonGeneral = t(common[0].replaceAll(' ', '-'));
          let commonSpecific = typeof common[1] !== 'undefined' && common[1] != "" ? commonsMap[common[1].replaceAll(' ', '-')] : "";
          let commonKey = ''; //txt = str_replace(":", ": ", txt);

          switch (commonGeneral) {
            case t("Blessed-Virgin-Mary"):
              commonKey = t("of-the", {
                context: "(SING_FEMM)"
              });
              break;

            case t("Virgins"):
              commonKey = t("of", {
                context: "(PLUR_FEMM)"
              });
              break;

            case t("Martyrs"):
            case t("Pastors"):
            case t("Doctors"):
            case t("Holy-Men-and-Women"):
              commonKey = t("of", {
                context: "(PLUR_MASC)"
              });
              break;

            case t("Dedication-of-a-Church"):
              commonKey = t("of-the", {
                context: "(SING_FEMM)"
              });

            default:
              commonKey = t("of", {
                context: "(SING_MASC)"
              });
          }

          return t("From-the-Common") + " " + commonKey + " " + commonGeneral + (commonSpecific != "" ? ": " + commonSpecific : "");
        } else {
          return t("From-the-Common") + " " + t("of") + " " + txt.split(':').join(': ');
        }
      });
      return commons.join("; " + t("or") + " ");
    }
  };

  const EventColors = _ref2 => {
    let {
      colors
    } = _ref2;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null, t('liturgical color:'), " "), colors.map((tColor, i) => {
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
        }), translColor[tColor]);
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
        }), translColor[tColor]);
      }
    }));
  };

  const translColor = {
    "white": t("white"),
    "red": t("red"),
    "green": t("green"),
    "purple": t("purple"),
    "pink": t("pink")
  };
  const translGrade = [t("weekday"), t("Commemoration"), t("Optional-memorial"), t("Memorial"), t("FEAST"), t("FEAST-OF-THE-LORD"), t("SOLEMNITY")];

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
    const {
      LitCal
    } = litCalData;
    let children = Object.entries(LitCal).filter(_ref5 => {
      let [key, value] = _ref5;
      return parseInt(value.date) === timestamp && key === key;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "LiturgyOfTheDayFestivitiesCollection"
    }, /*#__PURE__*/React.createElement("h2", {
      className: joinClassNames('LiturgyOfTheDayTitle', LiturgyOfTheDayTitleClassnames)
    }, t('liturgy-of'), " ", dtFormat.format(newDate)), children.map((_ref6, i) => {
      let [tag, eventData] = _ref6;
      const eventDataCommon = eventData.common !== '' ? translCommon(eventData.common) : '';
      const lclzdGrade = eventData.grade < 7 ? translGrade[eventData.grade] : '';
      let isSundayOrdAdvLentEaster = filterTagsDisplayGrade.some(pattern => pattern.test(tag));
      const eventDataGrade = eventData.displayGrade !== '' ? eventData.displayGrade : !isSundayOrdAdvLentEaster ? /*#__PURE__*/React.createElement(GradeWrapper, {
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
      const eventDataColor = eventData.color.split(',');
      return /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayInner', LiturgyOfTheDayInnerClassnames),
        style: LiturgicalColorAsBG ? {
          backgroundColor: eventDataColor[0],
          color: highContrast.includes(eventDataColor[0]) ? "white" : "black"
        } : {},
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayFestivityName', LiturgyOfTheDayFestivityNameClassnames)
      }, eventData.name), /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayGrade', LiturgyOfTheDayGradeClassnames)
      }, eventDataGrade, !LiturgicalColorAsBG && /*#__PURE__*/React.createElement(EventColors, {
        colors: eventDataColor
      })), /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayCommon', LiturgyOfTheDayCommonClassnames)
      }, eventDataCommon), eventData.hasOwnProperty('liturgicalYear') && /*#__PURE__*/React.createElement("div", {
        className: joinClassNames('LiturgyOfTheDayLiturgicalYear', LiturgyOfTheDayLiturgicalYearClassnames)
      }, eventData.liturgicalYear));
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

    Promise.all([fetch(MetadataURL, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json"
      }
    }), fetch(LitCalAPIURL, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        locale: locale,
        nationalCalendar: nationalCalendar,
        diocesanCalendar: diocesanCalendar,
        year: year
      })
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
        if (data.hasOwnProperty("LitCalMetadata")) {
          setMetadata(data);
          const {
            LitCalMetadata
          } = data;
          const {
            NationalCalendars,
            DiocesanCalendars
          } = LitCalMetadata;

          if (nationalCalendar && !Object.keys(NationalCalendars).includes(nationalCalendar)) {
            const message = t('propError', {
              prop: 'nationalCalendar'
            });
            setError({
              'message': message + ' ' + Object.keys(NationalCalendars).join(' | ')
            });
            setHasError(true);
          }

          if (diocesanCalendar && !Object.keys(DiocesanCalendars).includes(diocesanCalendar)) {
            const message = t('propError', {
              prop: 'diocesanCalendar'
            });
            setError({
              'message': message + ' ' + Object.keys(DiocesanCalendars).join(' | ')
            });
            setHasError(true);
          }
        } else if (data.hasOwnProperty("LitCal")) {
          setLitCal(data);
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

var _default = LiturgyOfTheDay;
exports.default = _default;