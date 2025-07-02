import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="terms-and-conditions prose max-w-none">
        <h1>Terms & Conditions</h1>

        <div className="mb-8">
          <p>
            This Site/Application/Services is operated by Bluejersey18
            Technologies Private Limited ("Bluejersey18") operating under the
            brand name Sportomic ("Us" or "Our" or "We" or "Sportomic").
          </p>
        </div>

        <div className="mb-8">
          <h2>DEFINITIONS</h2>
          <ul>
            <li>
              <strong>Account</strong>: The account created by you for availing
              Services
            </li>
            <li>
              <strong>Application</strong>: The mobile application Sportomic
            </li>
            <li>
              <strong>Additional Fee</strong>: Toll duty, inter-state taxes,
              etc.
            </li>
            <li>
              <strong>Order Value</strong>: Amount payable for a specific Order
            </li>
            <li>
              <strong>Registration Data</strong>: Information required for
              account creation
            </li>
            <li>
              <strong>Site</strong>: The Application and website owned and
              operated by Sportomic
            </li>
            <li>
              <strong>Total Fee</strong>: Includes Order Value, Convenience Fee,
              Cancellation Fee, and taxes
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2>II. ELIGIBILITY</h2>
          <p>
            You must be competent to enter into a binding contract under
            applicable laws. If you are a minor, your legal guardian will be
            bound by these Terms.
          </p>
        </div>

        <div className="mb-8">
          <h2>III. REGISTRATION AND ACCOUNT</h2>
          <ul>
            <li>
              You must provide accurate and complete registration information
            </li>
            <li>Maintain confidentiality of your account</li>
            <li>Notify us of any unauthorized use</li>
            <li>
              {" "}
              responsibility for all activities conducted through your account
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <h2>IV. SERVICES</h2>
          <p>
            Services may include sports events, fitness sessions, and booking
            platforms. You will be charged applicable fees for Services, which
            may vary.
          </p>
        </div>

        <div className="mb-8">
          <h2>V. CONFIRMATION OF ORDERS</h2>
          <p>
            Orders are confirmed via SMS or email. Check details carefully and
            notify us of any errors immediately.
          </p>
        </div>

        <div className="mb-8">
          <h2>VI. PAYMENT</h2>
          <p>
            Total Fee is collected at the time of order. Payment methods
            include:
            <ul>
              <li>E-Wallet</li>
              <li>Credit/Debit Card</li>
              <li>Net Banking</li>
              <li>Cash</li>
            </ul>
          </p>
        </div>

        <div className="mb-8">
          <h2>VII. CANCELLATION AND REFUND POLICY</h2>
          <div className="ml-6">
            <p>
              Cancellation fees apply based on timing:
              <ul>
                <li>Up to 4 hours before: 10% fee</li>
                <li>Within 4 hours: 100% fee</li>
              </ul>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2>VIII. CUSTOMER RELATIONSHIP MANAGEMENT</h2>
          <p>
            Contact our Grievance Redressal Officer at help@sportomic.com for
            any issues or feedback.
          </p>
        </div>

        <div className="mb-8">
          <h2>IX. FORCE MAJEURE</h2>
          <p>
            We are not liable for non-performance due to Force Majeure events.
          </p>
        </div>

        <div className="mb-8">
          <h2>X. INDEMNIFICATION</h2>
          <p>
            You agree to indemnify Sportomic against any claims arising from
            your use of the Services.
          </p>
        </div>

        <div className="mb-8">
          <h2>XI. LIABILITY</h2>
          <p>
            Sportomic's liability is limited to the Order Value under applicable
            law.
          </p>
        </div>

        <div className="mb-8">
          <h2>XII. DISCLAIMERS</h2>
          <p>
            The Site and Services are provided "as is" without any warranties.
          </p>
        </div>

        <div className="mb-8">
          <h2>XIII. USE OF THE PLATFORM</h2>
          <ul>
            <li>No illegal or harmful activities</li>
            <li>No unauthorized access attempts</li>
            <li>Compliance with all applicable laws</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2>XIV. APPLICATION LICENSE</h2>
          <p>
            Limited, non-exclusive license to use the Application for personal
            use.
          </p>
        </div>

        <div className="mb-8">
          <h2>XV. CONTENT POSTED AND SHARED BY CUSTOMERS</h2>
          <ul>
            <li>You own the rights to your content</li>
            <li>We may publish your content</li>
            <li>End-to-end encryption for messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
