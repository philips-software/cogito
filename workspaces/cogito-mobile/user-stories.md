Cogito Mobile - User Stories outline
======

In these stories I assume that we are either going to support the old architecture, or create a
stubbed version of architecture that can be replaced with the new once the new architecture is under
development. This however shouldn't stop developing the mobile version.

My preference would be to make the mobile version in a way that the screens and underlying
architecture are separate (different concerns) but use the 'old' way, so that at least you have an
application that works end to end and can be used. An application that doesn't work end-to-end has
zero business value.

## As a user I want to add my first identity, so I can be someone in the digital world

The user has just installed the app and opens it for the very first time. He sees a screen with a
"welcome message" which can be the words "Who am I?" (HomeScreen). He can press on the text and a
new screen appears where he can fill in a name with a "Create" button. The name is not allowed to be
empty.
After he creates his first identity he is returned to the HomeScreen and his identity is shown.

Acceptance criteria:

- Home Screen: Show welcome message (Currently "Who am I?")
- New Identity: Create first identity screen
- New Identity: Validate identity
- New Identity: When succesfull go back to HomeScreen
- Home Screen: Show name of first / active identity

Technical requirements:
- Create keys (crypto) and store on device

## As a user I want to make sure that I am the only person to use my identity on my phone / Want to protect my identity

Make sure that the user sets a pin code for his phone and redirect to the settings when possible.

Acceptance criteria:
- Check the settings when the user wants to create their first identity
- Check the settings each time the user wants to do something with a key and prompt when the protection has been
turned off.
- If technically possible; redirect the user to the specific settings on their phone
- Store keys encrypted on the device using the pass code?

## As a user I can scan a QR code, so I can set up a connection to start using my identity

In order to use a digital identity the user needs to connect it to an application to actually be
able to use it. It needs to set up a connection (Telepath). It uses a QR code in order to do that.
The mobile application needs to have access to the camera and be able to scan and read a QR code and
navigate to the URL that is in the QR code.

## As a developer I want an icon for the mobile application, so that users can easily identify the mobile application on their phone

Add an icon for the application and take note of the name it shows on the mobile device

## As a user I can show my identity, so I can make use of a particular service

```
In theory, after the first user stories you have an app that can work with one identity that can be
used with the demo app. A Minimal Viable Product of sorts.
```

## As a user I can sign

## As a user I can encrypt/decrypt messages, so I can send secret messages

## As a user I can see a list of digital identities, so I have an overview of the identities on my device

Show all the identities in a list that are present on the device of the user. The user has an
overview of all the identities that are present.

Acceptance criteria:
- Menu item to navigate to the list view
- List View: Show all the identities that are present
- Way to navigate back to the HomeScreen

## As a user I can view the details of my identity, so I can see all the information

The user can select an identity in the list view and view all the details for that particular
identity. These details include the creation datetime, public key and the name of the identity.

Acceptance criteria:
- Navigation to and from details screen
- Details screen: Show all the data for that identity

## As a user I can add additional identities, so I can use them for different purposes

The user can create more than one identity and separate different purposes for those identities.
E.g. Home and Work. They are completely separate from each other and have no connection other than
that they are present on the same device.

Acceptance criteria:
- Navigation to and from 'New Identity' screen
- New Identity: 'Create new identity' screen
- New Identity: Validate identity
- New Identity: When succesfull go back to HomeScreen
- Home Screen: Make new identity the active one?
- Home Screen: Show name of new as active identity

## As a developer I want to make sure the back button works properly, so that it will improve the experience of the users when navigating the app

I hate it when the back button does unexpected things. This user story is a reminder to check that
and improve when necessary. The back button should not be a stack of all the screens the user has
navigated to before. But a logical tree. This might require updating the navigation stack. In
Android the back button can also be used to go back to the phone's main screen when you are in the
Main Screen of the application.

How does this work for iOS? Swiping left and right?

## As a user I can use my identity, so <fill in reason>

## As I user I can edit my identity, so I can correct any typos in the metadata that I made
Updated_at? Keep track of history of edits?

## Epic: History

Keep track of everything that happens with a certain digital identity. But we need to investigate
what that will entail and create stories based on that. Currently the mobile application doesn't do
that.

## Epic: Backup of digital identities

Currently when a user loses their phone, or something happens with it he will use all the identities
that are on the device. There is no possibility to recover any of it. When a user has build his
identity and has access to multiple services this is a real inconvenience.

How are we going to handle this scenario?


Discussion topics and Questions
=====

## Do we need technical user stories to set up the details of communication with (demo) applications?

## Which formats / devices do we want to support. Do we also want to support tablets?

## What is the offline user experience?

## User Experience: Does the mobile user interface give enough clues on how to use the application / navigate?
How can we improve the user experience? What are the general guidelines? How important do we find
the native experience in order to come with an improved / more attractive design while still
respecting the native user experience guidelines?

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)
- [Google's Material Design Guidelines](https://material.io/design/)

## Reasons to use Cogito / Digital Identities for the real world. Why would someone want to 'buy' this?
Why, as a user, would I want to have a digital identity? What benefits does it bring me? Not only
from a developer / company perspective. But why should I want to use this specific method in order
to use their services when there are other options, possibly with other companies. Convince me from
a user / people perspective!

Reasons:
- With a digital identity that is connected to your real world identity (passport) you can testify
that you are 'older than 18' without having to give away other sensitive information. (To buy alcohol or tabacco, or access to clubs)
- A lot of organizations have a lot of data about you, but you have no overview of what data that
is. The Digid only provides a BSN, but the organization has to connect that to other information.
You have no control over the information and what happens to it.
- You have one login for all your digital websites (the ones that support Cogito) and you have
control over what information they have of you. You can even revoke your access. The website /
organization then has no information about you anymore.
- Protection of your privacy

## Why Cogito over Irma, or other Digital Identity providers? What is Cogito's unique selling point?


