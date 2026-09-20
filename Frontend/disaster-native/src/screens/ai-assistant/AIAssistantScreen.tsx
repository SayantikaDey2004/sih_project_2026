import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { sendChatMessage, sendVoiceMessage, sendVoiceAudio } from '../../services/chat.service';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { styles } from './AIAssistantScreen.styles';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Message = { id: string; sender: 'ai' | 'user'; text: string; viaVoice?: boolean };
type ChatContextValue = {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  sendUserMessage: (text: string, viaVoice?: boolean) => Promise<string | null>;
  sendVoiceAudioMessage: (uri: string) => Promise<string | null>;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);
function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be inside ChatProvider');
  return ctx;
}

function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserMessage = useCallback(async (text: string, viaVoice = false) => {
    if (!text.trim()) return null;
    setError(null);
    setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), sender: 'user', text, viaVoice }]);
    setIsTyping(true);
    try {
      const reply = viaVoice ? await sendVoiceMessage(text) : await sendChatMessage(text);
      setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), sender: 'ai', text: reply, viaVoice }]);
      return reply;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to contact Geo Rakshak assistant.');
      return null;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const sendVoiceAudioMessage = useCallback(async (uri: string) => {
    setError(null);
    setIsTyping(true);
    try {
      const { transcription, response } = await sendVoiceAudio(uri);
      // Add user's transcribed message
      setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), sender: 'user', text: transcription, viaVoice: true }]);
      // Add AI's response
      setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), sender: 'ai', text: response, viaVoice: true }]);

      // Speak the response
      Speech.speak(response, { language: 'en', rate: 0.9 });

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice transcription failed.');
      return null;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => { setIsTyping(false); setError(null); setMessages([]); }, []);

  return <ChatContext.Provider value={{ messages, isTyping, error, sendUserMessage, sendVoiceAudioMessage, clearChat }}>{children}</ChatContext.Provider>;
}

// ─── SUGGESTED PROMPTS ───────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { label: '🚨 Critical risk zones', prompt: 'What are the current critical risk zones and their status?' },
  { label: '🌧 Rainfall warnings', prompt: 'Are there heavy rainfall alerts active right now in the region?' },
  { label: '🏥 Emergency help units', prompt: 'Show nearest hospitals and response teams available.' },
  { label: '🛣 Safe evacuation routes', prompt: 'What are the safe evacuation routes and current road conditions?' },
];

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View style={styles.aiBotIcon}>
          <Text style={styles.aiBotIconText}>✦</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
          {msg.text}
        </Text>
        {msg.viaVoice && (
          <Text style={[styles.bubbleVoice, isUser ? styles.bubbleVoiceUser : {}]}>
            🎤 spoken
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <View style={styles.bubbleRow}>
      <View style={styles.aiBotIcon}><Text style={styles.aiBotIconText}>✦</Text></View>
      <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.typingDot, { opacity: 0.4 + i * 0.3 }]} />
        ))}
      </View>
    </View>
  );
}

// ─── VOICE MODAL ─────────────────────────────────────────────────────────────
function VoiceModal({ open, onClose, isRecording }: { open: boolean; onClose: () => void; isRecording: boolean }) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.voiceOverlay}>
        <View style={styles.voiceCard}>
          <TouchableOpacity style={styles.voiceCloseBtn} onPress={onClose}>
            <Text style={styles.voiceCloseText}>✕</Text>
          </TouchableOpacity>
          <View style={[styles.voiceOrb, isRecording && { backgroundColor: '#ff4444' }]}>
            <Text style={styles.voiceOrbText}>{isRecording ? '⏺' : '🎤'}</Text>
          </View>
          <Text style={styles.voiceListeningText}>{isRecording ? 'Recording...' : 'Preparing...'}</Text>
          <Text style={styles.voiceSubText}>Speak clearly in English</Text>
          {isRecording && (
            <TouchableOpacity style={styles.stopVoiceBtn} onPress={onClose}>
              <Text style={styles.stopVoiceText}>Tap to Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── CHAT SECTION ─────────────────────────────────────────────────────────────
function ChatSection() {
  const { messages, isTyping, error, sendUserMessage, sendVoiceAudioMessage, clearChat } = useChat();
  const [draft, setDraft] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (messages.length > 0) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text || draft;
    if (!msg.trim()) return;
    sendUserMessage(msg.trim());
    setDraft('');
  };

  const handleClearTap = () => {
    if (confirmingClear) {
      if (clearTimer.current) clearTimeout(clearTimer.current);
      setConfirmingClear(false);
      clearChat();
      return;
    }
    setConfirmingClear(true);
    clearTimer.current = setTimeout(() => setConfirmingClear(false), 3000);
  };

  const handleVoice = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        sendUserMessage('Voice assistant unavailable — microphone permission denied.', true);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setVoiceOpen(true);
      setIsRecording(true);

      const recordingOptions = {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recordingRef.current = recording;
    } catch (err) {
      console.error('Failed to start recording', err);
      setVoiceOpen(false);
      setIsRecording(false);
    }
  };

  const stopVoice = async () => {
    if (!recordingRef.current) return;
    setIsRecording(false);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setVoiceOpen(false);
      if (uri) {
        sendVoiceAudioMessage(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setVoiceOpen(false);
    }
  };

  const allMessages: (Message | { id: string; type: 'typing' })[] = isTyping
    ? [...messages, { id: '__typing__', type: 'typing' as const }]
    : messages;

  return (
    <View style={styles.chatContainer}>
      {/* Header */}
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderIcon}>
          <Text style={styles.chatHeaderIconText}>✦</Text>
        </View>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderTitle}>Geo Rakshak AI Assistant</Text>
          <View style={styles.chatHeaderStatus}>
            <View style={styles.chatStatusDot} />
            <Text style={styles.chatStatusText}>Watching regional telemetry in real time</Text>
          </View>
        </View>
        {confirmingClear && <Text style={styles.clearHint}>Tap again to clear</Text>}
        <TouchableOpacity
          style={[styles.clearBtn, confirmingClear && styles.clearBtnActive]}
          onPress={handleClearTap}
        >
          <Text style={styles.clearBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}><Text style={styles.emptyIconText}>✦</Text></View>
          <Text style={styles.emptyTitle}>How can I assist your regional safety today?</Text>
          <Text style={styles.emptySubtitle}>
            Ask about active slope stability, rainfall warnings, disaster response teams, or road conditions.
          </Text>
          <View style={styles.promptGrid}>
            {SUGGESTED_PROMPTS.map((item) => (
              <TouchableOpacity key={item.label} style={styles.promptChip} onPress={() => handleSend(item.prompt)}>
                <Text style={styles.promptChipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={allMessages as any[]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => {
            if ('type' in item && item.type === 'typing') return <TypingIndicator />;
            return <MessageBubble msg={item as Message} />;
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.chatInput}
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about a village, river, slope, or route…"
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.micBtn} onPress={handleVoice}>
            <Text style={styles.micBtnText}>🎤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!draft.trim()}
          >
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <VoiceModal open={voiceOpen} onClose={stopVoice} isRecording={isRecording} />
    </View>
  );
}

export default function AIAssistantScreen() {
  return (
    <ChatProvider>
      <ChatSection />
    </ChatProvider>
  );
}
