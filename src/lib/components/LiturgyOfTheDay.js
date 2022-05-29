import { useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import enRes from './locales/en/translation.json'
import itRes from './locales/it/translation.json'
import esRes from './locales/es/translation.json'
import deRes from './locales/de/translation.json'
import frRes from './locales/fr/translation.json'
import ptRes from './locales/pt/translation.json'

const resources = {
  en: { translation: enRes },
  it: { translation: itRes },
  es: { translation: esRes },
  de: { translation: deRes },
  fr: { translation: frRes },
  pt: { translation: ptRes }
}

const endpointVersion = "dev"; //could also be 'dev'...
const MetadataURL = `https://litcal.johnromanodorazio.com/api/${endpointVersion}/LitCalMetadata.php`;
const LitCalAPIURL = `https://litcal.johnromanodorazio.com/api/${endpointVersion}/LitCalEngine.php`;
const highContrast = [ "green", "red", "purple" ];
const joinClassNames = (class1,classes) => [class1, ...(classes.split(' '))].join(' ').trim();

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  react: {
    useSuspense: true,
 },
});

const LiturgyOfTheDay = ({
  locale                                  = '',
  nationalCalendar                        = '',
  diocesanCalendar                        = '',
  year                                    = '',
  LiturgyOfTheDayOuterClassnames          = '',
  allowPrevNext                           = false,
  LiturgyOfTheDayPrevBtnClassnames        = '',
  LiturgyOfTheDayNextBtnClassnames        = '',
...props
}) => {
  const [metadata, setMetadata] = useState(null);
  const [litCal, setLitCal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [dtFormat, setDtFormat] = useState(new Intl.DateTimeFormat('en', { dateStyle: 'full' }));
  const [addDays, setAddDays] = useState(0);
  const { t } = useTranslation();

  const commonsMap = {
    "For-One-Martyr"                          : t( "For-One-Martyr" ),
    "For-Several-Martyrs"                     : t( "For-Several-Martyrs" ),
    "For-Missionary-Martyrs"                  : t( "For-Missionary-Martyrs" ),
    "For-One-Missionary-Martyr"               : t( "For-One-Missionary-Martyr" ),
    "For-Several-Missionary-Martyrs"          : t( "For-Several-Missionary-Martyrs" ),
    "For-a-Virgin-Martyr"                     : t( "For-a-Virgin-Martyr" ),
    "For-a-Holy-Woman-Martyr"                 : t( "For-a-Holy-Woman-Martyr" ),
    "For-a-Pope"                              : t( "For-a-Pope" ),
    "For-a-Bishop"                            : t( "For-a-Bishop" ),
    "For-One-Pastor"                          : t( "For-One-Pastor" ),
    "For-Several-Pastors"                     : t( "For-Several-Pastors" ),
    "For-Founders-of-a-Church"                : t( "For-Founders-of-a-Church" ),
    "For-One-Founder"                         : t( "For-One-Founder" ),
    "For-Several-Founders"                    : t( "For-Several-Founders" ),
    "For-Missionaries"                        : t( "For-Missionaries" ),
    "For-One-Virgin"                          : t( "For-One-Virgin" ),
    "For-Several-Virgins"                     : t( "For-Several-Virgins" ),
    "For-Several-Saints"                      : t( "For-Several-Saints" ),
    "For-One-Saint"                           : t( "For-One-Saint" ),
    "For-an-Abbot"                            : t( "For-an-Abbot" ),
    "For-a-Monk"                              : t( "For-a-Monk" ),
    "For-a-Nun"                               : t( "For-a-Nun" ),
    "For-Religious"                           : t( "For-Religious" ),
    "For-Those-Who-Practiced-Works-of-Mercy"  : t( "For-Those-Who-Practiced-Works-of-Mercy" ),
    "For-Educators"                           : t( "For-Educators" ),
    "For-Holy-Women"                          : t( "For-Holy-Women" )
  }

  const universalCommons = [
    "Blessed Virgin Mary",
    "Virgins",
    "Martyrs",
    "Pastors",
    "Doctors",
    "Holy Men and Women",
    "Dedication of a Church"
  ];

  const translCommon = common => {
    if( common === 'Proper' ) {
        return t('Proper');
    }
    else {
        let commons = common.map(txt => {
            let commonFull = txt.split(":");
            if( universalCommons.includes(commonFull[0]) ) {
              let commonGeneral = t(commonFull[0].replaceAll(' ', '-'));
              let commonSpecific = (typeof commonFull[1] !== 'undefined' && commonFull[1] != "") ? commonsMap[(commonFull[1].replaceAll(' ', '-'))] : "";
              let commonKey = '';
              //txt = str_replace(":", ": ", txt);
              switch (commonGeneral) {
                  case t("Blessed-Virgin-Mary"):
                      commonKey = t("of-the", {context: "(SING_FEMM)"});
                      break;
                  case t("Virgins"):
                      commonKey = t("of", {context: "(PLUR_FEMM)"});
                      break;
                  case t("Martyrs"):
                  case t("Pastors"):
                  case t("Doctors"):
                  case t("Holy-Men-and-Women"):
                      commonKey = t("of", {context: "(PLUR_MASC)"});
                      break;
                  case t("Dedication-of-a-Church"):
                      commonKey = t("of-the", {context: "(SING_FEMM)"});
                  default:
                      commonKey = t("of", {context: "(SING_MASC)"});
              }
              return t("From-the-Common") + " " + commonKey + " " + commonGeneral + (commonSpecific != "" ? ": " + commonSpecific : "");
            }
            else {
              return t("From-the-Common") + " " + t("of") + " " + txt.split(':').join(': ');
            }
        });
        return commons.join("; " + t("or") + " ");
    }
  }

  const EventColors = ({colors}) => {
    return (
      <div>
        <i>{t('liturgical-color')}: </i>
        {colors.map((tColor,i) => {
          if(i === 0){
            return <span key={i}><i style={{display:'inline-block',height:'1em',width:'1em',backgroundColor:tColor,border:'1px solid gray',margin:'0 6px',verticalAlign:'bottom'}}></i>{translColor[tColor]}</span>
          }
          else {
            return <span key={i}> <i>{t('or')}</i> <i style={{display:'inline-block',height:'1em',width:'1em',backgroundColor:tColor,border:'1px solid gray',margin:'0 6px',verticalAlign:'bottom'}}></i>{translColor[tColor]}</span>
          }
        })}
      </div>
    )
  }

  const translColor = {
    "white"   : t("white"),
    "red"     : t("red"),
    "green"   : t("green"),
    "purple"  : t("purple"),
    "pink"    : t("pink")
  }

  const translGrade = [
    t( "weekday" ),
    t( "Commemoration" ),
    t( "Optional-memorial" ),
    t( "Memorial" ),
    t( "FEAST" ),
    t( "FEAST-OF-THE-LORD" ),
    t( "SOLEMNITY" )
  ];

  const GradeWrapper = ({ wrapper, children }) => wrapper(children);

  const filterTagsDisplayGrade = [
    /OrdSunday[0-9]{1,2}(_vigil){0,1}/,
    /Advent[1-4](_vigil){0,1}/,
    /Lent[1-5](_vigil){0,1}/,
    /Easter[1-7](_vigil){0,1}/
  ];

  const handleLitCalBtn = ev => {
    switch(ev.target.id) {
      case 'LitCalPrevBtn':
        setAddDays(prevState => prevState - 1);
        break;
      case 'LitCalNextBtn':
        setAddDays(prevState => prevState + 1);
    }
  }

  const Festivities = ({litCalData,dateDiff,liturgyOfTheDayProps}) => {
    const {
      LiturgyOfTheDayTitleClassnames          = '',
      LiturgyOfTheDayInnerClassnames          = '',
      LiturgyOfTheDayFestivityNameClassnames  = '',
      LiturgyOfTheDayGradeClassnames          = '',
      LiturgyOfTheDayCommonClassnames         = '',
      LiturgyOfTheDayLiturgicalYearClassnames = '',
      LiturgicalColorAsBG                     = true
    } = liturgyOfTheDayProps;
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + dateDiff);
    newDate.setUTCHours(0,0,0,0);
    const timestamp = newDate.getTime() / 1000;
    const { LitCal } = litCalData;
    let children = Object.entries(LitCal).filter(([key, value]) => parseInt(value.date) === timestamp && key === key );
    return (
      <div className="LiturgyOfTheDayFestivitiesCollection">
      <h2 className={joinClassNames('LiturgyOfTheDayTitle',LiturgyOfTheDayTitleClassnames)}>{t('liturgy-of')} {dtFormat.format(newDate)}</h2>
      {children.map(([tag, eventData],i) => {
        const eventDataCommon = eventData.common !== '' ? translCommon(eventData.common) : '';
        const lclzdGrade = eventData.grade < 7 ? translGrade[eventData.grade] : '';
        let isSundayOrdAdvLentEaster = filterTagsDisplayGrade.some(pattern => pattern.test(tag));
        const eventDataGrade  = eventData.displayGrade !== '' ? 
          eventData.displayGrade : (!isSundayOrdAdvLentEaster ?
          <GradeWrapper wrapper={children => {
              switch(eventData.grade){
                case 0:
                case 1:
                  return <i>{children}</i>
                case 5:
                case 6:
                  return <b>{children}</b>
                default:
                  return children
              }
            }
          }>{lclzdGrade}</GradeWrapper> : '');
        const eventDataColor = eventData.color;
        return <div 
          className={joinClassNames('LiturgyOfTheDayInner',LiturgyOfTheDayInnerClassnames)}
          style={LiturgicalColorAsBG ? {
            backgroundColor:eventDataColor[0],
            color:highContrast.includes(eventDataColor[0]) ? "white" : "black"
          } : {}}
          key={i}
        >
          <div className={joinClassNames('LiturgyOfTheDayFestivityName',LiturgyOfTheDayFestivityNameClassnames)}>{eventData.name}</div>
          <div className={joinClassNames('LiturgyOfTheDayGrade',LiturgyOfTheDayGradeClassnames)}>{eventDataGrade}{!LiturgicalColorAsBG && <EventColors colors={eventDataColor} />}</div>
          <div className={joinClassNames('LiturgyOfTheDayCommon',LiturgyOfTheDayCommonClassnames)}>{eventDataCommon}</div>
          {eventData.hasOwnProperty('liturgicalYear') && <div className={joinClassNames('LiturgyOfTheDayLiturgicalYear',LiturgyOfTheDayLiturgicalYearClassnames)}>{eventData.liturgicalYear}</div>}
        </div>
      })}
      </div>
    )
  }

  useEffect(() => {
    setLoading(true);
    if(locale) {
      i18n.changeLanguage(Intl.getCanonicalLocales(locale));
      setDtFormat(new Intl.DateTimeFormat(Intl.getCanonicalLocales(locale), { dateStyle: 'full' }));
    }
    Promise.all([
      fetch(MetadataURL, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json"
        }
      }),
      fetch(LitCalAPIURL, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({locale: locale, nationalCalendar: nationalCalendar, diocesanCalendar: diocesanCalendar, year: year})
      })
    ])
      .then((responses) => {
        return Promise.all(responses.map((response) => { if(response.ok) { return response.json(); } else { throw new Error(); } }));
      })
      .then((dataArray) => {
        setLoading(false);
        dataArray.forEach((data) => {
            if (data.hasOwnProperty("LitCalMetadata")) {
              setMetadata(data);
              const { LitCalMetadata } = data;
              const { NationalCalendars, DiocesanCalendars } = LitCalMetadata;
              if( nationalCalendar && !Object.keys( NationalCalendars ).includes( nationalCalendar ) ) {
                const message = t('propError', {prop:'nationalCalendar'});
                setError({'message': message + ' ' + Object.keys( NationalCalendars ).join(' | ') });
                setHasError(true);
              }
              if( diocesanCalendar && !Object.keys( DiocesanCalendars ).includes( diocesanCalendar ) ) {
                const message = t('propError', {prop:'diocesanCalendar'});
                setError({'message': message + ' ' + Object.keys( DiocesanCalendars ).join(' | ') });
                setHasError(true);
              }
            }
            else if(data.hasOwnProperty("LitCal")) {
              setLitCal(data);
            }
          },
          (error) => {
            setError(error);
            setHasError(true);
          }
        );
      })
      .catch((error) => {
        if(error.message === 'Failed to fetch'){
          setError({'message' : 'You must first register the domain on which you are using the Liturgy of the Day component. Please contact the owner of the Liturgy of the Day API (priest[at]johnromanodorazio.com).'});
        } else {
          setError(error);
        }
        setHasError(true);
      });
  }, [locale,nationalCalendar,diocesanCalendar,year]);

  if (hasError) {
    return <span>Error: {error.message}</span>;
  } else if (loading || litCal === null) {
    return <span>Loading...</span>;
  } else {
    return (
      <div className={joinClassNames('LiturgyOfTheDayOuter',LiturgyOfTheDayOuterClassnames)}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          {allowPrevNext && <button id='LitCalPrevBtn' className={joinClassNames('LitCalPrevBtn',LiturgyOfTheDayPrevBtnClassnames)} onClick={handleLitCalBtn}>{`<<`}</button>}
          <h1>{t( "Liturgy-of-the-Day" )}</h1>
          {allowPrevNext && <button id='LitCalNextBtn' className={joinClassNames('LitCalNextBtn',LiturgyOfTheDayNextBtnClassnames)} onClick={handleLitCalBtn}>{`>>`}</button>}
        </div>
        <Festivities
          litCalData={litCal}
          dateDiff={addDays}
          liturgyOfTheDayProps={props}
          />
      </div>
    )
  }
}

export default LiturgyOfTheDay;
