import LanguageLearnerView from "./LanguageLearnerView.jsx";
import useLanguageLearner from "./useLanguageLearner.js";
import "./App.css";

export default function App() {
  const viewProps = useLanguageLearner();

  return <LanguageLearnerView {...viewProps} />;
}
