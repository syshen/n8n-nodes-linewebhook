# n8n-nodes-_node-name_

This is an n8n Line webhook node. It lets you use create a webhook node for your line chatbot.

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

_If users need to authenticate with the app/service, provide details here. You should include prerequisites (such as signing up with the service), available authentication methods, and how to set them up._

## Compatibility

_State the minimum n8n version, as well as which versions you test against. You can also include any known version incompatibility issues._

## Usage

_This is an optional section. Use it to help users with any difficult or confusing aspects of the node._

_By the time users are looking for community nodes, they probably already know n8n basics. But if you expect new users, you can link to the [Try it out](https://docs.n8n.io/try-it-out/) documentation to help them get started._

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* _Link to app/service documentation._

## Version history

_This is another optional section. If your node has multiple versions, include a short description of available versions and what changed, as well as any compatibility impact._


