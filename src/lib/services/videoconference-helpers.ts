import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * Helper functions for videoconference service
 */

// Zoom helpers
export function getZoomJWT(apiKey: string, apiSecret: string): string {
  const payload = {
    iss: apiKey,
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  };

  return jwt.sign(payload, apiSecret);
}

export function getZoomRecurrenceType(type: string): number {
  switch (type) {
    case 'daily':
      return 1;
    case 'weekly':
      return 2;
    case 'monthly':
      return 3;
    default:
      return 1;
  }
}

// BigBlueButton helpers
export function generateBBBChecksum(action: string, queryString: string, secret: string): string {
  return crypto
    .createHash('sha1')
    .update(action + queryString + secret)
    .digest('hex');
}

export function objectToQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
}

export function generateBBBJoinUrl(
  baseUrl: string, 
  meetingId: string, 
  userId: string, 
  userName: string, 
  password: string, 
  secret: string
): string {
  const params = {
    meetingID: meetingId,
    userID: userId,
    fullName: userName,
    password: password
  };

  const queryString = objectToQueryString(params);
  const checksum = generateBBBChecksum('join', queryString, secret);

  return `${baseUrl}/api/join?${queryString}&checksum=${checksum}`;
}

export function getXmlElement(xml: string, path: string): string {
  const parts = path.split('/');
  let result = xml;

  for (const part of parts) {
    const regex = new RegExp(`<${part}[^>]*>(.*?)<\/${part}>`, 's');
    const match = result.match(regex);
    
    if (!match) {
      return '';
    }
    
    result = match[1];
  }

  return result.trim();
}

export function getXmlElements(xml: string, element: string): any[] {
  const regex = new RegExp(`<${element}[^>]*>(.*?)<\/${element}>`, 'gs');
  const matches = [...xml.matchAll(regex)];
  
  return matches.map(match => match[0]);
}

// General helpers
export function calculateDurationInMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  return Math.ceil(durationMs / (1000 * 60)); // Convert ms to minutes and round up
}
