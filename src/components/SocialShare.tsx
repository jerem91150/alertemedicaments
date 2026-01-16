"use client";

import { useState } from "react";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle, X } from "lucide-react";

interface SocialShareProps {
  title: string;
  text: string;
  url?: string;
  medicationName?: string;
  pharmacyName?: string;
  variant?: "button" | "icons" | "modal";
}

export default function SocialShare({
  title,
  text,
  url,
  medicationName,
  pharmacyName,
  variant = "button",
}: SocialShareProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const shareText = pharmacyName
    ? `J'ai trouve ${medicationName} a la ${pharmacyName} ! Verifiez la disponibilite sur MediTrouve.`
    : text;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  if (variant === "icons") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openShare("facebook")}
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
          title="Partager sur Facebook"
        >
          <Facebook className="h-5 w-5" />
        </button>
        <button
          onClick={() => openShare("twitter")}
          className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-all"
          title="Partager sur Twitter"
        >
          <Twitter className="h-5 w-5" />
        </button>
        <button
          onClick={() => openShare("whatsapp")}
          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
          title="Partager sur WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
        <button
          onClick={handleCopyLink}
          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          title="Copier le lien"
        >
          {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
      >
        <Share2 className="h-4 w-4" />
        <span>Partager</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Partager</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">{shareText}</p>
                <p className="text-xs text-teal-600 truncate">{shareUrl}</p>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => openShare("facebook")}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </button>
                <button
                  onClick={() => openShare("twitter")}
                  className="flex items-center justify-center gap-2 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all"
                >
                  <Twitter className="h-5 w-5" />
                  Twitter
                </button>
                <button
                  onClick={() => openShare("whatsapp")}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </button>
                <button
                  onClick={() => openShare("linkedin")}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all"
                >
                  LinkedIn
                </button>
              </div>

              {/* Copy link */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-600"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
