const TermsPage = () => {
  // Using the provided sections array
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to MaxBogey. By using the MaxBogey app, you agree to these Terms of Service...",
    },
    {
      title: "2. Data Controller",
      content:
        "MaxBogey, Korny Applications, is the data controller responsible for processing your personal data...",
    },
    {
      title: "3. Data Collection",
      content:
        "MaxBogey does not require users to create an account to use the app...",
    },
    // ... add full content here
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 border-l-4 border-amber-500 pl-6">
          TERMS OF SERVICE
        </h1>
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-bold text-white mb-4">
                {section.title}
              </h2>
              <p className="leading-relaxed text-gray-400">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
