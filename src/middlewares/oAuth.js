import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export default async function oAuth(req, res, next) {
  const credentials = req.body.credentials;
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials(credentials);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  next(gmail);
}