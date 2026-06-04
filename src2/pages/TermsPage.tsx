import styled from "styled-components";
import { Link } from "react-router-dom";

const Paragraph = styled.div`
  line-height: 1.6;
  padding: 0.2rem 0;
  margin: 0;
  text-shadow: 0px 0.75px 1px rgba(0, 0, 0, 0.1);
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const TermsPage = () => {
  // const sections = [
  //   {
  //     title: "1. Introduction",
  //     content: (
  //       <Paragraph>
  //         Welcome to MaxBogey. By using the MaxBogey app, you agree to these
  //         Terms of Service and the Privacy Policy. These Terms cover your
  //         rights, our responsibilities, and legal protections for both parties,
  //         ensuring that MaxBogey remains GDPR compliant.
  //       </Paragraph>
  //     ),
  //   },
  //   {
  //     title: "2. Data Controller and Contact Information",
  //     content: (
  //       <Paragraph>
  //         MaxBogey, <BoldText>Nøkling</BoldText>, is the data controller
  //         responsible for processing your personal data. For any questions
  //         regarding your data, please contact us at{" "}
  //         <Link style={{ color: "#fe9a00" }} to="/contact">
  //           contact@maxbogey.com
  //         </Link>
  //         .
  //       </Paragraph>
  //     ),
  //   },
  //   {
  //     title: "3. Data Collection",
  //     content: (
  //       <Paragraph>
  //         MaxBogey does not require users to create an account to use the app.
  //         However, if you choose to create an account, we may collect the
  //         following personal information:
  //         <ul>
  //           <li>
  //             Required Account Data: Username, email address, and password
  //             (encrypted and unreadable for anyone).
  //           </li>
  //           <li>
  //             Optional Data: Posts, images, shot statistics, notes, logs, goals,
  //             golf club details, and yardages.
  //           </li>
  //         </ul>
  //         Users who do not create an account will not have any personal data
  //         collected or stored.
  //       </Paragraph>
  //     ),
  //   },
  //   {
  //     title: "4. Data Usage",
  //     content: (
  //       <Paragraph>
  //         We only use your data for the following purposes:
  //         <ul>
  //           <li>To operate the MaxBogey app.</li>
  //           <li>To allow you to post content, messages, and statistics.</li>
  //           <li>To facilitate account creation and login.</li>
  //         </ul>
  //         Data you choose to share, such as posts, images, and private messages,
  //         will be securely stored. Shot statistics, logs, notes, and club data
  //         will be stored only if you opt to use those features.
  //       </Paragraph>
  //     ),
  //   },
  //   {
  //     title: "5. Legal Basis for Data Processing",
  //     content: (
  //       <Paragraph>
  //         The legal basis for collecting and processing your personal data is
  //         your explicit consent, which is given when you create an account, post
  //         content, or provide additional data. Users who choose not to create an
  //         account will not have any personal data processed.
  //       </Paragraph>
  //     ),
  //   },
  //   {
  //     title: "6. User Rights",
  //     content: (
  //       <Paragraph>
  //         As a user, you have the following rights under GDPR:
  //         <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
  //           <li>
  //             <BoldText>Right of Access:</BoldText> You can request access to
  //             any data we store about you.
  //           </li>
  //           <li>
  //             <BoldText>Right to Rectification:</BoldText> You can request
  //             corrections to inaccurate data.
  //           </li>
  //           <li>
  //             <BoldText>Right to Erasure ("Right to be Forgotten"):</BoldText>{" "}
  //             You can request the deletion of your personal data at any time.
  //           </li>
  //           <li>
  //             <BoldText>Right to Restrict Processing:</BoldText> You can request
  //             that we restrict the processing of your data.
  //           </li>
  //           <li>
  //             <BoldText>Right to Data Portability:</BoldText> You can request
  //             your data in a structured, commonly used format.
  //           </li>
  //           <li>
  //             <BoldText>Right to Withdraw Consent:</BoldText> You can withdraw
  //             your consent for data processing at any time by deleting your
  //             account or contacting us at{" "}
  //             <Link style={{ color: "#fe9a00" }} to="/contact">
  //               contact@maxbogey.com
  //             </Link>
  //             .
  //           </li>
  //         </ul>
  //       </Paragraph>
  //     ),
  //   },
  //   // Additional sections follow the same pattern
  // ];

  const sections = [
    {
      title: "1. Introduction",
      content: (
        <Paragraph>
          Welcome to MaxBogey! By using the MaxBogey app or website, you agree
          to these Terms of Service (“Terms”). These Terms govern your access to
          and use of MaxBogey, including all content, features, and services. If
          you do not agree to these Terms, do not use the app or website.
        </Paragraph>
      ),
    },
    {
      title: "2. Eligibility",
      content: (
        <Paragraph>
          You must be at least the legal age of majority in your country, or if
          under that age, you may only use MaxBogey with the consent of a parent
          or legal guardian. By using the app, you represent and warrant that
          you meet these eligibility requirements.
        </Paragraph>
      ),
    },
    {
      title: "3. Account Registration",
      content: (
        <Paragraph>
          To access certain features, you may need to create an account. You
          agree to provide accurate, complete, and up-to-date information. You
          are responsible for keeping your password secure and for all activity
          under your account. Notify us immediately of any unauthorized use.
        </Paragraph>
      ),
    },
    {
      title: "4. User Conduct",
      content: (
        <Paragraph>
          You agree not to:
          <ul>
            <li>Violate any laws or regulations while using MaxBogey.</li>
            <li>Harass, abuse, or harm other users.</li>
            <li>Post or share illegal, offensive, or inappropriate content.</li>
            <li>Attempt to interfere with or disrupt the app or website.</li>
            <li>Access other users’ accounts without permission.</li>
          </ul>
          MaxBogey reserves the right to remove content or suspend accounts
          violating these rules.
        </Paragraph>
      ),
    },
    {
      title: "5. User Content",
      content: (
        <Paragraph>
          By posting content (e.g., images, posts, statistics) you grant
          MaxBogey a non-exclusive, worldwide, royalty-free license to use,
          display, and distribute your content in connection with the app. You
          retain ownership of your content. You are solely responsible for the
          content you post.
        </Paragraph>
      ),
    },
    {
      title: "6. Intellectual Property",
      content: (
        <Paragraph>
          All MaxBogey content, branding, software, and designs are the property
          of MaxBogey or its licensors and are protected by copyright,
          trademark, and other intellectual property laws. You may not copy,
          modify, or distribute our content or features without permission.
        </Paragraph>
      ),
    },
    {
      title: "7. Third-Party Services",
      content: (
        <Paragraph>
          The app may use third-party services, including WordPress for content
          management. MaxBogey is not responsible for the policies or actions of
          third-party services. Using those services may be subject to
          additional terms.
        </Paragraph>
      ),
    },
    {
      title: "8. Privacy",
      content: (
        <Paragraph>
          Your use of MaxBogey is also governed by our Privacy Policy, which
          explains how we collect, use, and protect your personal data.
        </Paragraph>
      ),
    },
    {
      title: "9. Limitation of Liability",
      content: (
        <Paragraph>
          MaxBogey and its owners are not liable for any direct, indirect,
          incidental, or consequential damages arising from your use of the app
          or website, including data loss, downtime, or errors. Use the app at
          your own risk.
        </Paragraph>
      ),
    },
    {
      title: "10. Disclaimer of Warranties",
      content: (
        <Paragraph>
          The app and website are provided “as is” and “as available,” without
          warranties of any kind, express or implied. We do not guarantee
          uninterrupted service, accuracy of content, or compatibility with your
          device.
        </Paragraph>
      ),
    },
    {
      title: "11. Account Termination",
      content: (
        <Paragraph>
          We may suspend or terminate accounts at our discretion for violations
          of these Terms, illegal activity, or harmful behavior. Users may also
          delete their accounts at any time, which will remove personal data
          according to our Privacy Policy.
        </Paragraph>
      ),
    },
    {
      title: "12. Governing Law",
      content: (
        <Paragraph>
          These Terms are governed by the laws of Norway. Any disputes must be
          resolved in the Norwegian courts unless otherwise required by law.
        </Paragraph>
      ),
    },
    {
      title: "13. Changes to Terms",
      content: (
        <Paragraph>
          MaxBogey may update these Terms at any time. Continued use after
          updates means you accept the new Terms.
        </Paragraph>
      ),
    },
    {
      title: "14. Contact",
      content: (
        <Paragraph>
          For questions about these Terms, please contact us at{" "}
          <Link style={{ color: "#fe9a00" }} to="/contact">
            contact@maxbogey.com
          </Link>
          .
        </Paragraph>
      ),
    },
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
