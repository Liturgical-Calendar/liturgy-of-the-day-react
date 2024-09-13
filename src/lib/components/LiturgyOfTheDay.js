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
const MetadataURL = `https://litcal.johnromanodorazio.com/api/${endpointVersion}/calendars`;
const LitCalAPIURL = `https://litcal.johnromanodorazio.com/api/${endpointVersion}/calendar`;
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
  year                                    = new Date().getUTCFullYear(),
  LiturgyOfTheDayOuterClassnames          = '',
  allowPrevNext                           = false,
  LiturgyOfTheDayPrevBtnClassnames        = '',
  LiturgyOfTheDayNextBtnClassnames        = '',
...props
}) => {
  //const [metadata, setMetadata] = useState(null);
  const [litCal, setLitCal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [dtFormat, setDtFormat] = useState(new Intl.DateTimeFormat('en', { dateStyle: 'full' }));
  const [addDays, setAddDays] = useState(0);
  const { t } = useTranslation();


  const EventColors = ({colors, colorsLcl}) => {
    return (
      <div>
        <i>{t('liturgical-color')}: </i>
        {colors.map((tColor,i) => {
          if(i === 0){
            return <span key={i}><i style={{display:'inline-block',height:'1em',width:'1em',backgroundColor:tColor,border:'1px solid gray',margin:'0 6px',verticalAlign:'bottom'}}></i>{colorsLcl[i]}</span>
          }
          else {
            return <span key={i}> <i>{t('or')}</i> <i style={{display:'inline-block',height:'1em',width:'1em',backgroundColor:tColor,border:'1px solid gray',margin:'0 6px',verticalAlign:'bottom'}}></i>{colorsLcl[i]}</span>
          }
        })}
      </div>
    )
  }


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
    //key === key is superfluous, it just prevents CodeFactor from complaining about the unused key variable
    let children = Object.entries(litCalData).filter(([key, value]) => parseInt(value.date) === timestamp && key === key );
    return (
      <div className="LiturgyOfTheDayFestivitiesCollection">
      <h2 className={joinClassNames('LiturgyOfTheDayTitle',LiturgyOfTheDayTitleClassnames)}>{t('liturgy-of')} {dtFormat.format(newDate)}</h2>
      {children.map(([tag, eventData],i) => {
        const lclzdGrade = eventData.grade < 7 ? eventData.grade_lcl : '';
        let isSundayOrdAdvLentEaster = filterTagsDisplayGrade.some(pattern => pattern.test(tag));
        const eventDataGrade  = eventData.display_grade !== ''
          ? eventData.display_grade
          : (!isSundayOrdAdvLentEaster
            ?
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
              }>{lclzdGrade}</GradeWrapper>
            : '');
        return <div
          className={joinClassNames('LiturgyOfTheDayInner', LiturgyOfTheDayInnerClassnames)}
          style={LiturgicalColorAsBG ? {
            backgroundColor: eventData.color[0],
            color: highContrast.includes(eventData.color[0]) ? "white" : "black"
          } : {}}
          key={i}
        >
          <div className={joinClassNames('LiturgyOfTheDayFestivityName',LiturgyOfTheDayFestivityNameClassnames)}>{eventData.name}</div>
          <div className={joinClassNames('LiturgyOfTheDayGrade',LiturgyOfTheDayGradeClassnames)}>{eventDataGrade}{!LiturgicalColorAsBG && <EventColors colors={eventData.color} colorsLcl={eventData.color_lcl} />}</div>
          <div className={joinClassNames('LiturgyOfTheDayCommon',LiturgyOfTheDayCommonClassnames)}>{eventData.common_lcl}</div>
          {eventData.hasOwnProperty('liturgical_year') && <div className={joinClassNames('LiturgyOfTheDayLiturgicalYear',LiturgyOfTheDayLiturgicalYearClassnames)}>{eventData.liturgical_year}</div>}
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
    let CalendarURL = LitCalAPIURL;
    let CalendarURLHeaders = {};
    if (nationalCalendar !== '') {
      CalendarURL = `${LitCalAPIURL}/nation/${nationalCalendar}/${year}`;
    }
    else if (diocesanCalendar !== '') {
      CalendarURL = `${LitCalAPIURL}/diocese/${diocesanCalendar}/${year}`;
    } else {
      CalendarURLHeaders['Accept-Language'] = locale;
    }
    Promise.all([
      fetch(MetadataURL, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }),
      fetch(CalendarURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...CalendarURLHeaders
        }
      })
    ])
      .then((responses) => {
        return Promise.all(responses.map((response) => { if(response.ok) { return response.json(); } else { throw new Error(); } }));
      })
      .then((dataArray) => {
        setLoading(false);
        dataArray.forEach((data) => {
            if (data.hasOwnProperty("litcal_metadata")) {
              //setMetadata(data.litcal_metadata);
              const { litcal_metadata } = data;
              const { national_calendars_keys, diocesan_calendars_keys } = litcal_metadata;
              if( nationalCalendar && !national_calendars_keys.includes( nationalCalendar ) ) {
                const message = t('propError', {prop:'nationalCalendar'});
                setError({'message': message + ' ' + national_calendars_keys.join(' | ') });
                setHasError(true);
              }
              if( diocesanCalendar && !diocesan_calendars_keys.includes( diocesanCalendar ) ) {
                const message = t('propError', {prop:'diocesanCalendar'});
                setError({'message': message + ' ' + diocesan_calendars_keys.join(' | ') });
                setHasError(true);
              }
            }
            else if(data.hasOwnProperty("litcal")) {
              setLitCal(data.litcal);
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
