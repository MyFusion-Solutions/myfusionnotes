
export interface CrmProvider {
  createNote(contactEmail: string, title: string, content: string): Promise<boolean>;
  findContact(email: string): Promise<string | null>;
}

export class KeapProvider implements CrmProvider {
  private apiKey: string;
  private domain: string; // Used for some legacy implementations or just metadata

  constructor(apiKey: string, domain: string) {
    this.apiKey = apiKey;
    this.domain = domain;
  }

  // Helper for requests
  private async request(endpoint: string, method: string = 'GET', body: any = null) {
      const headers = {
          'Content-Type': 'application/json',
          'X-Keap-API-Key': this.apiKey // Hypothetical header, or Bearer if OAuth
          // Note: Real Keap usually uses OAuth access tokens. 
          // If the user input is a Service Key (Legacy) or PAT, it might differ.
          // For 2025 modern Keap, it's likely Bearer Token. 
          // We will assume the 'apiKey' stored is a valid Access Token for this MVP.
      };

      const config: RequestInit = {
          method,
          headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
          }
      };

      if (body) {
          config.body = JSON.stringify(body);
      }

      const res = await fetch(`https://api.infusionsoft.com/crm/rest/v1${endpoint}`, config);
      if (!res.ok) {
          const error = await res.text();
          console.error(`Keap API Error [${endpoint}]:`, error);
          throw new Error(`Keap API Error: ${res.statusText}`);
      }
      return res.json();
  }

  async findContact(email: string): Promise<string | null> {
    try {
        const data = await this.request(`/contacts?email=${encodeURIComponent(email)}`);
        if (data.contacts && data.contacts.length > 0) {
            return data.contacts[0].id;
        }
        return null;
    } catch (e) {
        console.error("Failed to find contact", e);
        return null; 
    }
  }

  async createNote(contactEmail: string, title: string, content: string): Promise<boolean> {
    const contactId = await this.findContact(contactEmail);
    
    if (!contactId) {
      // Option: Create Contact if not found?
      // For now, fail safe.
      console.warn(`Contact ${contactEmail} not found in Keap.`);
      return false;
    }

    try {
        // Keap Note Schema
        const notePayload = {
            contact_id: parseInt(contactId as string),
            title: title,
            body: content,
            type: 'Other' // or 'Appointment', 'Call', etc.
        };

        await this.request('/notes', 'POST', notePayload);
        return true;
    } catch (e) {
        console.error("Failed to create note", e);
        return false;
    }
  }
}

// Factory
export function getCrmProvider(type: string, credentials: any): CrmProvider {
  switch (type.toLowerCase()) {
    case 'keap':
    case 'crm': 
       return new KeapProvider(credentials.apiKey, credentials.domain || '');
    default:
      console.warn(`Unknown provider ${type}, falling back to Keap (Mock/Real)`);
       return new KeapProvider(credentials.apiKey, '');
  }
}
