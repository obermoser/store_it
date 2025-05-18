"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from '../appwrite/config';
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

// In case an error occurs, handle it here
const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}


// #region Get the current user by mail 
const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", email)],
    );
    return result.total > 0 ? result.documents[0] : null;
}
// #endregion

// #region Send OTP to Mail
export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId
    } catch (error) {
        handleError(error, "Error sending Email OTP");
    }
}
// #endregion

// #region Account creation
export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");
    if (!existingUser) {
        const { databases } = await createAdminClient()
        await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, ID.unique(), {
            fullName,
            email,
            avatar: "https://avatar.iran.liara.run/public",
            accountId
        });
    }
    return parseStringify({ accountId });
}
// #endregion

export const verifySecret = async ({ accountId, password }: { accountId: string, password: string }) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set("appwrite-session", session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: true
        });
        return parseStringify({ sessionId: session.$id })
    } catch (error) {
        console.warn("Failed to verify OTP: ", error)
    }
}

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);

        // User exists, send OTP
        if (existingUser) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existingUser.accountId });
        }

        return parseStringify({ accountId: null, error: "User not found" });
    } catch (error) {
        handleError(error, "Failed to sign in user");
    }
};