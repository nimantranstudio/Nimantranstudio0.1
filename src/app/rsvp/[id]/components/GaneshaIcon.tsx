'use client';

import React from 'react';

export const GaneshaIcon: React.FC<{ size?: number; className?: string }> = ({ size = 96, className }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ filter: 'drop-shadow(0 8px 18px rgba(180, 120, 60, 0.22))' }}
            aria-label="Lord Ganesha Emblem"
        >
            {/* Background Halo */}
            <circle cx="60" cy="60" r="46" fill="url(#ganeshaHaloGrad)" />

            {/* Lotus Base - Sage green base with dark outlines */}
            <path
                d="M30 95 C38 87 52 87 60 93 C68 87 82 87 90 95 C78 101 42 101 30 95 Z"
                fill="#82A694"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            {/* Lotus Inner Petal - Pastel Coral */}
            <path
                d="M42 95 C48 89 54 89 60 93 C66 89 72 89 78 95 C72 98 48 98 42 95 Z"
                fill="#DB9399"
                stroke="#2B1814"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />

            {/* Body / Dhoti - Rose Pink */}
            <path
                d="M37 75 C37 66 46 62 60 62 C74 62 83 66 83 75 C83 85 77 91 60 91 C43 91 37 85 37 75 Z"
                fill="#DB9399"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            {/* Dhoti Pleats / Waistband */}
            <path d="M52 70 C57 73 63 73 68 70" stroke="#2B1814" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M60 74 L60 88" stroke="#2B1814" strokeWidth="1.2" strokeLinecap="round" />

            {/* Shawl / Angavastram in Sage Teal draped on shoulders */}
            <path
                d="M33 69 C33 60 39 56 46 58 C43 69 45 81 39 85 C35 83 33 77 33 69 Z"
                fill="#82A694"
                stroke="#2B1814"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M87 69 C87 60 81 56 74 58 C77 69 75 81 81 85 C85 83 87 77 87 69 Z"
                fill="#82A694"
                stroke="#2B1814"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />

            {/* Arms */}
            {/* Left Upper Arm holding Ankusha / Axe */}
            <path
                d="M35 57 C29 53 29 44 36 42 C40 40 45 46 45 53"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            {/* Axe / Ankusha */}
            <path d="M26 34 L35 44" stroke="#8C4A32" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M28 32 C33 30 38 32 36 37 L31 41 Z" fill="#E8B042" stroke="#2B1814" strokeWidth="1.4" />

            {/* Right Upper Arm holding Modak Bowl */}
            <path
                d="M85 57 C91 53 91 44 84 42 C80 40 75 46 75 53"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            {/* Golden Modak in right hand */}
            <path d="M83 43 C87 40 92 43 89 48 C85 49 82 46 83 43 Z" fill="#F4CA64" stroke="#2B1814" strokeWidth="1.4" />

            {/* Large Elephant Ears */}
            {/* Left Ear */}
            <path
                d="M47 38 C31 36 27 46 29 57 C31 65 41 67 47 59"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M43 43 C35 43 33 49 35 55 C37 59 41 59 43 55"
                fill="#F2D1CA"
                stroke="#2B1814"
                strokeWidth="1.2"
            />

            {/* Right Ear */}
            <path
                d="M73 38 C89 36 93 46 91 57 C89 65 79 67 73 59"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M77 43 C85 43 87 49 85 55 C83 59 79 59 77 55"
                fill="#F2D1CA"
                stroke="#2B1814"
                strokeWidth="1.2"
            />

            {/* Head and Face Contour */}
            <path
                d="M43 37 C43 27 77 27 77 37 C79 45 77 55 60 55 C43 55 41 45 43 37 Z"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />

            {/* Golden Mukut (Crown) */}
            <path
                d="M47 28 L60 12 L73 28 C68 31 52 31 47 28 Z"
                fill="#F4CA64"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            {/* Crown center inlay in Rose */}
            <path d="M53 28 L60 17 L67 28 Z" fill="#DB9399" stroke="#2B1814" strokeWidth="1.2" />
            {/* Crown Top Ruby Gem */}
            <circle cx="60" cy="12" r="2.8" fill="#D94848" stroke="#2B1814" strokeWidth="1.2" />

            {/* Crown Base Teal Band */}
            <path
                d="M45 28 C53 30 67 30 75 28 L74 33 C66 35 54 35 46 33 Z"
                fill="#82A694"
                stroke="#2B1814"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />

            {/* Red Tilak on Forehead (Trishul/Tilak shape) */}
            <path
                d="M58 29 C58 29 60 25 62 29 C62 35 60 40 60 40 C60 40 58 35 58 29 Z"
                fill="#D94848"
            />
            <circle cx="60" cy="42" r="1.8" fill="#D94848" />

            {/* Expressive Eyes */}
            <path d="M49 38 C52 37 54 37 56 39" stroke="#2B1814" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="53" cy="40" r="1.3" fill="#2B1814" />

            <path d="M71 38 C68 37 66 37 64 39" stroke="#2B1814" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="67" cy="40" r="1.3" fill="#2B1814" />

            {/* Trunk gracefully curling towards the left holding Modak */}
            <path
                d="M56 46 C56 57 53 67 47 71 C43 74 37 70 39 66 C42 63 46 64 47 62 C48 58 50 52 52 46"
                fill="#FDF0DF"
                stroke="#2B1814"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Trunk yellow decorative stripes */}
            <path d="M50 53 C53 54 56 54 58 53" stroke="#F4CA64" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M48 59 C51 60 54 60 56 59" stroke="#F4CA64" strokeWidth="1.8" strokeLinecap="round" />

            {/* Ivory Tusk */}
            <path d="M66 48 L71 52 L66 53 Z" fill="#FFFFFF" stroke="#2B1814" strokeWidth="1.2" />

            {/* Modak on trunk tip */}
            <circle cx="38" cy="65" r="3.2" fill="#F4CA64" stroke="#2B1814" strokeWidth="1.2" />

            {/* Gradient definition */}
            <defs>
                <radialGradient id="ganeshaHaloGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF4DE" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#FDE3B5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FDE3B5" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};
