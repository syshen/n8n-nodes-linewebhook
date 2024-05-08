# n8n-nodes-linewebhook

This is an n8n Line webhook node. It lets you create a webhook n8n node for your line chatbot.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->  

## Installation

### Community Nodes (Recommended)

1. Go to Settings > Community Nodes.
2. Select Install.
3. Enter n8n-nodes-linewebhook in Enter npm package name.
4. Agree to the risks of using community nodes: select I understand the risks of installing unverified code from a public source.
5. Select Install.
After installing the node, you can use it like any other node. n8n displays the node in search results in the Nodes panel.

!(images/installation.png "Community node installation")

### Manual installation

To get started install the package in your n8n root directory:

```
npm install n8n-nodes-linewebhook
```

For Docker-based deployments, add the following line before the font installation command in your n8n Dockerfile:

RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-linewebhook

## Operations

_List the operations supported by your node._

## Credentials

1. Sign up on [Line Developer Console](https://developers.line.biz/en/)
2. Create a messaging API channel, and then copy the channel secret
3. Paste the channel secret in node's credential setting
4. Configure the Webhook URL in the messaging API settings

!(images/channel_secret.png "Set up channel secret")

## Compatibility

_State the minimum n8n version, as well as which versions you test against. You can also include any known version incompatibility issues._

## Usage


## Resources


## Version history


