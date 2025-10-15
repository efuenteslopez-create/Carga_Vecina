
import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';
import { UserRole, ChargingPoint, Booking, ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { BotIcon } from './icons/BotIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    role: UserRole;
    chargers: ChargingPoint[];
    bookings: Booking[];
  };
}

const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if(isOpen) {
        setMessages([{
            sender: 'assistant',
            text: context.role === 'driver' 
                ? '¡Hola! Soy tu asistente CargaVecina. ¿Cómo puedo ayudarte a encontrar un punto de carga hoy?' 
                : '¡Hola! Soy tu asistente de anfitrión. ¿En qué te puedo ayudar para optimizar tus cargadores?'
        }]);
    }
  }, [isOpen, context.role]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getAssistantResponse(input, context);
      const assistantMessage: ChatMessage = { sender: 'assistant', text: responseText };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'assistant', text: 'Hubo un error al contactar al asistente.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <BotIcon className="h-8 w-8 text-brand-primary" />
            <h2 className="text-xl font-bold text-brand-dark">Asistente Inteligente</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'assistant' && <BotIcon className="h-8 w-8 text-brand-primary flex-shrink-0 mt-1" />}
              <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-secondary text-white rounded-br-none' : 'bg-gray-100 text-brand-dark rounded-bl-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
               {msg.sender === 'user' && <UserCircleIcon className="h-8 w-8 text-gray-400 flex-shrink-0 mt-1" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <BotIcon className="h-8 w-8 text-brand-primary flex-shrink-0 mt-1" />
              <div className="max-w-md p-3 rounded-2xl bg-gray-100 text-brand-dark rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <footer className="p-4 border-t">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white rounded-full p-2 disabled:bg-gray-300 hover:bg-emerald-600 transition-colors"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AssistantModal;
