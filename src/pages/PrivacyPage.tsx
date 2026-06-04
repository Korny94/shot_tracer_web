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
  // ];

  const sections = [
    {
      title: "1. Introduction",
      content: (
        <Paragraph>
          This Privacy Policy explains how MaxBogey collects, uses, and protects
          personal data when you use the MaxBogey app. We are committed to
          safeguarding your privacy and processing personal data in accordance
          with the General Data Protection Regulation (GDPR).
        </Paragraph>
      ),
    },
    {
      title: "2. Data Controller and Contact Information",
      content: (
        <Paragraph>
          MaxBogey, <BoldText>Nøkling</BoldText>, is the data controller
          responsible for processing your personal data. If you have any
          questions about this Privacy Policy or how your data is handled, you
          may contact us at{" "}
          <Link style={{ color: "#fe9a00" }} to="/contact">
            contact@maxbogey.com
          </Link>
          .
        </Paragraph>
      ),
    },
    {
      title: "3. Data Collection",
      content: (
        <Paragraph>
          MaxBogey does not require users to create an account to use the app.
          However, if you choose to create an account, we may collect the
          following personal data:
          <ul>
            <li>
              <BoldText>Required Account Data:</BoldText> Username, email
              address, and password (stored in encrypted form and not readable
              by us).
            </li>
            <li>
              <BoldText>Optional Data:</BoldText> Posts, images, shot
              statistics, notes, logs, goals, golf club details, and yardages
              that you voluntarily choose to provide.
            </li>
          </ul>
          Users who do not create an account will not have personal data stored
          by MaxBogey.
        </Paragraph>
      ),
    },
    {
      title: "4. How We Use Your Data",
      content: (
        <Paragraph>
          We use personal data solely for the following purposes:
          <ul>
            <li>To operate, maintain, and improve the MaxBogey app.</li>
            <li>
              To enable optional features such as posting content and tracking
              statistics.
            </li>
            <li>To create and manage user accounts and authentication.</li>
          </ul>
          Optional data is processed only when you actively choose to use the
          related features.
        </Paragraph>
      ),
    },
    {
      title: "5. Legal Basis for Processing",
      content: (
        <Paragraph>
          The legal basis for processing your personal data is your consent
          under Article 6(1)(a) of the GDPR. Consent is given when you create an
          account, submit content, or otherwise voluntarily provide personal
          data. You may withdraw your consent at any time.
        </Paragraph>
      ),
    },
    {
      title: "6. Data Storage and Retention",
      content: (
        <Paragraph>
          We store personal data only for as long as it is necessary to provide
          the MaxBogey app. When you delete your account or request deletion of
          your personal data,{" "}
          <BoldText>
            all personal data is permanently deleted immediately
          </BoldText>
          , unless retention is required by law.
        </Paragraph>
      ),
    },
    {
      title: "7. Data Sharing and Third-Party Services",
      content: (
        <Paragraph>
          MaxBogey does not sell or share your personal data with third parties
          for marketing purposes. The app uses WordPress as a headless content
          management system to store and manage user-generated content and app
          data. Personal data is processed only to the extent necessary to
          operate the service and is not used for unrelated purposes.
        </Paragraph>
      ),
    },
    {
      title: "8. Cookies and Analytics",
      content: (
        <Paragraph>
          Our website uses <BoldText>Google Analytics</BoldText>, a web
          analytics service provided by Google, solely to measure how many
          people visit the site and how it is used so that we can improve it.
          Google Analytics stores a cookie on your device and processes limited
          data such as a randomly generated identifier, the pages you view, your
          approximate location (derived from a shortened, anonymized IP
          address), and your device and browser type.
          <ul>
            <li>
              <BoldText>Consent first:</BoldText> Google Analytics is only
              loaded after you click “Accept” in our cookie banner. If you
              decline, no analytics cookie is set and no analytics data is
              collected.
            </li>
            <li>
              <BoldText>Change your mind anytime:</BoldText> You can withdraw or
              update your choice at any time through the{" "}
              <BoldText>“Cookie Settings”</BoldText> link in the website footer.
            </li>
            <li>
              <BoldText>Legal basis:</BoldText> Your consent under Article
              6(1)(a) of the GDPR, together with applicable ePrivacy (cookie)
              rules.
            </li>
          </ul>
          We have enabled IP anonymization. Google may process this data outside
          the EEA under its own terms and applicable transfer safeguards. We do
          not use analytics data to identify you personally or for advertising.
        </Paragraph>
      ),
    },
    {
      title: "9. Local Storage on Your Device (Shot Tracer Tool)",
      content: (
        <Paragraph>
          The web-based Shot Tracer tool saves your preferences and presets —
          such as tracer color, width and opacity, graphic sizes, hole and
          player details, your saved favorite colors, and your last-used
          settings — in your browser’s <BoldText>local storage</BoldText>.
          <ul>
            <li>
              This information stays <BoldText>on your own device</BoldText>. It
              is used only to remember your settings between visits and is never
              transmitted to us or any third party.
            </li>
            <li>
              It is strictly functional and therefore does not require consent.
            </li>
            <li>
              Any video you load into the Shot Tracer is processed{" "}
              <BoldText>entirely within your browser</BoldText> and is never
              uploaded to our servers.
            </li>
            <li>
              You can remove this data at any time by clearing your browser’s
              site data for this website.
            </li>
          </ul>
        </Paragraph>
      ),
    },
    {
      title: "10. Data Security",
      content: (
        <Paragraph>
          We take appropriate technical and organizational measures to protect
          personal data against unauthorized access, loss, misuse, or
          alteration. This includes secure storage, encryption where
          appropriate, and access controls.
        </Paragraph>
      ),
    },
    {
      title: "11. Children’s Privacy",
      content: (
        <Paragraph>
          MaxBogey is intended for users aged 3 and above. Users who are under
          the legal age of adulthood may only use the app with the consent and
          supervision of a parent or legal guardian. We do not knowingly collect
          personal data from children without parental consent.
        </Paragraph>
      ),
    },
    {
      title: "12. Your Rights Under GDPR",
      content: (
        <Paragraph>
          As a user in the European Economic Area (EEA), you have the following
          rights:
          <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li>
              <BoldText>Right of Access:</BoldText> Request access to your
              personal data.
            </li>
            <li>
              <BoldText>Right to Rectification:</BoldText> Request correction of
              inaccurate data.
            </li>
            <li>
              <BoldText>Right to Erasure:</BoldText> Request immediate deletion
              of your data.
            </li>
            <li>
              <BoldText>Right to Restrict Processing:</BoldText> Request limited
              processing of data.
            </li>
            <li>
              <BoldText>Right to Data Portability:</BoldText> Request your data
              in a portable format.
            </li>
            <li>
              <BoldText>Right to Withdraw Consent:</BoldText> Withdraw consent
              at any time by deleting your account or contacting us at{" "}
              <Link style={{ color: "#fe9a00" }} to="/contact">
                contact@maxbogey.com
              </Link>
              .
            </li>
          </ul>
        </Paragraph>
      ),
    },
    {
      title: "13. Supervisory Authority",
      content: (
        <Paragraph>
          If you believe that your personal data has been processed unlawfully,
          you have the right to lodge a complaint with the Norwegian Data
          Protection Authority (Datatilsynet).
        </Paragraph>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 border-l-4 border-amber-500 pl-6">
          PRIVACY POLICY
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
