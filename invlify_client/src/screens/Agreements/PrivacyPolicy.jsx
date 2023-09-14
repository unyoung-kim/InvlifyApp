/* eslint-disable no-restricted-globals */

import React from 'react';

const POLICY_TEXT = `This Privacy Policy (the "Policy") is effective as of August 3 2023, and is provided by Invlify Inc. ("Company," "we," "us," or "our"). It applies to the software application Invlify (the "Software") which integrates Quickbooks' accounting features to help users create invoices. This Policy explains how information about you is collected, used, and disclosed by the Company when you use our Software.

INFORMATION WE COLLECT: We may collect personal information that you provide to us, such as your name, email address, and other contact information. We also collect technical data, such as your IP address, device type, operating system, and usage information about how you interact with our Software.

USE OF INFORMATION: We use the information we collect to provide, maintain, and improve our Software, to respond to comments and questions, and to provide customer support. We may also use the information to communicate with you about products, services, offers, promotions, and events, and provide other news or information about us and our partners.

SHARING OF INFORMATION: We do not share your personal information with third parties without your consent, except in the following circumstances or as described in this Policy:
- Service Providers: We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.
- Compliance with Laws: We may disclose your information to a third party if we believe that disclosure is reasonably necessary to comply with any applicable law, regulation, legal process, or governmental request.

SECURITY: We take reasonable measures, including administrative, technical, and physical safeguards, to protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.

CHANGES TO THIS POLICY: We may change this Policy from time to time. If we make changes, we will notify you by revising the date at the top of the Policy and, in some cases, we may provide you with additional notice.

CONTACT US: If you have any questions about this Policy, please contact us at support@lcavr.com.

BY USING THE SOFTWARE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THE TERMS AND CONDITIONS OF THIS POLICY AND THAT YOU AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.`;

const PrivacyPolicy = () => {
  return (
    <div style={{ marginLeft: 12, marginRight: 12 }}>
      <h1>PRIVACY POLICY</h1>
      <p style={{ whiteSpace: 'break-spaces' }}>{POLICY_TEXT}</p>
    </div>
  );
};

export default PrivacyPolicy;
