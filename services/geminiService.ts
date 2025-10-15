
import { GoogleGenAI } from "@google/genai";
import { UserRole, ChargingPoint, Booking } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface AssistantContext {
  role: UserRole;
  chargers: ChargingPoint[];
  bookings: Booking[];
}

const getSystemInstruction = (context: AssistantContext): string => {
  const chargersContext = JSON.stringify(context.chargers.map(c => ({
    name: c.name,
    address: c.address,
    type: c.chargerType,
    price: c.pricePerHour
  })), null, 2);

  const bookingsContext = JSON.stringify(context.bookings.map(b => ({
    chargerId: b.chargerId,
    start: b.startTime,
    end: b.endTime,
    status: b.status,
    cost: b.totalCost
  })), null, 2);

  if (context.role === UserRole.Host) {
    return `You are an expert business assistant for 'CargaVecina', a P2P EV charging platform in Chile.
    The user is a 'Host' who owns charging stations.
    Your goal is to help them manage their business, analyze data, and provide smart recommendations.
    You must be concise, helpful, and use Chilean currency (CLP) where appropriate.
    Current Host's Chargers Data:
    ${chargersContext}
    Current Host's Bookings Data:
    ${bookingsContext}
    `;
  } else {
    return `You are a helpful assistant for 'CargaVecina', a P2P EV charging platform in Chile.
    The user is a 'Driver' looking to charge their electric vehicle.
    Your goal is to help them find the best charging options based on their needs.
    You must be concise, friendly, and use Chilean currency (CLP) where appropriate.
    Available Chargers Data:
    ${chargersContext}
    Driver's Bookings Data:
    ${bookingsContext}
    `;
  }
};


export const getAssistantResponse = async (prompt: string, context: AssistantContext): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(context);
    const fullPrompt = `Based on my role as a ${context.role} and the provided data, please answer the following: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, no pude procesar tu solicitud en este momento. Por favor, asegúrate que la API Key esté configurada.";
  }
};
