import data from "../public/data.json";
import logo from "../public/logo.svg";
import githubLogo from "./assets/github-mark.svg";
import QrcodeDialog from './components/qrcode.jsx';

import SecurityDate from "./components/security-date.jsx";
import SubmitVisaType from "./components/submit-visa-type.jsx";
import VisaType from "./components/visa-type.jsx";
import VisaTypeOpr from "./components/visa-type-opr.jsx";
import InjunctionDaysOpr from "./components/injunction-days-opr.jsx";
import InjunctionOpr from "./components/injunction-opr.jsx";
import InjunctionDate from "./components/injunction-date.jsx";
import SecurityWaitInjunction from "./components/security-wait-injunction.jsx";

function App() {
  return (
    <main>
      <header className="flex justify-between items-center h-16 px-4 shadow fixed bg-white w-full">
        <div className="flex items-center">
          <img width="48" src={logo} alt="logo" />
          <h1 className="text-2xl font-bold ml-4">安调统计</h1>
        </div>

        <div className="flex items-center gap-4">
          <QrcodeDialog />
          <a href="https://github.com/honkinglin/security-stats" target="_blank">
            <img width={32} src={githubLogo} alt="github" />
          </a>
        </div>
      </header>
      <div className="container mx-auto pt-24 pb-8">
        <SecurityDate data={data} />
        <SubmitVisaType data={data} />
        <VisaType data={data} />
        <VisaTypeOpr data={data} />
        <InjunctionDaysOpr data={data} />
        <InjunctionDate data={data} />
        <SecurityWaitInjunction data={data} />
        <InjunctionOpr data={data} />
      </div>
    </main>
  );
}

export default App;
