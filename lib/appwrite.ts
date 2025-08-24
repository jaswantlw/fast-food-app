import { CreateUserPrams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  categoriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
  customizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID!,
  menuCustomizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID!,
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = await avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    await account.createEmailPasswordSession(email, password);
    const user = await getCurrentUser();
    console.log("Appwrite user:", user); // Debug log
    return user;
  } catch (error) {
    console.error("Appwrite error:", error); // Debug log
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log("getCurrentUser result:", user); // Debug log
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error); // Debug log
    throw error;
  }
};

export const logout = async () => {
  try {
    // Delete the current session (logs out only the logged-in device/session)
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(error as string);
  }
};
