import { getApps, initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, type Firestore } from 'firebase/firestore';

import { getTaskCatalogVersion, setTaskCatalogVersion, upsertTaskCatalogItem } from '@/db/schema';
import { firebaseConfigFromEnv } from '@/lib/firebase/config';

type RemoteTask = {
  id: string;
  category: 'Mind' | 'Body' | 'Life' | 'Work';
  title: string;
  description: string;
  effortLevel: 'quick' | 'medium' | 'involved';
  isActive: boolean;
};

let _firestore: Firestore | null = null;

function getFirestoreInstance(): Firestore | null {
  if (_firestore) {
    return _firestore;
  }

  const config = firebaseConfigFromEnv();
  if (!config.apiKey || config.apiKey.startsWith('replace-with')) {
    return null;
  }

  try {
    const app = getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          projectId: config.projectId,
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          appId: config.appId,
          messagingSenderId: config.messagingSenderId,
        });

    _firestore = getFirestore(app);
    return _firestore;
  } catch {
    return null;
  }
}

function parseRemoteTask(id: string, data: Record<string, unknown>): RemoteTask | null {
  const category = data.category;
  const effortLevel = data.effortLevel;

  if (
    (category !== 'Mind' && category !== 'Body' && category !== 'Life' && category !== 'Work') ||
    (effortLevel !== 'quick' && effortLevel !== 'medium' && effortLevel !== 'involved') ||
    typeof data.title !== 'string' ||
    typeof data.description !== 'string'
  ) {
    return null;
  }

  return {
    id,
    category,
    effortLevel,
    title: data.title,
    description: data.description,
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
  };
}

export async function refreshTaskCatalogIfNeeded(): Promise<{ refreshed: boolean; version: number; imported: number }> {
  const firestore = getFirestoreInstance();
  const localVersion = await getTaskCatalogVersion();

  if (!firestore) {
    return { refreshed: false, version: localVersion, imported: 0 };
  }

  const versionSnap = await getDoc(doc(firestore, 'app_meta', 'task_catalog'));
  const remoteVersionRaw = versionSnap.exists() ? versionSnap.data().version : undefined;
  const remoteVersion = typeof remoteVersionRaw === 'number' ? remoteVersionRaw : localVersion;

  if (remoteVersion <= localVersion) {
    return { refreshed: false, version: localVersion, imported: 0 };
  }

  const tasksSnap = await getDocs(collection(firestore, 'tasks'));
  let imported = 0;

  for (const taskDoc of tasksSnap.docs) {
    const parsed = parseRemoteTask(taskDoc.id, taskDoc.data() as Record<string, unknown>);
    if (!parsed) {
      continue;
    }

    await upsertTaskCatalogItem({
      id: parsed.id,
      category: parsed.category,
      title: parsed.title,
      description: parsed.description,
      effortLevel: parsed.effortLevel,
      isActive: parsed.isActive,
    });
    imported += 1;
  }

  await setTaskCatalogVersion(remoteVersion);

  return { refreshed: true, version: remoteVersion, imported };
}

export const _testonly = {
  resetFirestoreInstance: () => {
    _firestore = null;
  },
};
