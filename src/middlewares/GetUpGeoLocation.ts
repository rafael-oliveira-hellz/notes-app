import { SuperfaceClient } from '@superfaceai/one-sdk';
import { Request } from 'express';
import dns from 'node:dns';
import logger from '../config/winston-logger';

dns.setDefaultResultOrder('ipv4first');
const sdk = new SuperfaceClient();

export const run = async (ip: string) => {
  // Load the profile
  const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');

  // Use the profile
  const result = await profile.getUseCase('IpGeolocation').perform(
    {
      ipAddress: ip,
    },
    {
      provider: 'ipdata',
      security: {
        apikey: {
          apikey: process.env.IPDATA_KEY,
        },
      },
    }
  );

  // Handle the result
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    logger.error(error);
  }
};

export const getIP = (req: Request) => {
  const conRemoteAddress = req.connection?.remoteAddress;
  const socketRemoteAddress = req.socket?.remoteAddress;
  const xRealIP = req.headers['x-real-ip'];
  const xForwardedForIP = (() => {
    const xForwardedFor = req.headers['x-forwarded-for'];

    if (xForwardedFor) {
      if (typeof xForwardedFor === 'string') {
        const ip = xForwardedFor.split(',').map((ip: string) => ip.trim());

        return ip[0];
      }

      return xForwardedFor[0];
    }
  })();

  return xForwardedForIP || xRealIP || socketRemoteAddress || conRemoteAddress;
};

/**

in the controller, use:

app.get("/", async (req, res) => {
  const ip = getIP(req);

  console.log("getIP function response: ", ip);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const IpGeolocation = await run(ip);

  console.log("req.ip response: ", ip);

  res.json({
    status: 200,
    message: "Success",
    IpGeolocation,
  });
});

  */
