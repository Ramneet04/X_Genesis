// import { Card, CardContent } from "@/components/ui/card";
const missionSteps = [
  {
    title: "Empowering Students",
    description:
      "We aim to give students a tamper-proof identity for their achievements through soulbound NFTs linked to their wallet.",
  },
  {
    title: "AI-Driven Authenticity",
    description:
      "Our AI layer ensures every document is contextually and structurally verified before human approval.",
  },
  {
    title: "Verified by Institutions",
    description:
      "Institutes manually verify after AI passes the credentials — ensuring trust from source to chain.",
  },
  {
    title: "Tamper-Proof NFTs",
    description:
      "Once verified, a soulbound NFT is minted and stored on-chain, accessible forever without fakes.",
  },
  {
    title: "Open to Recruiters",
    description:
      "Recruiters can discover real talent through verified credentials, projects, and tags — transparently and globally.",
  },
];
const learningGrid = [
  {
    order: -1,
    heading: "Decentralized Verification for",
    HighLightedText: "Every Learner",
    description:
      "X_Genesis enables students to showcase authentic, verified credentials using blockchain-powered NFTs — eliminating fraud and manual verifications globally.",
    BtnText: "Explore Platform",
    BtnLink: "/explore",
  },
  {
    order: 1,
    heading: "AI-Powered Document Screening",
    description:
      "Our built-in AI engine analyzes certificates and project documents for plagiarism, formatting, and context — before human validation.",
  },
  {
    order: 2,
    heading: "Trusted Institute Validation",
    description:
      "Institutions validate credentials after AI pre-verification, ensuring every NFT minted is backed by a recognized authority.",
  },
  {
    order: 3,
    heading: "Soulbound Credential NFTs",
    description:
      "Verified documents are minted as Soulbound NFTs — non-transferable, tamper-proof, and publicly verifiable on-chain.",
  },
  {
    order: 4,
    heading: "Smart Recruiter Matching",
    description:
      "Recruiters can search and filter profiles based on verified credentials, skills, and tags — no fake resumes, just real talent.",
  },
  {
    order: 5,
    heading: "One Identity, Multiple Proofs",
    description:
      "Each student wallet holds multiple NFTs tied to their academic journey — projects, certificates, awards — all in one place.",
  },
];

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-teal-400">
          🧬 About X_Genesis
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
          X_Genesis is a decentralized credential verification platform powered
          by <span className="text-teal-300 font-medium">NFTs</span> and{" "}
          <span className="text-purple-300 font-medium">AI</span>. We help
          students showcase verified achievements, enable institutions to
          authenticate credentials, and empower recruiters to discover top
          talent — all on-chain.
        </p>

        {/* Feature Cards */}
        <section className="bg-gray-950 text-white px-6 pt-20 pb-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-teal-400 mb-12">
          🎯 Our Mission
        </h2>

        <div className="relative border-l-2 border-purple-700 ml-4">
          {missionSteps.map((step, index) => (
            <div key={index} className="mb-10 ml-6 relative">
              <div className="absolute -left-4 top-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white" />
              <h3 className="text-xl font-semibold text-purple-300">
                {step.title}
              </h3>
              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
        {/* Collage */}
{/* Learning Grid (Enhanced) */}
<div className="w-11/12 mt-20 grid mx-auto grid-cols-1 lg:grid-cols-4 mb-10 items-stretch gap-6">
  {learningGrid.map((card, index) => {
    // Define heading color for each card
    const headingColors = [
      "text-teal-300",
      "text-purple-300",
      "text-yellow-300",
      "text-pink-300",
      "text-indigo-300",
      "text-green-300",
    ];
    const headingColor = headingColors[index % headingColors.length];

    return (
      <div
        key={index}
        className={`
          ${index === 0 ? "lg:col-span-2" : ""}
          ${card.order % 2 === 1 ? "bg-slate-800" : "bg-slate-900"}
          ${card.order === 3 ? "lg:col-start-2" : ""}
          ${card.order === -1 ? "bg-slate-950" : ""}
          lg:h-[300px] h-auto text-white p-6 rounded-md flex
        `}
      >
        <div className="flex flex-col gap-4">
          <h2 className={`text-2xl font-semibold ${headingColor}`}>
            {card.heading}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>
    );
  })}
</div>



      </div>
    </section>
  );
};

export default AboutUs;
