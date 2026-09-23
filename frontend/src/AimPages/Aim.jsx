import "./Aim.css";
const aims = {
  ultimate: [
    "Become an AI Systems / Infrastructure Engineer",
    "Build strong C/C++ and CUDA fundamentals",
    "Build my own LLM inference engine",
    "Understand transformers from first principles",
    "Understand the full AI → hardware → OS → networking stack",
  ],
  monthly: [
    "Continue building PersonalApp",
    "Deepen Go backend development",
    "Continue C++ inference-engine development",
    "Improve Linux and systems administration skills",
    "Build one substantial systems project",
  ],
  weekly: [
    "Finish the Aim component",
    "Finish the TODO component",
    "Finish the Workout component",
    "Study Go interfaces and concurrency",
    "Build one small C++ systems experiment",
  ],
};
function AimRow({ title, items }) {
  return (
    <div className="aim-row">
      {" "}
      <h3>{title}</h3>{" "}
      <div className="aim-cards">
        {" "}
        {items.map((item, index) => (
          <div className="aim-card" key={index}>
            {" "}
            <p>{item}</p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}
export function Aim() {
  return (
    <section className="aim">
      {" "}
      <div className="aim-header">
        {" "}
        <h2>Aim</h2>{" "}
      </div>{" "}
      <AimRow title="Ultimate Aim" items={aims.ultimate} />{" "}
      <AimRow title="Monthly Aim" items={aims.monthly} />{" "}
      <AimRow title="Weekly Aim" items={aims.weekly} />{" "}
    </section>
  );
}
