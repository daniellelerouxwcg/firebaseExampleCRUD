# Firebase Setup & Hosting Guide

This guide will walk you through setting up Firebase, configuring Firestore, integrating it with your web project, and deploying it using Firebase Hosting.

---

## 1. Firebase Setup

1. Go to [https://firebase.google.com/](https://firebase.google.com/) and log in with your Google account.

2. Open the Firebase Console: [https://console.firebase.google.com/](https://console.firebase.google.com/)

3. Click "Create a Firebase Project":

   * Enter a project name.
   * A unique project identifier will be generated (editable if desired).
   * Accept default configurations, but set Analytics location to South Africa.

4. In your project overview (URL will look like [https://console.firebase.google.com/project/](https://console.firebase.google.com/project/)<your-project>/overview):

   * Go to Build → Firestore Database.
   * Choose Standard Edition.
   * Set Database ID and location to africa-south1 (Johannesburg).
   * Start in Production Mode (rules can be updated later).

### Firestore Security Rules

* For testing only:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /LaterLogs/{document} {
      allow read, write: if true;
    }
  }
}
```

> This allows anyone to access your database and is not safe for production.

* For production, enable authentication (e.g., Firebase Authentication):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /LaterLogs/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

> Only authenticated users can read/write.

> Note: Firebase config in your code is public; security is enforced via Firestore rules. Think of the config as your address, and the rules as your house keys.

### Add Firebase to Your Web App

1. In Project Overview, click Add App → Web App.
2. Enter your app name and check "Also set up Firebase Hosting".
3. Select Register App.
4. Copy the Firebase config snippet for your code setup (also available under Project Settings → General).

---

## 2. Code Setup

* Example project: [https://github.com/daniellelerouxwcg/firebaseExampleCRUD.git](https://github.com/daniellelerouxwcg/firebaseExampleCRUD.git)
* Important: Replace Firebase config in the code with your own, and ensure your Firestore collection matches your project.

---

## 3. Hosting

> Only do this after your code is complete and working.

### Install Firebase CLI

```
npm install -g firebase-tools
firebase --version   # Check installation
```

### Login to Firebase

```
firebase login
```

* A browser will open to authenticate with the same Google account used for your project.
* To confirm, run again:

```
firebase login
# Output: Already logged in as <your-email>
```

### Initialize Hosting

1. Navigate to your project folder (where index.html is located):

```
cd /path/to/your/project
```

2. Run:

```
firebase init
```

3. Follow the prompts:

   * Use arrow keys to select Hosting, then press Space and Enter.
   * Choose "Use an existing project" and select your Firebase project.
   * Specify the folder to deploy (use `.` for current folder).
   * Answer whether it is a single-page app (based on your routing setup).
   * Choose whether to configure GitHub deploys.

After initialization, you should see:

```
+  Wrote configuration info to firebase.json
+  Wrote project information to .firebaserc
+  Wrote .gitignore
+  Firebase initialization complete!
```

### Deploying Updates

* Each time you want to deploy a new version:

```
firebase deploy
```

* Successful deployment will show:

```
+  Deploy complete!
Project Console: https://console.firebase.google.com/project/<your-project>/overview
Hosting URL: https://<your-project>.web.app
```
