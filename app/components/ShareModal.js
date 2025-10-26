'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ShareModal({ show, onClose, catalogId, catalogData }) {
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle body overflow when modal is open/closed
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  // Generate share link when component mounts or show/catalogId changes
  useEffect(() => {
    const generateShareLink = async () => {
      if (!catalogId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/catalog/share/${catalogId}`);
        const data = await response.json();
        
        if (response.ok) {
          setShareLink(data.shareLink);
        } else {
          throw new Error(data.error || 'Failed to generate share link');
        }
      } catch (error) {
        console.error('Error generating share link:', error);
        toast.error('Failed to generate share link');
      } finally {
        setIsLoading(false);
      }
    };

    if (show && catalogId) {
      generateShareLink();
    }
  }, [show, catalogId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const shareOnSocial = (platform) => {
    const title = catalogData?.title || 'Check out this catalog';
    const text = catalogData?.description || '';
    const url = shareLink;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
     case 'gmail':
  shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
  break;

      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (!show) return null;

  // Social share buttons configuration
  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: (
        <path d="M17.5 14.4c-.3 0-.5-.1-.7-.2l-1.9-.9c-.2-.1-.4-.1-.6 0l-1.1.3c-.2.1-.4 0-.5-.1l-2.1-2.1c-.1-.1-.1-.3 0-.5l.3-1.1c0-.2 0-.4-.1-.6l-.9-1.9c-.2-.3-.2-.5-.2-.7 0-.4.3-.8.8-.8h1.5c.3 0 .6.1.8.3.2.2.3.5.3.8 0 .4.1.7.2 1 .1.3.2.6.5.8.3.2.6.3.9.3s.5.1.7.3c.2.2.3.5.3.8s.1.6.3.8c.2.2.5.3.8.3.3 0 .6 0 .9-.1.3-.1.6-.2.9-.2.3 0 .6 0 .8.3.2.2.3.5.3.8v1.5c0 .5-.4.8-.8.8z M12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.8l-1.3 4.5 4.6-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.2.9.9-3.2-.2-.3C4.4 15.1 4 13.6 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
      ),
      color: 'from-green-500 to-emerald-500',
      href: `https://wa.me/?text=${encodeURIComponent(`Check out: ${catalogData?.title || 'Shared Catalog'}\n\n${shareLink}`)}`
    },
    {
      name: 'Telegram',
      icon: (
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.4 15.5l-1.6 1.6-1.8-2.7-3.5 1.4L7 16.4l7.6-7.6c.3-.3.7-.3 1 0 .3.3.3.7 0 1l-5.1 5.1 1.4 2.1 2.7-1.8 1.6 1.6c.2.2.5.2.7 0l1.1-1.1c.1-.2.1-.5 0-.7z" />
      ),
      color: 'from-blue-500 to-sky-500',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(catalogData?.title || 'Check this out')}`
    },
    {
      name: 'Twitter',
      icon: (
        <path d="M22.5 6c-.8.4-1.7.6-2.6.7.9-.6 1.6-1.5 1.9-2.6-.9.5-1.9.9-2.9 1.1-.8-.9-2-1.4-3.3-1.4-2.5 0-4.5 2-4.5 4.5 0 .4 0 .7.1 1-3.7-.2-7-2-9.2-4.7-.4.6-.6 1.4-.6 2.2 0 1.5.8 2.9 2 3.6-.7 0-1.4-.2-2-.5v.1c0 2.2 1.6 4 3.7 4.4-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 2 2.4 3.4 4.6 3.4-1.7 1.3-3.8 2.1-6.1 2.1-.4 0-.8 0-1.2-.1 2 1.3 4.4 2.1 7 2.1 8.3 0 12.8-6.9 12.8-12.8 0-.2 0-.4 0-.6.9-.6 1.6-1.4 2.2-2.3z" />
      ),
      color: 'from-sky-400 to-blue-500',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(catalogData?.title || 'Check this out')}`
    },
    {
      name: 'Facebook',
      icon: (
        <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7c4.7-.8 8.4-4.9 8.4-9.9z" />
      ),
      color: 'from-blue-600 to-blue-800',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
    },
    {
      name: 'LinkedIn',
      icon: (
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      ),
      color: 'from-blue-600 to-blue-700',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`
    },
    {
      name: 'Gmail',
      icon: (
       <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 7L4 6v12h16V6l-8 5z" />
      ),
      color: 'from-red-500 to-rose-600',
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
      catalogData?.title || 'Check out this catalog'
      )}&body=${encodeURIComponent(
      `${catalogData?.description || ''}\n\nView here: ${shareLink}`
  )}`
}

  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        {/* Enhanced Backdrop with better blur */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-lg transition-all duration-300"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div
          className="relative inline-block align-bottom text-left overflow-hidden rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-white/20 bg-white/80 backdrop-blur-xl"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Share Catalog
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Share this catalog with others
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="px-6 py-2">
            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-3 rounded-xl bg-gradient-to-r ${platform.color} text-white hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5`}
                  title={`Share on ${platform.name}`}
                >
                  <div className="p-2 mb-1 bg-white/20 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {platform.icon}
                    </svg>
                  </div>
                  <span className="text-xs font-medium">{platform.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="mt-6">
              <label htmlFor="share-link" className="block text-sm font-medium text-gray-700 mb-2">
                Or copy link
              </label>
              <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
                <input
                  type="text"
                  id="share-link"
                  readOnly
                  value={isLoading ? 'Generating link...' : shareLink}
                  className="flex-1 min-w-0 block w-full px-4 py-3 text-sm text-gray-700 bg-white border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  disabled={isLoading || !shareLink}
                  className="inline-flex items-center px-4 py-2 border-l border-gray-200 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-0 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
