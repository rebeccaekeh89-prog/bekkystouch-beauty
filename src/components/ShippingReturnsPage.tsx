import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';

type Question = { question: string; answer: string };

const sections: { title: string; questions: Question[] }[] = [
  {
    title: 'Delivery cost & timing',
    questions: [
      {
        question: 'How much is delivery?',
        answer: 'The demo checkout shows free UK delivery on every order, with no minimum spend. No delivery charge is added to the total.'
      },
      {
        question: 'When will my order arrive?',
        answer: 'This is a coursework demonstration. Orders are recorded as pending for offline payment, but no payment is collected and no products are dispatched. There is therefore no delivery date to quote.'
      },
      {
        question: 'Can I choose express or international delivery?',
        answer: 'The demo does not arrange express or international delivery. The checkout shows a UK delivery address for demonstration only.'
      }
    ]
  },
  {
    title: 'Order information',
    questions: [
      {
        question: 'How do I check my order?',
        answer: 'Sign in and open My Account to view your recorded order history. A pending order is a demo record, not a dispatch confirmation.'
      },
      {
        question: 'Will I receive a tracking number?',
        answer: 'No parcels are sent through this demo, so tracking numbers are not generated.'
      },
      {
        question: 'I entered the wrong details. What should I do?',
        answer: 'Use the Contact Us form and include your order number if you have one. We can review the demo record; sending the form does not automatically edit or cancel an order.'
      }
    ]
  },
  {
    title: 'Returns & refunds',
    questions: [
      {
        question: 'Can I return a demo order?',
        answer: 'No goods or payments are exchanged through this website, so there is nothing to return or refund for a demo order. If you have a question about a record in My Account, please contact us.'
      },
      {
        question: 'What if the shop starts taking real orders?',
        answer: 'Delivery dates, return instructions and any applicable refund terms will be published before real purchases are enabled. UK consumer rights would still apply to real purchases.'
      }
    ]
  }
];

interface ShippingReturnsPageProps {
  onNavigateContact: () => void;
  onNavigateHome: () => void;
}

export const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = ({
  onNavigateContact,
  onNavigateHome
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "Shipping & Returns | Bekky's Touch Beauty";
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      "Shipping, order tracking and returns information for the Bekky's Touch Beauty demo store."
    );
  }, []);

  const filtered = sections
    .map(section => ({
      ...section,
      questions: section.questions.filter(item =>
        `${section.title} ${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    }))
    .filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-20">
        <a href="/" onClick={e => { e.preventDefault(); onNavigateHome(); }}
          className="text-sm text-amber-900 hover:underline">← Back to shop</a>
        <div className="mt-7">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-900">Customer help</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mt-3">Shipping &amp; Returns</h1>
          <p className="mt-4 text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
            Find answers about delivery, order records and returns for our demonstration store.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950 leading-relaxed">
          <strong>Demo store:</strong> Checkout records an order for coursework and does not take payment or dispatch products.
        </div>

        <label htmlFor="shipping-search" className="sr-only">Search shipping and returns questions</label>
        <div className="relative mt-8">
          <input id="shipping-search" type="search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search delivery and returns questions"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700" />
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-stone-500 pointer-events-none" aria-hidden="true" />
        </div>

        <div className="mt-10 space-y-9">
          {filtered.map(section => (
            <section key={section.title} aria-label={section.title}>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">{section.title}</h2>
              <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-200 overflow-hidden">
                {section.questions.map(item => (
                  <details key={item.question} className="group px-5 sm:px-6">
                    <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none text-sm font-medium text-stone-900 [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <ChevronDown className="w-4 h-4 shrink-0 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="pb-5 max-w-2xl text-sm leading-relaxed text-stone-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
              No matching questions. You can send us your question using the contact form.
            </p>
          )}
        </div>

        <div className="mt-12 rounded-2xl bg-[#1E1B18] p-7 sm:p-9 text-white">
          <h2 className="font-serif text-2xl">Still need help?</h2>
          <p className="mt-2 text-sm text-stone-300">Send us a message. If your question is about a demo order, include its order number.</p>
          <a href="/contact" onClick={e => { e.preventDefault(); onNavigateContact(); }}
            className="inline-flex items-center gap-2 mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-100">
            Contact Us <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-8 text-xs text-stone-500">
          For information about rights on real online purchases, see{' '}
          <a href="https://www.gov.uk/online-and-distance-selling-for-businesses" target="_blank" rel="noopener noreferrer"
            className="underline hover:text-stone-800">UK government guidance</a>.
        </p>
      </section>
    </div>
  );
};
