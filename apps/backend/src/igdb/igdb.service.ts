import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

interface IGDBResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class IgdbService implements OnModuleInit {
  private readonly logger = new Logger(IgdbService.name);

  private IGDB_BASE_URL = 'https://api.igdb.com/v4';
  private AUTH_URL = 'https://id.twitch.tv/oauth2/token';

  private CLIENT_ID = process.env.IGDB_CLIENT_ID;
  private CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
  private GRANT_TYPE = 'client_credentials';

  private urlWithParams = new URLSearchParams({
    client_id: this.CLIENT_ID,
    client_secret: this.CLIENT_SECRET,
    grant_type: this.GRANT_TYPE,
  }).toString();

  private accessToken: string | null = null; // access token
  private tokenExpiresAt: number = 0; // expiration time

  async onModuleInit() {
    await this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      this.logger.log('Refreshing IGDB API token...');

      const response = await fetch(`${this.AUTH_URL}?${this.urlWithParams}`, {
        method: 'POST',
      });

      const data = (await response.json()) as IGDBResponse;

      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000; // s to ms
      this.logger.log('IGDB API token refreshed successfully.');
    } catch (error) {
      this.logger.error('Failed to refresh IGDB API token', error);
      throw new Error('Failed to authenticate with IGDB.');
    }
  }

  async request<T>(endpoint: string, query: string): Promise<T> {
    const headers = {
      'Client-ID': this.CLIENT_ID,
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'text/plain',
      Accept: 'application/json',
    };

    if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
      await this.refreshAccessToken();
    }

    try {
      const response = await fetch(`${this.IGDB_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: query,
      });

      return (await response.json()) as T;
    } catch (error) {
      this.logger.error(`IGDB API request failed: ${endpoint}`, error);
      throw new Error('IGDB API request failed.');
    }
  }
}
