import React from 'react';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      category: "Tenant Rights",
      links: [
        { title: "Pittsburgh Tenant Rights Guide", url: "#", description: "Comprehensive guide to your rights as a renter in Pittsburgh." },
        { title: "PA Landlord-Tenant Act", url: "#", description: "The official laws governing rental agreements in Pennsylvania." },
        { title: "Fair Housing Rights", url: "#", description: "Information about protection against discrimination in housing." }
      ]
    },
    {
      category: "Legal Aid & Support",
      links: [
        { title: "Neighborhood Legal Services", url: "#", description: "Free legal representation for low-income tenants facing eviction." },
        { title: "Community Justice Project", url: "#", description: "Legal advocacy for civil rights and economic justice." },
        { title: "RentHelpPGH", url: "#", description: "Resources for rental assistance and eviction prevention." }
      ]
    },
    {
      category: "Hotlines & Emergency",
      links: [
        { title: "Allegheny Link", url: "#", description: "Single access point for housing and homelessness services." },
        { title: "Utility Assistance (LIHEAP)", url: "#", description: "Help with heating and energy bills." },
        { title: "Code Enforcement", url: "#", description: "Report unsafe living conditions or building code violations." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Renter Resources</h1>
        <p className="text-xl text-gray-600">Helpful information, legal aid, and support for tenants in Pittsburgh.</p>
      </div>

      <div className="space-y-12">
        {resources.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-blue-900">{section.category}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.url}
                  className="block p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {link.title}
                      </h3>
                      <p className="text-gray-600">{link.description}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
        <div className="text-yellow-600 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-yellow-800 mb-1">Disclaimer</h4>
          <p className="text-sm text-yellow-700">
            The information provided on this page is for educational purposes only and does not constitute legal advice.
            Please consult with a qualified attorney or legal aid organization for advice regarding your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
