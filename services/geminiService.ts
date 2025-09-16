import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A wrapper function to retry a failing API call.
 * @param apiCall The function that makes the API call.
 * @param maxRetries The maximum number of retries.
 * @param delay The delay between retries in milliseconds.
 * @returns The result of the API call.
 */
const callGeminiApiWithRetries = async <T>(
    apiCall: () => Promise<T>, 
    maxRetries = 3, 
    delay = 1000
): Promise<T> => {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            console.error(`API call attempt ${i + 1} of ${maxRetries} failed. Retrying in ${delay}ms...`, error);
            lastError = error as Error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff could be used here too
        }
    }
    throw lastError ?? new Error("API call failed after multiple retries.");
};


export const changeCarColor = async (
    base64ImageData: string,
    mimeType: string,
    colorName: string
): Promise<string | null> => {
    const model = 'gemini-2.5-flash-image-preview';
    
    try {
        const apiCall = () => ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: `Change only the car's paint color to ${colorName}. The background and all other details must remain exactly the same. If the car has a license plate, change the text on it to read "XPEL".`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // FIX: Explicitly type the 'response' variable to fix type inference issues.
        const response: GenerateContentResponse = await callGeminiApiWithRetries(apiCall);
        
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        return null; 
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to change car color. The AI service may be temporarily unavailable.");
    }
};

export const changeCarEnvironment = async (
    base64ImageData: string,
    mimeType: string,
    colorName: string,
    environment: 'studio' | 'timesSquare' | 'shibuyaCrossing'
): Promise<string | null> => {
    const model = 'gemini-2.5-flash-image-preview';

    let finalPrompt = '';
    switch (environment) {
        case 'studio':
            finalPrompt = `Place this ${colorName} car in a clean, professional photo studio. The background and lighting should be themed with the car's ${colorName} color to create a cohesive, monochromatic look. Generate realistic shadows and reflections on the car.`;
            break;
        case 'timesSquare':
            finalPrompt = `Place this ${colorName} car in the middle of Times Square, New York City, at night. The square should be empty of people and other cars. The billboards must advertise "XPEL" and "XDC", and their color scheme, along with the ambient city lights, should match the car's ${colorName} color. Ensure realistic lighting and reflections on the car from the screens.`;
            break;
        case 'shibuyaCrossing':
            finalPrompt = `Place this ${colorName} car in the middle of Shibuya Crossing, Tokyo, at night. The crossing should be empty of people and other cars. The billboards and neon signs must advertise "XPEL" and "XDC", and their color scheme, along with the ambient city lights, should match the car's ${colorName} color. Ensure realistic lighting and reflections on the car from the neon signs.`;
            break;
    }

    try {
        const apiCall = () => ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: finalPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        // FIX: Explicitly type the 'response' variable to fix type inference issues.
        const response: GenerateContentResponse = await callGeminiApiWithRetries(apiCall);
        
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        return null; 
    } catch (error) {
        console.error("Error calling Gemini API for environment change:", error);
        throw new Error("Failed to change car environment. The AI service may be temporarily unavailable.");
    }
};