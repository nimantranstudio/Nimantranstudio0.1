import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

export async function uploadTemplateFile(file: File): Promise<string> {
    if (!app) {
        throw new Error('Firebase is not initialised. Check your NEXT_PUBLIC_FIREBASE_* env vars.');
    }
    const storage = getStorage(app);
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `templates/${timestamp}-${safeName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}
