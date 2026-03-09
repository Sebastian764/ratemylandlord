import React from 'react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Terms &amp; Conditions</h1>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">1. Introduction &amp; Acceptance</h2>
        <p><strong>1.1 Scope.</strong> These Terms govern your access to and use of the RateYinzLandlord website and services (the "Platform"). By accessing or using this platform, you agree to be bound by these Terms, the Content Guidelines, Dispute Policy, and Privacy Policy.</p>
        <p><strong>1.2 Eligibility.</strong> You must be at least 18 years old to use RateYinzLandlord. Your use constitutes acceptance of these Terms and of any updates.</p>
        <p><strong>1.3 Modifications.</strong> RateYinzLandlord may modify these Terms at any time. Continued use after changes means you accept the updated Terms.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">2. User Accounts &amp; Content</h2>
        <p><strong>2.1 Accounts.</strong> You may need to register an account to post reviews, file disputes, or use certain features. You are responsible for keeping your login credentials secure and for all activities under your account.</p>
        <p><strong>2.2 Content Ownership &amp; License.</strong> All content posted to RateYinzLandlord remains your property, but by submitting it you grant RateYinzLandlord a worldwide, royalty-free license to use, share, display, and distribute it. Content must comply with the Content Guidelines below.</p>
        <p><strong>2.3 Responsibility.</strong> You alone are responsible for anything you post. RateYinzLandlord only verifies proof of student status or legal residence and is not liable for user-generated content.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">3. Content Guidelines</h2>
        <p><strong>3.1 Purpose.</strong> These rules keep RateYinzLandlord useful, fair, and safe. By using the site, RateYinzLandlord.com, you agree to follow them. Opinions remain posted, while content that breaks our policies is removed; moderation focuses on guideline compliance rather than determining factual truth.</p>
        <p><strong>3.2 Allowable Content.</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Opinions: your personal experience.</li>
          <li>Landlords may be identified only by the name on your lease (write in the LLC name if applicable) or the official ownership name in county property records. Do not use nicknames, partial identifiers, or unrelated personal details.</li>
        </ul>
        <p><strong>3.3 Prohibited Content.</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No hate speech, threats, harassment, discrimination, sexually explicit material, or illegal content.</li>
          <li>No spam, solicitations, or irrelevant/off-topic posts.</li>
          <li>No demonstrably false statements.</li>
          <li>No private or sensitive information about non-public individuals (e.g., names of tenants/roommates, personal contact details, access codes, financial/medical records, IDs) or attempts to identify anonymous reviewers.</li>
        </ul>
        <p><strong>3.4 Moderation.</strong> RateYinzLandlord may remove, edit, or refuse content that violates the guidelines or these Terms.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">4. Privacy &amp; Data Use</h2>
        <p><strong>4.1 Collection.</strong> RateYinzLandlord collects personal and usage information as described in the Privacy Policy, including any data needed to operate, secure, and improve services.</p>
        <p><strong>4.2 Use.</strong> Data may be used for service delivery, analytics, improving RateYinzLandlord, sending communications, and legal compliance.</p>
        <p><strong>4.3 Sharing.</strong> We retain internal identifiers (such as account email and IP logs) for security, abuse prevention, and legal compliance, but we do not display them publicly. Personal information may be shared with service providers or as required by law.</p>
        <p><strong>4.4 Cookies &amp; Tracking.</strong> RateYinzLandlord may use cookies or tracking technologies for performance, analytics, and security.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">5. Disclaimer &amp; Liability Limits</h2>
        <p><strong>5.1 No Warranty.</strong> RateYinzLandlord and all content are provided "as is," without warranties of any kind.</p>
        <p><strong>5.2 No Endorsement.</strong> Reviews are opinions of individual users and do not represent RateYinzLandlord's endorsement.</p>
        <p><strong>5.3 Limitation of Liability.</strong> RateYinzLandlord is not liable for damages arising from your use or inability to use the service.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">6. Dispute Resolution Policy</h2>
        <p><strong>6.1 Purpose.</strong> The Dispute Policy governs how users may challenge reviews they believe violate guidelines or contain inaccuracies.</p>
        <p><strong>6.2 Filing a Dispute.</strong> If you believe a review violates the above listed Guidelines, you may dispute it by emailing us at <a href="mailto:pittratemylandlord@gmail.com" className="text-blue-600 hover:underline">pittratemylandlord@gmail.com</a> with specific details and any relevant context.</p>
        <p><strong>6.3 What Cannot be Disputed.</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Statements sharing personal opinions or firsthand experiences from the reviewer's point of view, even when critical.</li>
          <li>Star ratings or category-based scores based on the reviewer's own experience.</li>
          <li>Allegations that cannot be objectively proven true or false (e.g., "poor communication").</li>
          <li>Lease, security deposit, or contractual disputes that are more appropriately resolved privately or through legal channels.</li>
          <li>RateYinzLandlord is a community review platform and not a court. We review for policy compliance, not truth.</li>
        </ul>
        <p><strong>6.4 Process.</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Disputes are reviewed by administrators.</li>
          <li>The flagged text is compared to our Content Guidelines (harassment/hate, discrimination, irrelevance/off-topic, demonstrably false factual allegations, etc.) to determine if they were violated.</li>
          <li>RateYinzLandlord will contact affected parties with a resolution in a timely manner.</li>
          <li>Promotional content, advertising, or solicitations are not permitted in disputes or related comments.</li>
        </ul>
        <p><strong>6.5 Outcomes.</strong> Decisions are final for that dispute, though exceptional appeals may be permitted. Parties may still pursue legal action independent of RateYinzLandlord resolution.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">7. Termination &amp; Suspension</h2>
        <p><strong>7.1 Platform Rights.</strong> RateYinzLandlord may suspend or terminate your access for violations of Terms or misuse of the service.</p>
        <p><strong>7.2 Effects.</strong> Termination does not affect rights accrued prior to termination.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">8. Governing Law &amp; Legal</h2>
        <p><strong>8.1 Governing Law.</strong> These Terms are governed by applicable laws of the jurisdiction where RateYinzLandlord operates.</p>
        <p><strong>8.2 Legal Compliance.</strong> You agree to comply with all applicable laws when using RateYinzLandlord, including those governing defamation and data privacy.</p>
      </section>

      <section className="mb-8 text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">9. Verification Process</h2>
        <p><strong>9.1 Collection.</strong> Any user using a pitt.edu email will automatically be verified as a student. Those utilizing the "lease verification" feature will have their lease reviewed to verify their legal residence and then deleted for sake of anonymity.</p>
      </section>

      <section className="text-gray-700 space-y-3">
        <h2 className="text-2xl font-semibold text-blue-600">10. Contact &amp; Updates</h2>
        <p><strong>10.1 Contact.</strong> Questions about these Terms should be directed to <a href="mailto:pittratemylandlord@gmail.com" className="text-blue-600 hover:underline">pittratemylandlord@gmail.com</a>.</p>
        <p><strong>10.2 Updates.</strong> The most current version of these Terms, Guidelines, Privacy Policy, and Dispute Policy will be available on RateYinzLandlord. Continued use means acceptance of any updates.</p>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;