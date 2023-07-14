import { auth, firestore, getDocById, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, EmailAuthProvider } from "@firebase/auth";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import debounce from 'lodash/debounce';
import { doc, getDoc, writeBatch } from "@firebase/firestore";


export default function LoginPage(props) {
    const { user, username } = useContext(UserContext);

    return(
        <>
            {user ? <SignOutButton /> : <SignInButton />}
        </>
    )
}

function SignInButton() {
    const singInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            // const user = result.user;
        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        }
    }

    const signInWithEmailPassword = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // The signed-in user info.
            // const user = result.user;
        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const errorEmail = error.email;
            // The AuthCredential type that was used.
            const credential = EmailAuthProvider.credential(email, password);
        }
    }

    return(
        <form onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
                email: { value: string };
                password: { value: string };
            };
            signInWithEmailPassword(target.email.value, target.password.value);
        }}>
            <input className={'block'} type="email" name="email" placeholder="Email" required />
            <input className={'block mt-2'} type="password" name="password" placeholder="Password" required />
            <button className=" mt-4 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
      login
  </span>
</button>        </form>);
}

export function SignOutButton() {
    const logOut = async () => {
        await signOut(auth);
    }
    return(
        <button onClick={logOut}>Sign Out</button>
    );
}

function UsernameForm() {
    const[textfieldValue, setTextfieldValue]  = useState('');
    const[loading, setLoading] = useState(false);
    const[isValid, setIsValid] = useState(false);

    const {user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        const userDocRef = doc(firestore, 'users', user.uid);
        const usernameDocRef = doc(firestore, 'usernames', textfieldValue);

        const batch = writeBatch(firestore);
        batch.set(userDocRef, { username: textfieldValue, photoURL: user.photoURL, displayName: user.displayName })
        batch.set(usernameDocRef, { uid: user.uid })

        await batch.commit();
    }

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setTextfieldValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setTextfieldValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(textfieldValue);
    }, [textfieldValue])
    

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length > 3) {
                // write in to database
                // make batch write
                const docSnap = await getDocById('usernames', username)
                setIsValid(!docSnap.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return(
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Username" value={textfieldValue} onChange={onChange} />
            <UsernameMessage username={textfieldValue} isValid={isValid} loading={loading} />
            <input type="submit" />
            <h3>Debug State</h3>
          <div>
            Username: {textfieldValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
}