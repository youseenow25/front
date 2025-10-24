'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';



const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

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

       

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/90">
              <li>
  <a href="https://discord.gg/Mn8ZJTgcz5" target="_blank" rel="noopener noreferrer" className="hover:underline">
    Our Discord Server
  </a>
</li>
            <li>
  <a href="mailto:hubreceipts@outlook.com?subject=Support Request" className="hover:underline">
    Our email
  </a>
</li>
          </ul>
        </div>

      
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-white/30 pt-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Country Selector */}
        <select className="bg-transparent border border-white/50 rounded-md px-3 py-2 text-white/90">
          <option>Spain | EUR €</option>
          <option>Finland | EUR €</option>
          <option>USA | USD $</option>
        </select>

        {/* Policies */}
        <div style={{gap:10}} className="text-white/90 space-x-4 text-center">
          <a href="#" className="hover:underline">Privacy policy</a>
          <a style={{marginLeft:10}} href="#" className="hover:underline">Refund policy</a>
          <a  style={{marginLeft:10}} href="#" className="hover:underline">Cookie preferences</a>
        </div>

       
      </div>

      <div className="mt-6 text-center text-white/90 text-xs">
        ©2025, HubReceipts
      </div>

      <div className="mt-2 text-center text-white/90">
        Follow us on social media!
        <div className="inline-flex gap-3 ml-2">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-tiktok"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
