import "./styles.css";
import { LiturgyOfTheDay } from "./lib"

export default function App() {
  return (
    <div className="App">
      <LiturgyOfTheDay
        nationalCalendar="USA"
        locale="en"
        LiturgyOfTheDayOuterClassnames="border rounded"
        LiturgicalColorAsBG={false}
        allowPrevNext={true}
        />
      {/**<LiturgyOfTheDay
        diocesanCalendar="DIOCESIDIROMA"
        locale="it"
        LiturgyOfTheDayOuterClassnames="border rounded"
        LiturgicalColorAsBG={true}
        allowPrevNext={true}
      />**/}
    </div>
  );
}
