'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // All your brand names from the templates directory
  const brands = [
    "acne_studios", "adidas", "amazon", "apple", "arcteryx", "argos",
    "balenciaga", "bape", "best_secret", "boots", "breuninger", "broken_planet",
    "bulgari", "burberry", "canada_goose", "cartier", "cettire", "chanel",
    "chrono24", "corteiz", "culture_kings", "debijenkorf", "denim_tears",
    "dior", "dyson", "ebay", "end", "farfetch", "flannels", "flight_club",
    "frasers", "gallery_dept", "goat", "gucci", "harrods", "hermes",
    "jd_sports", "john_lewis", "loro_piana", "louis_vuitton", "maison_margiela",
    "moncler", "neiman_marcus", "nike", "nike_snkrs", "nordstrom", "north_face",
    "off_white", "pacsun", "pop_mort", "prada", "saint_laurent", "sephora",
    "sp5der", "ssense", "stanley", "stockx", "stussy", "supreme",
    "taylor_made_golf", "trapstar", "ugg", "vinted", "vivienne_westwood",
    "xerjoff", "yeezy_gap", "zalando"
  ];

  // Function to convert brand slug to display name
  const toLabel = (name: string): string => {
    const special: Record<string, string> = {
      zip_code: "ZIP Code",
      product_id: "Product ID",
      order_number: "Order Number",
      phone_number: "Phone Number",
      brand_name: "Brand Name",
      taxes_percentatge: "Taxes Percentatge",
      currency: "Currency",
      debijenkorf: "De Bijenkorf",
      arcteryx: "Arc'teryx",
      nike_snkrs: "Nike SNKRS",
      taylor_made_golf: "TaylorMade Golf",
      yeezy_gap: "Yeezy Gap",
      maison_margiela: "Maison Margiela",
      louis_vuitton: "Louis Vuitton",
      north_face: "The North Face",
      off_white: "Off-White",
      pop_mort: "Pop Mort",
      saint_laurent: "Saint Laurent",
      vivienne_westwood: "Vivienne Westwood"
    };
    
    if (special[name]) return special[name];
    return name
      .split("_")
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  };

  return (
    <footer className="bg-[#4A7DFF] text-white py-12 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* About us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About us</h3>
          <p className="text-white/90 mb-4 leading-relaxed">
            Best quality receipts 1:1 in the market, over 70 brands templates.
            <br />
          </p>

          <div className="space-y-2 text-white/90">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:hubreceipts@outlook.com" className="hover:underline">
                hubreceipts@outlook.com
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-white">
            <a href="#"><i className="fab fa-facebook-f text-lg"></i></a>
            <a href="#"><i className="fab fa-instagram text-lg"></i></a>
            <a href="#"><i className="fab fa-youtube text-lg"></i></a>
            <a href="#"><i className="fab fa-tiktok text-lg"></i></a>
          </div>
        </div>

        {/* Popular Brands */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Popular Brands</h3>
          <ul className="space-y-2 text-white/90">
            {brands.slice(0, 8).map((brand) => (
              <li key={brand}>
                <Link 
                  href={`/brands/${brand}`}
                  className="hover:underline transition-colors duration-200"
                >
                  {toLabel(brand)} Receipts
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* More Brands */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Luxury Brands</h3>
          <ul className="space-y-2 text-white/90">
            {brands.slice(8, 16).map((brand) => (
              <li key={brand}>
                <Link 
                  href={`/brands/${brand}`}
                  className="hover:underline transition-colors duration-200"
                >
                  {toLabel(brand)} Receipts
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links & All Brands */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/90 mb-6">
            <li>
              <a href="https://discord.com/invite/2ZRQu2uT62" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Our Discord Server
              </a>
            </li>
            <li>
              <a href="mailto:hubreceipts@outlook.com?subject=Support Request" className="hover:underline">
                Our Email
              </a>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">All Brands</h3>
          <div className="max-h-32 overflow-y-auto pr-2">
            <ul className="space-y-1 text-white/90 text-xs">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link 
                    href={`/brands/${brand}`}
                    className="hover:underline transition-colors duration-200"
                  >
                    {toLabel(brand)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-white/30 pt-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Country Selector */}
        <select
          aria-label="Select country and currency"
          className="bg-transparent border border-white/50 rounded-md px-3 py-2 text-white/90"
        >
          <option>Spain | EUR €</option>
          <option>Finland | EUR €</option>
          <option>USA | USD $</option>
        </select>

        {/* Policies */}
        <div className="text-white/90 flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Refund Policy</a>
          <a href="#" className="hover:underline">Cookie Preferences</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>

      <div className="mt-6 text-center text-white/90 text-xs">
        ©2025, HubReceipts - Professional Receipt Generator
      </div>

      <div className="mt-2 text-center text-white/90 text-sm">
        Follow us on social media!
        <div className="inline-flex gap-3 ml-2">
          <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="TikTok" className="hover:text-white transition-colors">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar for the All Brands section */
        .max-h-32::-webkit-scrollbar {
          width: 4px;
        }
        .max-h-32::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .max-h-32::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .max-h-32::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </footer>
  );
};

export default Footer;