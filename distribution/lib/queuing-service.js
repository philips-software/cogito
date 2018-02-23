'use strict';

const base64url = require('base64url');
const fetch = require('cross-fetch');
const { Request } = fetch;

class QueuingService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async send(queueId, message) {
    const url = `${this.baseUrl}/${queueId}`;
    const body = base64url.encode(Buffer.from(message));
    const response = await fetch(new Request(url, { method: 'POST', body }));
    if (!response.ok) {
      throw new Error(`sending failed (${response.status})`);
    }
  }

  async receive(queueId) {
    const response = await fetch(`${this.baseUrl}/${queueId}`);
    if (!response.ok) {
      throw new Error(`receiving failed (${response.status})`);
    }
    if (response.status === 204) {
      return null;
    }
    return base64url.toBuffer((await response.text()));
  }
}

module.exports = QueuingService;