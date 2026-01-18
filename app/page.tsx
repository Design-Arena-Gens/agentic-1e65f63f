'use client';

import { useState } from 'react';
import { Mail, Users, Send, Sparkles, TrendingUp, FileText, Plus, Trash2, Edit } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  contacts: Contact[];
  status: 'draft' | 'active' | 'completed';
  sent: number;
  opened: number;
  replied: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'contacts' | 'generate'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Product Launch Outreach',
      subject: 'Revolutionize Your Workflow',
      body: 'Hi {{name}},\n\nI noticed {{company}} is growing rapidly. Our platform helps companies like yours scale efficiently.\n\nWould you be open to a quick 15-minute call?\n\nBest,\nYour Name',
      contacts: [],
      status: 'draft',
      sent: 0,
      opened: 0,
      replied: 0
    }
  ]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@innovate.io', company: 'Innovate.io' },
  ]);

  const [newContact, setNewContact] = useState({ name: '', email: '', company: '' });
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState({ subject: '', body: '' });
  const [newCampaignName, setNewCampaignName] = useState('');

  const addContact = () => {
    if (newContact.name && newContact.email && newContact.company) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: '', email: '', company: '' });
    }
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const generateEmail = async () => {
    setGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const templates = [
        {
          subject: 'Quick Question About {{company}}',
          body: `Hi {{name}},

I've been following {{company}}'s growth and I'm impressed with what you're building.

I work with companies in your space to help them [specific value proposition]. We've helped similar companies achieve [specific results].

Would you be open to a brief conversation next week?

Best regards,
[Your Name]`
        },
        {
          subject: 'Thought You Might Find This Valuable',
          body: `Hi {{name}},

I noticed {{company}} recently [specific observation]. Congratulations on the progress!

I wanted to reach out because we specialize in helping companies like yours [solve specific problem].

Would you be interested in learning how we helped [similar company] achieve [specific metric]?

Looking forward to connecting,
[Your Name]`
        },
        {
          subject: 'Partnership Opportunity for {{company}}',
          body: `Hi {{name}},

I've been researching companies in your industry and {{company}} stood out to me.

We're currently working with [industry leaders] to [specific benefit]. I believe there could be a strong fit for a partnership.

Are you available for a quick call this week to explore this?

Best,
[Your Name]`
        }
      ];

      const template = templates[Math.floor(Math.random() * templates.length)];
      setGeneratedEmail(template);
      setGenerating(false);
    }, 1500);
  };

  const createCampaignFromGenerated = () => {
    if (newCampaignName && generatedEmail.subject && generatedEmail.body) {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaignName,
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        contacts: [],
        status: 'draft',
        sent: 0,
        opened: 0,
        replied: 0
      };
      setCampaigns([...campaigns, newCampaign]);
      setNewCampaignName('');
      setGeneratedEmail({ subject: '', body: '' });
      setAiPrompt('');
      setActiveTab('campaigns');
    }
  };

  const sendCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'active',
          sent: c.contacts.length,
          opened: Math.floor(c.contacts.length * 0.4),
          replied: Math.floor(c.contacts.length * 0.15)
        };
      }
      return c;
    }));
  };

  const addContactsToCampaign = (campaignId: string, contactIds: string[]) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        const newContacts = contacts.filter(contact =>
          contactIds.includes(contact.id) && !c.contacts.find(cc => cc.id === contact.id)
        );
        return { ...c, contacts: [...c.contacts, ...newContacts] };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Cold Email Agent</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">AI-powered outreach campaigns that convert</p>
        </header>

        <div className="mb-6 flex gap-2 border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'campaigns'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Campaigns
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'contacts'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contacts
            </div>
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'generate'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Generator
            </div>
          </button>
        </div>

        {activeTab === 'campaigns' && (
          <div className="grid gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{campaign.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      campaign.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => sendCampaign(campaign.id)}
                    disabled={campaign.status !== 'draft' || campaign.contacts.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {campaign.status === 'draft' ? 'Launch Campaign' : 'Sent'}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject Line:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{campaign.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Body:</p>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap text-gray-900 dark:text-white font-mono">
                    {campaign.body}
                  </pre>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Contacts</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{campaign.contacts.length}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-300 mb-1">Sent</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{campaign.sent}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-300 mb-1">Opened</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{campaign.opened}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-300 mb-1">Replied</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{campaign.replied}</p>
                  </div>
                </div>

                {campaign.status === 'draft' && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Add contacts to campaign:</p>
                    <div className="flex gap-2 flex-wrap">
                      {contacts.map(contact => (
                        <button
                          key={contact.id}
                          onClick={() => addContactsToCampaign(campaign.id, [contact.id])}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                        >
                          {contact.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {campaign.contacts.length > 0 && (
                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Recipients:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {campaign.contacts.map(contact => (
                        <div key={contact.id} className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.name} - {contact.email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Management</h2>

            <div className="mb-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add New Contact</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                onClick={addContact}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Contacts ({contacts.length})</h3>
              {contacts.map(contact => (
                <div key={contact.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{contact.company}</p>
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              AI Email Generator
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                What kind of email do you want to generate?
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., 'Generate a cold email for SaaS companies about our marketing automation tool' or 'Create an outreach email for CTOs about cybersecurity solutions'"
                className="w-full px-4 py-3 border rounded-lg h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={generateEmail}
                disabled={generating || !aiPrompt}
                className="mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Email
                  </>
                )}
              </button>
            </div>

            {generatedEmail.subject && (
              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-xl">Generated Email</h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject:</label>
                  <input
                    type="text"
                    value={generatedEmail.subject}
                    onChange={(e) => setGeneratedEmail({ ...generatedEmail, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Body:</label>
                  <textarea
                    value={generatedEmail.body}
                    onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg h-64 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Use {'{{name}}'}, {'{{company}}'}, and {'{{email}}'} for personalization
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Name:</label>
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="E.g., 'Q1 SaaS Outreach'"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <button
                  onClick={createCampaignFromGenerated}
                  disabled={!newCampaignName}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Create Campaign
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
