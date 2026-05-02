import React from 'react';

interface LogoDokuProps {
    size?: string; // Pour contrôler la taille (ex: "w-10", "w-40")
    showText?: boolean; // Pour afficher ou non le nom "DOKU"
}

const LogoDoku: React.FC<LogoDokuProps> = ({ size = "w-20", showText = true }) => {
    return (
        <div className={`flex items-center gap-0 ${size}`}>
            {/* ══════════════════════════════════════════
           COMPOSANT : Treadmill Loader [source: 1]
      ════════════════════════════════════════════ */}
            <svg
                viewBox="205 110 245 135"
                xmlns="http://www.w3.org/2000/svg"
                fill="#f97316" /* Orange-500 Tailwind */
                className="h-10 w-auto"
            >
                <style>
                    {`
            @keyframes bounce-run { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
            @keyframes upperArmF { 0%, 100% { transform: rotate(-60deg); } 50% { transform: rotate(35deg); } }
            @keyframes foreArmF { 0%, 100% { transform: rotate(80deg); } 50% { transform: rotate(75deg); } }
            @keyframes upperArmB { 0%, 100% { transform: rotate(35deg); } 50% { transform: rotate(-60deg); } }
            @keyframes foreArmB { 0%, 100% { transform: rotate(75deg); } 50% { transform: rotate(80deg); } }
            @keyframes legF { 0%, 100% { transform: rotate(-55deg); } 50% { transform: rotate(45deg); } }
            @keyframes shinF { 0%, 100% { transform: rotate(5deg); } 50% { transform: rotate(60deg); } }
            @keyframes legB { 0%, 100% { transform: rotate(45deg); } 50% { transform: rotate(-55deg); } }
            @keyframes shinB { 0%, 100% { transform: rotate(60deg); } 50% { transform: rotate(5deg); } }

            .animate-bounce-run  { animation: bounce-run  0.5s ease-in-out infinite; transform-origin: 316px 218px; }
            .animate-upper-arm-f { animation: upperArmF   0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-fore-arm-f  { animation: foreArmF    0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-upper-arm-b { animation: upperArmB   0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-fore-arm-b  { animation: foreArmB    0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-leg-f       { animation: legF        0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-shin-f      { animation: shinF       0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-leg-b       { animation: legB        0.5s ease-in-out infinite; transform-origin: 0 0; }
            .animate-shin-b      { animation: shinB       0.5s ease-in-out infinite; transform-origin: 0 0; }
          `}
                </style>

                {/* TREADMILL [source: 1] */}
                <rect x="210" y="218" width="230" height="16" rx="8" />
                <rect x="410" y="190" width="28" height="44" rx="8" />
                <rect x="212" y="228" width="36" height="10" rx="5" />

                {/* RUNNER [source: 1] */}
                <g className="animate-bounce-run">
                    <circle cx="316" cy="136" r="13" />
                    <path d="M308,149 Q310,150 316,150 Q322,150 324,149 L326,176 Q322,178 316,178 Q310,178 306,176 Z" />

                    <g transform="translate(312,156)">
                        <g className="animate-upper-arm-b">
                            <rect x="-4" y="0" width="8" height="17" rx="4" />
                            <g transform="translate(0,17)"><g className="animate-fore-arm-b"><rect x="-3.5" y="-17" width="7" height="18" rx="3.5" /></g></g>
                        </g>
                    </g>

                    <g transform="translate(320,156)">
                        <g className="animate-upper-arm-f">
                            <rect x="-4" y="0" width="8" height="17" rx="4" />
                            <g transform="translate(0,17)"><g className="animate-fore-arm-f"><rect x="-3.5" y="-17" width="7" height="18" rx="3.5" /></g></g>
                        </g>
                    </g>

                    <g transform="translate(316,176)">
                        <g className="animate-leg-b">
                            <rect x="-5" y="0" width="10" height="22" rx="5" />
                            <g transform="translate(0,21)"><g className="animate-shin-b"><rect x="-4.5" y="0" width="9" height="20" rx="4.5" /></g></g>
                        </g>
                    </g>

                    <g transform="translate(316,176)">
                        <g className="animate-leg-f">
                            <rect x="-5" y="0" width="10" height="22" rx="5" />
                            <g transform="translate(0,21)"><g className="animate-shin-f"><rect x="-4.5" y="0" width="9" height="20" rx="4.5" /></g></g>
                        </g>
                    </g>
                </g>
            </svg>
            {showText && (
                <span className="text-xl font-bold text-orange-500 tracking-tighter translate-y-1.5 leading-none">
                    DOKU
                </span>
            )}
        </div>
    );
};

export default LogoDoku;