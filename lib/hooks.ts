import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from "@firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";



export function useUserData() {
    const user = auth.currentUser;
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    onAuthStateChanged(auth, (user) => {
        let unsubscribe;
        if (user) {
            const docRef = doc(firestore, 'users', user.uid);
            unsubscribe = onSnapshot(docRef, (doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }
        setLoading(false);
        return unsubscribe;
    })
    return {user, username, loading};
}