"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/#movies" },
    { name: "TV Shows", href: "/#tv-shows" },
    { name: "Upcoming", href: "/upcoming" },
    { name: "Trending", href: "/#trending" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/budds300",
      icon: Github,
      color: "hover:text-gray-400",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/tamminga-budds",
      icon: Linkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "Email",
      href: "mailto:contact@eyemax.com",
      icon: Mail,
      color: "hover:text-red-400",
    },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-teal-500 text-white px-3 py-1 rounded font-bold text-lg">
                EYEMAX
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for movies and TV shows. Discover,
              watch, and enjoy the latest entertainment content.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Tamminga Budds</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 transition-colors text-sm flex items-center space-x-1"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 transition-all duration-200 hover:scale-110",
                    social.color,
                  )}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                <strong>Developer:</strong> Tamminga Budds
              </p>
              <p className="text-gray-400 text-sm">
                <strong>GitHub:</strong> @budds300
              </p>
              <p className="text-gray-400 text-sm">
                <strong>LinkedIn:</strong> tamminga-budds
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} EyeMax. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              {/* <Link href="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">
                About
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
