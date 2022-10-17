import { useContext } from "react";
import AuthCheck from "../../components/AuthCheck/AuthCheck";
import UserProfile from "../../components/UserProfile/UserProfile";
import { UserContext } from "../../lib/context";
import { getUserFromUsername } from "../../lib/firebase";
import { SignOutButton } from "../login";

export default function UserProfilePage() {
    const { user, username } = useContext(UserContext);
    return(
        <AuthCheck>
            <main>
                <UserProfile user={user} />
                <SignOutButton />
            </main>
        </AuthCheck>
    )
}