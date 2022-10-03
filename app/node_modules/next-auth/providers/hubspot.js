"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HubSpot;
const HubSpotConfig = {
  authorizationUrl: "https://app.hubspot.com/oauth/authorize",
  tokenUrl: "https://api.hubapi.com/oauth/v1/token",
  profileUrl: "https://api.hubapi.com/oauth/v1/access-tokens"
};

function HubSpot(options) {
  return {
    id: "hubspot",
    name: "HubSpot",
    type: "oauth",
    ...HubSpotConfig,
    authorization: {
      url: HubSpotConfig.authorizationUrl,
      params: {
        scope: "oauth",
        client_id: options.clientId
      }
    },
    client: {
      token_endpoint_auth_method: "client_secret_post"
    },
    token: HubSpotConfig.tokenUrl,
    userinfo: {
      url: HubSpotConfig.profileUrl,

      async request(context) {
        const url = `${HubSpotConfig.profileUrl}/${context.tokens.access_token}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "GET"
        });
        const userInfo = await response.json();
        return {
          userInfo
        };
      }

    },

    profile(profile) {
      const {
        userInfo
      } = profile;
      return {
        id: userInfo.user_id,
        name: userInfo.user,
        email: userInfo.user,
        image: null
      };
    },

    options
  };
}