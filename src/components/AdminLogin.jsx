import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [lastAttemptTime, setLastAttemptTime] = useState(0);

    // SHA-256 hash for "admin"
    const ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

    const hashPassword = async (string) => {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const hashedPassword = await hashPassword(password);

        if (hashedPassword === ADMIN_HASH) {
            const now = Date.now();

            // Double-Tap Logic
            if (attempts === 0) {
                // First correct attempt: Fake error
                setError('Mot de passe incorrect');
                setAttempts(1);
                setLastAttemptTime(now);
            } else if (attempts === 1) {
                // Second attempt
                const timeDiff = now - lastAttemptTime;

                if (timeDiff < 20000) { // 20 seconds window
                    // Success!
                    onLogin();
                } else {
                    // Too slow, reset
                    setError('Mot de passe incorrect'); // Resetting, but showing error to keep illusion
                    setAttempts(1); // Treat as first attempt again? Or reset to 0? 
                    // Logic says: "Si l'utilisateur entre le bon mot de passe une 2ème fois consécutive (dans un intervalle court)"
                    // If too slow, it's like a new first attempt.
                    setLastAttemptTime(now);
                }
            }
        } else {
            // Wrong password
            setError('Mot de passe incorrect');
            // Don't reset attempts immediately to avoid giving clues? 
            // Actually, if they type wrong password, we should probably reset the "Double-Tap" sequence 
            // or just keep it simple. Let's reset to be safe against brute force trying to guess the "state".
            setAttempts(0);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <div className="w-full max-w-md p-8 bg-mitake-black/50 border border-mitake-red/30 rounded-lg backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-mitake-red/10 rounded-full">
                        <Lock className="w-8 h-8 text-mitake-red" />
                    </div>
                </div>

                <h2 className="text-2xl font-serif text-center text-mitake-offwhite mb-6">Accès Staff</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            className="w-full px-4 py-3 bg-black/30 border border-mitake-red/20 rounded focus:outline-none focus:border-mitake-red text-mitake-offwhite placeholder-white/20 transition-colors"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-mitake-red text-white font-medium rounded hover:bg-red-700 transition-colors duration-300"
                    >
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
