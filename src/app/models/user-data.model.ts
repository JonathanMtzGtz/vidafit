export interface UserData {
    photoURL?: string; // Optional, as it might not always be present
    // Add other properties that your user data might have here
    [key: string]: any; // Allow other properties
  }
  