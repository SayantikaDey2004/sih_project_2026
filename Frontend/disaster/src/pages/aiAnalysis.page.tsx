import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import { Send, Mic, X, Trash2, Sparkles, Bot } from "lucide-react";
import { sendChatMessage, sendVoiceMessage, sendVoiceAudio } from "../services/chat.service";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { getCurrentUser } from "../services/auth.service";
import bg3Image from "../assets/bg3.jpg";

/* ============================================================================
   TYPES & CONTEXT
============================================================================ */
type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  viaVoice?: boolean;
};

type ChatContextValue = {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  sendUserMessage: (text: string, viaVoice?: boolean) => Promise<string | null>;
  sendVoiceAudioMessage: (blob: Blob) => Promise<string | null>;
  clearChat: () => void;
  appendAiErrorMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
}

function ChatProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserMessage = useCallback(async (text: string, viaVoice = false) => {
    if (!text.trim()) return null;
    setError(null);
    const userMsgId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text, viaVoice }]);
    setIsTyping(true);

    try {
      const reply = viaVoice ? await sendVoiceMessage(text) : await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "ai", text: reply, viaVoice },
      ]);
      return reply;
    } catch (requestError) {
      const msg = requestError instanceof Error ? requestError.message : "Unable to contact Geo Rakshak assistant.";
      setError(msg);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const sendVoiceAudioMessage = useCallback(async (blob: Blob) => {
    setError(null);
    setIsTyping(true);
    try {
      const { transcription, response } = await sendVoiceAudio(blob);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "user", text: transcription, viaVoice: true },
        { id: crypto.randomUUID(), sender: "ai", text: response, viaVoice: true },
      ]);
      return response;
    } catch (requestError) {
      const msg = requestError instanceof Error ? requestError.message : "Voice assistant failed.";
      setError(msg);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const appendAiErrorMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "ai", text, viaVoice: true },
    ]);
  }, []);

  const clearChat = useCallback(() => {
    setIsTyping(false);
    setError(null);
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        error,
        sendUserMessage,
        sendVoiceAudioMessage,
        clearChat,
        appendAiErrorMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

/* ============================================================================
   VOICE ASSISTANT OVERLAY (Neon Orb & Soundwaves Popup - Only Animation)
============================================================================ */
interface VoiceAssistantPopupProps {
  open: boolean;
  onClose: () => void;
}

function VoiceAssistantPopup({ open, onClose }: VoiceAssistantPopupProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Small animated popup box */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#0b1b13]/95 border border-[#34D399]/40 shadow-[0_0_50px_rgba(52,211,153,0.25)] flex flex-col items-center justify-center overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-[#98BAA0] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close voice assistant"
        >
          <X size={16} />
        </button>

        {/* Ambient neon backdrop glow */}
        <div className="absolute inset-0 bg-radial from-[#10B981]/20 via-transparent to-transparent pointer-events-none" />

        {/* Animated Neon Orb & Glowing Waves */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Wave Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-[#34D399]/30 animate-ping-slow" />
          <div className="absolute w-48 h-48 rounded-full border border-[#10B981]/20 animate-ping-slower" />
          <div className="absolute w-28 h-28 rounded-full bg-[#10B981]/15 blur-xl animate-pulse" />

          {/* Rotating Neon Aura Orb */}
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.55)]">
            {/* Spinning Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#059669] via-[#34D399] to-[#F59E0B] animate-spin-slow opacity-90 blur-[1px]" />
            <div className="absolute inset-[3px] rounded-full bg-[#0d2217] flex items-center justify-center">
              {/* Inner Glowing Core */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] flex items-center justify-center shadow-[inset_0_0_12px_rgba(255,255,255,0.4)] animate-core-pulse">
                {/* Dynamic Equalizer Bars */}
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1 bg-[#F4EFE4] rounded-full animate-wave-bar-1" />
                  <span className="w-1 bg-[#F59E0B] rounded-full animate-wave-bar-2" />
                  <span className="w-1 bg-[#34D399] rounded-full animate-wave-bar-3" />
                  <span className="w-1 bg-[#F59E0B] rounded-full animate-wave-bar-4" />
                  <span className="w-1 bg-[#F4EFE4] rounded-full animate-wave-bar-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MESSAGE BUBBLE
============================================================================ */
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5A33D] text-[#102419] shadow-sm mt-0.5">
          <Bot size={15} />
        </div>
      )}
      <div className="max-w-[85%] sm:max-w-[78%]">
        <div
          className={`px-4 py-3 text-[14px] leading-relaxed shadow-md ${
            isUser
              ? "rounded-2xl rounded-tr-xs bg-[#E5A33D] text-[#102419] font-medium"
              : "rounded-2xl rounded-tl-xs border border-white/10 bg-[#152B1F] text-[#F4EFE4]"
          }`}
        >
          {msg.text}
        </div>
        {msg.viaVoice && (
          <div
            className={`flex items-center gap-1 mt-1 text-[11px] ${
              isUser ? "justify-end text-[#8AA68F]" : "text-[#8AA68F]"
            }`}
          >
            <Mic size={11} />
            spoken
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   TYPING INDICATOR
============================================================================ */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 justify-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5A33D] text-[#102419] shadow-sm mt-0.5">
        <Bot size={15} />
      </div>
      <div className="rounded-2xl rounded-tl-xs border border-white/10 bg-[#152B1F] px-4 py-3.5 flex items-center gap-1.5 shadow-md">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#E5A33D] animate-bounce"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   MAIN CHAT SECTION
============================================================================ */
function ChatSection() {
  const {
    messages,
    isTyping,
    error,
    sendUserMessage,
    sendVoiceAudioMessage,
    clearChat,
    appendAiErrorMessage,
  } = useChat();
  const [draft, setDraft] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clearArmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (clearArmTimer.current) clearTimeout(clearArmTimer.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || draft;
    if (!text.trim()) return;
    sendUserMessage(text.trim());
    setDraft("");
  };

  const stopVoiceCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setVoiceOpen(false);
  }, []);

  const startVoiceCapture = useCallback(async () => {
    console.log("Starting voice capture...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Force the type to webm as it's the standard for modern Chrome/Android
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log("DEBUG: Audio blob created, size:", audioBlob.size, "type:", audioBlob.type);

        // Reduced threshold to 200 bytes to allow shorter voice commands
        if (audioBlob.size > 200) {
          await sendVoiceAudioMessage(audioBlob);
        } else {
          console.warn("DEBUG: Audio too small.");
          appendAiErrorMessage("I didn't catch that. Please hold the mic and speak clearly.");
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      setVoiceOpen(true);
      // Start with a time slice to ensure periodic data chunks
      mediaRecorder.start(500);

      // Auto stop after 6 seconds if not stopped manually
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          stopVoiceCapture();
        }
      }, 6000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      appendAiErrorMessage("Microphone access denied or unavailable.");
      setVoiceOpen(false);
    }
  }, [stopVoiceCapture, appendAiErrorMessage, sendVoiceAudioMessage]);

  const handleClearClick = () => {
    if (confirmingClear) {
      if (clearArmTimer.current) clearTimeout(clearArmTimer.current);
      setConfirmingClear(false);
      clearChat();
      return;
    }
    setConfirmingClear(true);
    clearArmTimer.current = setTimeout(() => setConfirmingClear(false), 3000);
  };

  const SUGGESTED_PROMPTS = [
    { label: "🚨 Critical risk zones", prompt: "What are the current critical risk zones and their status?" },
    { label: "🌧 Rainfall warnings", prompt: "Are there heavy rainfall alerts active right now in the region?" },
    { label: "🏥 Emergency help units", prompt: "Show nearest hospitals and response teams available." },
    { label: "🛣 Safe evacuation routes", prompt: "What are the safe evacuation routes and current road conditions?" },
  ];

  return (
    <section id="chat" className="flex-1 min-h-0 flex flex-col bg-transparent">
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto flex flex-col px-3 sm:px-6 py-3 sm:py-5">
        <div className="relative flex-1 min-h-0 rounded-3xl border border-white/10 bg-[#0d1f17]/95 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#13281e]/95 backdrop-blur-md">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5A33D] text-[#102419] shadow-sm">
              <Sparkles size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F4EFE4]">
                Geo Rakshak AI Assistant
              </p>
              <div className="text-[12px] flex items-start sm:items-center gap-1.5 font-medium text-[#D9A441] mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse shrink-0 mt-1 sm:mt-0" />
                <span className="leading-snug">Watching regional telemetry & hazard grids in real time</span>
              </div>
            </div>
            {confirmingClear && (
              <span className="text-[11px] whitespace-nowrap font-medium text-[#F2C14E]">
                Tap again to clear
              </span>
            )}
            <button
              onClick={handleClearClick}
              className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-all ${
                confirmingClear
                  ? "bg-[#D9A441] text-[#102419]"
                  : "text-[#8AA68F] hover:text-[#F4EFE4] hover:bg-white/10"
              }`}
              aria-label={confirmingClear ? "Confirm clear chat" : "Clear chat"}
              title={confirmingClear ? "Tap again to clear" : "Clear chat"}
            >
              <Trash2 size={17} />
            </button>
          </div>

          {/* Messages or Welcome Starter */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#162D21] text-[#E5A33D] shadow-lg mb-4">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F4EFE4]">
                  How can I assist your regional safety today?
                </h3>
                <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[#98BAA0]">
                  Ask about active slope stability, rainfall warnings, disaster response teams, or road conditions.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {SUGGESTED_PROMPTS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="rounded-2xl border border-white/10 bg-[#142A1E]/80 hover:border-[#34D399]/40 hover:bg-[#1A3828] px-4 py-3 text-left text-xs sm:text-sm font-medium text-[#C2D8C6] transition-all hover:text-[#F4EFE4] shadow-sm cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => <MessageBubble key={m.id} msg={m} />)
            )}
            {isTyping && <TypingIndicator />}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-center text-xs font-medium text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#13281e]/95 backdrop-blur-md flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about a village, river, slope, or route…"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-full text-sm outline-none border border-white/15 bg-[#173123]/90 text-[#F4EFE4] placeholder-[#8AA68F] transition-all focus:border-[#34D399] focus:bg-[#1A3828]"
            />
            {/* Small Mic Button beside Send Button */}
            <button
              onClick={startVoiceCapture}
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center border border-white/15 bg-[#173123]/90 text-[#E5A33D] hover:text-[#F4EFE4] hover:bg-[#1F4130] hover:border-[#34D399] transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Start voice capture"
              title="Speak with Geo Rakshak Voice Assistant"
            >
              <Mic size={17} />
            </button>
            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!draft.trim()}
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-[#E5A33D] hover:bg-[#f0ac44] text-[#102419] font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
              aria-label="Send message"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Voice Assistant Overlay Popup */}
          <VoiceAssistantPopup open={voiceOpen} onClose={stopVoiceCapture} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   PAGE CONTAINER
============================================================================ */
export default function AiAnalysisPage() {
  const user = getCurrentUser();
  const currentUser = {
    id: user?.email || "user@georakshak.org",
    name: user?.name || "Citizen",
    role: "AI Assistant",
    avatar: user?.name ? user.name.slice(0, 2).toUpperCase() : "AI",
  };

  return (
    <DashboardLayout
      user={{
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      }}
      email={currentUser.id}
    >
      <ChatProvider>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in { animation: fadeIn 0.2s ease-out; }

          @keyframes scaleUp {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1); }

          @keyframes spinSlow {
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spinSlow 6s linear infinite; }

          @keyframes pingSlow {
            0% { transform: scale(0.85); opacity: 0.8; }
            80%, 100% { transform: scale(1.35); opacity: 0; }
          }
          .animate-ping-slow { animation: pingSlow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite; }

          @keyframes pingSlower {
            0% { transform: scale(0.85); opacity: 0.6; }
            80%, 100% { transform: scale(1.6); opacity: 0; }
          }
          .animate-ping-slower { animation: pingSlower 2.8s cubic-bezier(0, 0, 0.2, 1) 0.7s infinite; }

          @keyframes corePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .animate-core-pulse { animation: corePulse 1.8s ease-in-out infinite; }

          @keyframes waveBar1 {
            0%, 100% { height: 8px; }
            50% { height: 24px; }
          }
          .animate-wave-bar-1 { animation: waveBar1 0.7s ease-in-out infinite; }

          @keyframes waveBar2 {
            0%, 100% { height: 18px; }
            50% { height: 32px; }
          }
          .animate-wave-bar-2 { animation: waveBar2 0.6s ease-in-out infinite 0.15s; }

          @keyframes waveBar3 {
            0%, 100% { height: 24px; }
            50% { height: 38px; }
          }
          .animate-wave-bar-3 { animation: waveBar3 0.5s ease-in-out infinite 0.1s; }

          @keyframes waveBar4 {
            0%, 100% { height: 14px; }
            50% { height: 28px; }
          }
          .animate-wave-bar-4 { animation: waveBar4 0.65s ease-in-out infinite 0.2s; }
        `}</style>

        <div
          className="h-[calc(100dvh-60px)] flex flex-col overflow-hidden relative w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(7, 20, 14, 0.76), rgba(7, 20, 14, 0.88)), url(${bg3Image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
          }}
        >
          <ChatSection />
        </div>
      </ChatProvider>
    </DashboardLayout>
  );
}