import { useEffect } from "react";

export default function NavigationSteps({ steps, currentStepIndex = 0 }) {
  useEffect(() => {
    if (!steps || !steps[currentStepIndex] || !window.speechSynthesis) return;

    const text = steps[currentStepIndex].text;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }, [currentStepIndex, steps]);

  if (!steps?.length) return null;

  const icons = {
    left: "Left",
    right: "Right",
    straight: "Ahead",
    arrive: "Arrive",
  };

  return (
    <div className="nav-steps">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`nav-step ${step.type} ${i === currentStepIndex ? "active" : ""}`}
        >
          <span className="icon">{icons[step.type]}</span>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
}
